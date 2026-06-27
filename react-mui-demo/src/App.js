import logo from './image/logo.svg';
import upload from './image/upload.svg';
import search from './image/search.svg';
import document from './image/document.svg';
import './App.css';
import { useRef, useState } from "react";

function App() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentScans, setRecentScans] = useState([]);

  // Stats state
  const [scansToday, setScansToday] = useState(0);
  const [threatsDetected, setThreatsDetected] = useState(0);
  const [cleanFiles, setCleanFiles] = useState(0);

  const handleBoxClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(""); // clear any previous error
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };

  const handleScanFile = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.detail) {
        // Backend returned an error (invalid PE file)
        setErrorMessage("This file is not a valid executable (PE format).");
        setScanResult(null);
        return;
      }

      setScanResult(data);
      setErrorMessage("");

      // Update stats
      setScansToday(prev => prev + 1);
      if (data.prediction === "Malware") {
        setThreatsDetected(prev => prev + 1);
      } else {
        setCleanFiles(prev => prev + 1);
      }

      // Add to recent scans (keep last 5)
      setRecentScans(prev => [
        { filename: data.filename, prediction: data.prediction },
        ...prev.slice(0, 4)
      ]);
    } catch (error) {
      console.error("Error scanning file:", error);
      setErrorMessage("Error scanning file. Please try again.");
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-title">
          <h1>BuggedFile</h1>
          <p>Malicious File Detection and Analysis</p>
        </div>
        <nav className="App-nav">
          <ul>
            <li><a href="/">Result</a></li>
            <li><a href="/about">AI Model</a></li>
            <li><a href="/contact">About Us</a></li>
          </ul>
        </nav>
      </header>

      <div className="App-mainwrapper">
        <main className="App-main">
          <div className="App-content">
            {/* File Upload Section */}
            <div className="App-card App-file-upload">
              <h2>Upload file</h2>
              <div className="App-card App-file-upload-box" onClick={handleBoxClick}>
                {selectedFile ? (
                  <>
                    <button type="button" className="App-clear-file" onClick={handleClearFile}>✕</button>
                    <img src={document} alt="Document" />
                    <span>{selectedFile.name}</span>
                    <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </>
                ) : (
                  <>
                    <img src={upload} alt="Upload" />
                    <span>Drag and drop a file here</span>
                    <span>or click to select a file</span>
                    <div className="App-file-types">
                      <span>.exe</span>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              {errorMessage && (
                <div className="App-error-popup">
                  {errorMessage}
                </div>
              )}
              <button type="button" className="App-scan-button" onClick={handleScanFile}>
                <img src={search} alt="Scan" /> Scan file
              </button>
            </div>

            {/* Sidebar */}
            <div className="App-sidebar">
              {/* Quick Stats Section */}
              <div className="App-card App-quick-stats">
                <h2>Quick Stats</h2>
                <div className="App-stats">
                  <span>Scans Today</span>
                  <span className="App-value">{scansToday}</span>
                </div>  
                <div className="App-stats">
                  <span>Threats Detected</span>
                  <span className="App-value App-threats">{threatsDetected}</span>
                </div>  
                <div className="App-stats">
                  <span>Clean Files</span>
                  <span className="App-value App-clean">{cleanFiles}</span>
                </div>  
              </div>

              {/* Chart Placeholder */}
              <div className="App-card App-chart">
                <h2>Scan Distribution</h2>
                <div className="Chart-placeholder">
                  <p>[Pie Chart Placeholder]</p>
                </div>
              </div>

              {/* Recent Scans Section */}
              <div className="App-card App-recent-scans">
                <h2>Recent Scans</h2>
                {recentScans.length === 0 ? (
                  <p>No scans yet.</p>
                ) : (
                  <ul>
                    {recentScans.map((scan, idx) => (
                      <li key={idx}>
                        <span>{scan.filename}</span> — 
                        <span style={{ color: scan.prediction === "Malware" ? "red" : "green" }}>
                          {scan.prediction}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* File Analysis Results Section */}
          {scanResult && (
            <div className="App-card App-result">
              <h2>Scan Result</h2>
              <p><strong>File:</strong> {scanResult.filename}</p>
              <p>
                <strong>Prediction:</strong>{" "}
                <span style={{ color: scanResult.prediction === "Malware" ? "red" : "green" }}>
                  {scanResult.prediction}
                </span>
              </p>
			  <p><strong>Confidence:</strong> {scanResult.confidence.toFixed(2)}%</p>
              <h3>Extracted Features</h3>
              <ul>
                {Object.entries(scanResult.features).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
