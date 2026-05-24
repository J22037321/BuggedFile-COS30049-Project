#Importing pandas library
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import ExtraTreesClassifier
from sklearn.linear_model import LinearRegression
from sklearn.feature_selection import SelectFromModel
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, mean_squared_error,r2_score

path = "Dataset Results/Basic_Malware_Set_Cleaned/"
os.makedirs(path, exist_ok=True)


"""
Data Preprocessing
"""

#Loading data into a DataFrame
malwareset=pd.read_csv('Raw Datasets/Malware dataset.csv')

""" #Preliminary csv preview
print(malwareset.dtypes,"\n")
malwareset.info()
print("\n")
"""

#Dropping duplicate samples, identification columns and other columns where all values are zero/the same
malwareset.drop_duplicates(subset='hash',keep='first', inplace=True)
malwareset.drop(['hash',
                 'millisecond',
                 'usage_counter','normal_prio','policy','vm_pgoff',
                 'task_size','cached_hole_size','hiwater_rss','nr_ptes','signal_nvcsw','cgtime','lock'], axis=1, inplace=True)

#Class benign samples as 0 and non-benign as 1
malwareset['classification'] = malwareset['classification'].astype('category')
malwareset['classification'] = malwareset['classification'].map({'benign':0, 'malware':1})

scaler = MinMaxScaler()
# fit_transform returns a numpy array; wrap it back into a DataFrame
malwareset = pd.DataFrame(scaler.fit_transform(malwareset), columns=malwareset.columns)

#Count of benign and malicious samples
counts = malwareset['classification'].value_counts()
print("Benign samples:", counts[0])
print("Malware samples:", counts[1])

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","w") as file:
    print("Benign samples:", counts[0], file=file)
    print("Malware samples:", counts[1], file=file)



# Class distribution
counts= malwareset['classification'].value_counts()
# Plot bar chart
counts.plot(kind='bar')

# Change x-axis labels
plt.xticks([0, 1], ['Benign', 'Malware'])

plt.title("Classification Distribution")
plt.xlabel("classification")
plt.ylabel("Count")
plt.savefig("Dataset Results/Basic_Malware_Set_Cleaned/Classification Distribution.pdf" , bbox_inches="tight")
plt.tight_layout()
plt.show()



"""
#Extra trees forest classifying to identify most important features
"""

#Features and labels
X = malwareset.drop('classification', axis=1)
y = malwareset['classification']


data_input = malwareset.drop('classification', axis=1).values
labels= malwareset['classification'].values
extratrees = ExtraTreesClassifier().fit(data_input, labels)
classifiermodel = SelectFromModel(extratrees, prefit=True)
data_input_new = classifiermodel.transform(data_input)

#Identifying the most important features
features= data_input_new.shape[1]
importance = extratrees.feature_importances_
print(f"The data has {data_input.shape[0]} samples with {data_input.shape[1]} usable features.\n"
      f"After evaluating with an Extra Trees Forest model the most important features out of the {data_input.shape[1]} before are the {data_input_new.shape[1]} features below:\n")

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print(f"\nThe data has {data_input.shape[0]} samples with {data_input.shape[1]} usable features.\n"
      f"After evaluating with an Extra Trees Forest model the most important features out of the {data_input.shape[1]} before are the {data_input_new.shape[1]} features below:\n", file=file)

indices = np.argsort(importance)[::-1]
for i in range(features):
    print(f"{i+1}. {malwareset.columns[1+indices[i]]} ({importance[indices[i]]:.4f})")
print("\n")

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    for i in range(features):
        print(f"{i+1}. {malwareset.columns[1+indices[i]]} ({importance[indices[i]]:.4f})", file=file)
    print("\n")

#Using the most important features and visualizing them in a bar chart
graph= plt.figure(figsize=(10,6))
sns.barplot(x=importance, y=malwareset.drop('classification', axis=1).columns)
plt.title("Feature Importances (Extra Trees)")
plt.tight_layout()
plt.savefig("Dataset Results/Basic_Malware_Set_Cleaned/Feature Importances (Extra Trees).pdf" , bbox_inches="tight")
plt.show()

# Split into train/test sets, change test_size value to 0.0-1.0 for different test percentages of the datset!
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

classifiermodel = ExtraTreesClassifier(n_estimators=200, max_depth=None)
classifiermodel.fit(X_train, y_train)

"""
#Extra trees model Evaluation
"""

# Predict on test set
class_y_pred = classifiermodel.predict(X_test)

# Accuracy
print(f"SKLearn accuracy score:{accuracy_score(y_test, class_y_pred):.4f}","\n")

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print(f"SKLearn accuracy score:{accuracy_score(y_test, class_y_pred):.4f}","\n",file=file)

# Classification report
print(classification_report(y_test, class_y_pred, target_names=["Benign","Malware"]))

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print(classification_report(y_test, class_y_pred, target_names=["Benign","Malware"]),file=file)

# Confusion matrix
cm = confusion_matrix(y_test, class_y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.savefig("Dataset Results/Basic_Malware_Set_Cleaned/Confusion_Matrix.pdf" , bbox_inches="tight")
plt.show()

scores = cross_val_score(classifiermodel, X, y, cv=5)
print(f"Cross-validation accuracy: {scores.mean():.4f}")

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print(f"Cross-validation accuracy: {scores.mean():.4f}",file=file)

#Output to show some correct and false predictions from the dataset
# Add predictions back to test DataFrame
results = X_test.copy()
results['Actual'] = y_test
results['Predicted'] = class_y_pred
results['Correct'] = results['Actual'] == results['Predicted']

# Show correct samples
print("\nCorrectly classified samples:")
print(results[results['Correct']].head())

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print("\nCorrectly classified samples:", file=file)
    print(results[results['Correct']].head(), file=file)


# Show incorrect samples
print("\nMisclassified samples:")
print(results[~results['Correct']].head())

with open("Dataset Results/Basic_Malware_Set_Cleaned/Basic_Malware_Set_Cleaned_output.txt","a") as file:
    print("\nMisclassified samples:", file=file)
    print(results[~results['Correct']].head(), file=file)



"""
#KMeans Clustering


#Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

#Kmeans clustering, benign vs malware
kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_scaled)
malwareset['Cluster'] = clusters

# Compare clusters to actual labels
print("Confusion Matrix:")
print(confusion_matrix(y, clusters))

print("\nClassification Report:")
print(classification_report(y, clusters, target_names=["Benign","Malware"]))

print("\nAccuracy (cluster vs label):", accuracy_score(y, clusters))

# Visualize clusters with first two features
plt.figure(figsize=(8,6))
sns.scatterplot(x=X_scaled[:,0], y=X_scaled[:,1], hue=clusters, palette="Set1", alpha=0.7)
plt.title("KMeans Clustering (2 clusters)")
plt.xlabel("Feature 1 (scaled)")
plt.ylabel("Feature 2 (scaled)")
plt.show()
"""



#Regression model
X = malwareset[['utime']]   # features
y = malwareset['nvcsw']                # continuous target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


reg_model = LinearRegression()
reg_model.fit(X_train, y_train)

y_pred = reg_model.predict(X_test)
from sklearn.metrics import mean_squared_error, r2_score

print("MSE:", mean_squared_error(y_test, y_pred))
print("R²:", r2_score(y_test, y_pred))

plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.7,label='Actual values')
plt.plot(X_test, y_pred, color='blue', linewidth=3, label='Predicted values')
plt.xlabel("utime")
plt.ylabel("nvcsw")
plt.title("Linear Regression on basic dataset")
plt.savefig("Dataset Results/Basic_Malware_Set_Cleaned/Linear_Regression.pdf", bbox_inches='tight')
plt.tight_layout()
plt.legend()
plt.show()






#Writing to new csv
#path = "New Outputs/"
#os.makedirs(path, exist_ok=True)
#malwareset.to_csv('New Outputs/Basic_Malware_Set_Cleaned.csv', index=False)

