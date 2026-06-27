from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile, pefile, joblib, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bundle = joblib.load("extratrees_bundle.pkl")
model = bundle["model"]
expected_columns = bundle["schema"]
scaler = bundle["scaler"]

# In-memory storage
recent_scans = []
stats = {"scans_today": 0, "threats_detected": 0, "clean_files": 0}

def extract_required_features(file_path):
    pe = pefile.PE(file_path, fast_load=1)
    pe.parse_data_directories()
    dll_count = 0
    api_calls = 0
    if hasattr(pe, "DIRECTORY_ENTRY_IMPORT"):
        dll_count = len(pe.DIRECTORY_ENTRY_IMPORT)
        api_calls = sum(len(entry.imports) for entry in pe.DIRECTORY_ENTRY_IMPORT)
    features = {
        "text_VirtualSize": 0,
        "rdata_PointerToRawData": 0,
        "rdata_VirtualAddress": 0,
        "SizeOfUninitializedData": pe.OPTIONAL_HEADER.SizeOfUninitializedData,
        "SizeOfInitializedData": pe.OPTIONAL_HEADER.SizeOfInitializedData,
        "EntryPoint": pe.OPTIONAL_HEADER.AddressOfEntryPoint,
        "text_PointerToRawData": 0,
        "SizeOfHeaders": pe.OPTIONAL_HEADER.SizeOfHeaders,
        "text_SizeOfRawData": 0,
        "SectionAlignment": pe.OPTIONAL_HEADER.SectionAlignment,
        "dll_count": dll_count,
        "api_calls": api_calls
    }
    for section in pe.sections:
        name = section.Name.decode(errors="ignore").strip('\x00')
        if name == ".text":
            features["text_VirtualSize"] = section.Misc_VirtualSize
            features["text_PointerToRawData"] = section.PointerToRawData
            features["text_SizeOfRawData"] = section.SizeOfRawData
        elif name == ".rdata":
            features["rdata_PointerToRawData"] = section.PointerToRawData
            features["rdata_VirtualAddress"] = section.VirtualAddress
    pe.close()
    return features

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(await file.read())
    temp_file.close()
    try:
        features = extract_required_features(temp_file.name)
    except Exception:
        os.remove(temp_file.name)
        raise HTTPException(status_code=400, detail="Invalid PE file format")
    os.remove(temp_file.name)

    feature_columns = [col for col in expected_columns if col != "Class"]
    vector = [features[col] for col in feature_columns]
    scaled_vector = scaler.transform([vector])
    prediction = model.predict(scaled_vector)[0]
    proba = model.predict_proba(scaled_vector)[0]
    confidence = max(proba) * 100

    result = {
        "filename": file.filename,
        "prediction": "Malware" if prediction == 1 else "Benign",
        "confidence": confidence,
        "features": {col: features[col] for col in feature_columns}
    }

    # Update stats and recent scans
    stats["scans_today"] += 1
    if prediction == 1:
        stats["threats_detected"] += 1
    else:
        stats["clean_files"] += 1
    recent_scans.insert(0, {"filename": file.filename, "prediction": result["prediction"]})
    recent_scans[:] = recent_scans[:5]

    return result

# DELETE endpoints
@app.delete("/recent_scans")
async def clear_recent_scans():
    recent_scans.clear()
    return {"message": "Recent scans cleared"}

@app.delete("/stats")
async def reset_stats():
    stats.update({"scans_today": 0, "threats_detected": 0, "clean_files": 0})
    return {"message": "Stats reset"}

@app.get("/status")
async def status():
    return {"recent_scans": recent_scans, "stats": stats}