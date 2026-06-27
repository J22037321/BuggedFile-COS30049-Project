import recent from './image/recent.svg';
import correct from './image/correct.svg';
import error from './image/error.svg';
import LineChart from './LineChart';
import BarChart from './BarChart';

export default function ScanResult({ scanResult }) {
  
  return (
    <div className="App-results">
      <div className="App-card App-results-box">
        <h2>File Analysis Results</h2>
          <div className="App-results-content">
            <div className="App-result-box">
              <img src={scanResult.prediction === "Malware" ? error : correct} alt="benign"></img>
              <div className="App-results-text">
                <span className={scanResult.prediction === "Malware" ? "App-bad-result" : "App-good-result"}>{scanResult.prediction === "Malware" ? "Threats Detected" : "No Threats Detected"}</span>
                <div className="App-conrate">
                  <span>Confident Rate</span>
                  <span>{scanResult.confidence.toFixed(2)} / 100</span>
                </div>
                <div className="App-progress-bar-bg">
                  <div 
                    className="App-progress-bar-fill" 
                    style={{ width: `${scanResult.confidence || 0}%`, backgroundColor: scanResult.prediction === "Malware" ? "red" : "green"}}
                  ></div>
                </div>
              </div>
            </div>
            <p className="chartTitle">Section & Memory Layout</p>
            <div className="chart">
               <LineChart features={scanResult.features}/>
            </div>
            <p className="chartTitle">Summary Statistics</p>
            <div className="chart">
               <BarChart features={scanResult.features}/>
            </div>
          </div>
      </div>
    </div>
  );
}