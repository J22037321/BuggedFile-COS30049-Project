import recent from './image/recent.svg';
import correct from './image/correct.svg';
import error from './image/error.svg';

export default function ScanHistory({ recentScans }) {
  return (
    <div className="App-card App-recent-scans">
      <h2>Recent Scans</h2>
      {recentScans.length === 0 ? (
        <div className="App-recent-scans-content-empty">
          <img src={recent} alt="Recent" aria-hidden="true" />
          <span className="App-recent-scans-empty">No scans yet</span>
        </div>
      ) : (
        <div className="App-recent-scans-list">
          {recentScans.map((scan, idx) => (
            <div key={idx} className="App-recent-scans-content">
              <img
                src={scan.prediction === "Malware" ? error : correct}
                alt={scan.prediction}
                aria-hidden="true"
              />
              <div className="App-recent-scans-item">
                <p>{scan.filename}</p>
                <div className="App-recent-scans-item-details">
                  <span>file</span>
                  <span>•</span>
                  <span>{scan.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
