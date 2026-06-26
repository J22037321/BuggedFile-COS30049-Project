import recent from './image/recent.svg';
import PieChart from './PieChart';

export default function ScanResult() {

  const num = 2;
  
  return (
    <div className="App-results">
        <div className="App-card App-results-box">
            <h2>File Analysis Results</h2>
            {num === 0 && (
              <div className="App-empty-results">
                <img src={recent} alt="Recent" aria-hidden="true" />
                <span className="App-results-empty">No results yet</span>
              </div>
            )}
            {num === 1 && (
              <div className="App-results-content">
                <span className="App-good-result">No malware detected.</span>
                <span className="App-good-result">Confident rate: 95%</span>
              </div>
            )}
            {num === 2 && (
              <div className="App-results-content">
                <div className="App-results-text">
                  <span className="App-bad-result">Malicious File Detected!</span>
                  <span className="App-bad-result">Malware Type: Trojan Horse</span>
                  <span className="App-bad-result">Confident rate: 90%</span>
                </div>
                <div className="piechart">
                  <PieChart />
                </div>
              </div>
            )}
        </div>
    </div>
  );
}