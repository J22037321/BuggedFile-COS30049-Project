# Preface

This .zip file contains the files related to our machine-learning tasks for Assignment 2. In particular,
it has .csv files for both the raw and processed datasets, as well as .py files that contain the source code for 
data preprocessing, printing of the processed data, and the actual machine-learning parts like learning and analysis.

# File Structure

### COS30049_Group_16_Assignment_2_Source_Code /

    ├── Cleaned Datasets/
    │   ├── AU-PEMal2025v2_Cleaned.csv
    │   ├── Basic_Malware_Set_Cleaned.csv
    │   └── Windows_Malwares_Combined_Truncated.csv
    ├── Raw Datasets/
    │   ├── API_Functions.csv
    │   ├── AU-PEMal-2025-V2.csv
    │   ├── DLLs_Imported.csv
    │   ├── Malware dataset.csv
    │   ├── PE_Header.csv
    │   └── PE_Section.csv
	|── Dataset Results/
    │   ├── AU-PEMAL2025v2_Cleaned/
    │   ├── Basic_Malware_Set_Cleaned/
    │   └── Windows_Malwares_Combined_Truncated/
    ├── README.md
    ├── AU-PEMal-Set_Cleaning_Processing_Learning.py
    ├── Basic-Dataset_Cleaning_Processing_Learning.py
    └── Windows-Malwares_Cleaning_Processing_Learning.py

# Dataset Contents

The files contained within the "Raw Datasets" folder are .csv files that contain statistics that were captured during the analysis of both benign and malicious files.
These analyzed files range from things such as Windows PE(Portable Executable) files and Android .APK files.
In particular, the data features contained within the "Malware dataset.csv" file use Linux-specific stats while the other two use stats from Windows.

# Running our files

Before running our code, make sure to extract the contents of this .zip file first to your folder of choice.
To use the .py files we have provided, simply open them in your IDE of choice, such as Visual Studio Code and run them like any other .py file.
These files will read the raw datasets from the respective folders and begin processing them for machine-learning.
By default, the .py files will create a new directory in the working folder titled "Dataset Results" that outputs anything printed from the terminal and matplotlib into a .txt file and .pdf files respectively.
At the end of each .py file are also a few commented lines that will print the cleaned dataset. You can uncomment them to print a new cleaned dataset but it shouldn't be necessary.

We have used 2 models which are the Extra Trees classification model and the linear regression model.
We have also left in a KMeans clustering model that you can run if you uncomment its code block near the end of each .py file.
To modify the test size, you can find the X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=x, random_state=42) line for the desired model and change the test_size value from a range of 0.0-1.0.

For the Extra Trees model, you can modify the number of forests by changing the n_estimators value in the "ExtraTreesClassifier(n_estimators=200, max_depth=None)" line.
For the linear regression model, you can change the features by modifying the X and Y values at the top of its code block with other features from the same dataset.
For the KMeans model, in the sns.scatterplot line you can change the index of X_scaled to different values to get other features


# Acknowledgements

The raw datasets have been gathered from various sources:

### Malware dataset.csv
This dataset is from the .zip file provided on Canvas.

### AU-PEMal-2025-V2.csv
This dataset has been created by Amjad Hussain and can be found on Zenodo.org: 
https://doi.org/10.5281/zenodo.16924564
https://zenodo.org/records/16924564 (Direct link)

### API_Functions.csv, DLLs_Imported.csv, PE_Header.csv, PE_Section.csv
These datasets have been created by Joakim Arvidsson and can be found on Kaggle.com:
https://www.kaggle.com/datasets/joebeachcapital/windows-malwares