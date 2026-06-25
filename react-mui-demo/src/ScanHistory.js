import recent from './image/recent.svg';
import correct from './image/correct.svg';
import error from './image/error.svg';

export default function ScanHistory() {

  const num = 0;

  if (num === 1) {
    return (
      <div className="App-card App-recent-scans">
          <h2>Recent Scans</h2>
          <div className="App-recent-scans-content-empty">
              <img src={recent} alt="Recent" aria-hidden="true" />
              <span className="App-recent-scans-empty">No scans yet</span>
          </div>
      </div>
    );
  } 

  else {
  return (
    <div className="App-card App-recent-scans">
        <h2>Recent Scans</h2>
        <div className="App-recent-scans-content">
            <img src={error} alt="Correct" aria-hidden="true" />
            <div className="App-recent-scans-item">
                <p>Assignment 1.pdf</p>
                <div className="App-recent-scans-item-details">
                    <span>file</span>
                    <span>•</span>
                    <span>6/25/2026, 6:46:27 PM</span>
                </div>
            </div>
        </div>
        <div className="App-recent-scans-content">
            <img src={correct} alt="Correct" aria-hidden="true" />
            <div className="App-recent-scans-item">
                <p>Assignment 1.pdf</p>
                <div className="App-recent-scans-item-details">
                    <span>file</span>
                    <span>•</span>
                    <span>6/25/2026, 6:46:27 PM</span>
                </div>
            </div>
        </div>
    </div>
  );
  }
}