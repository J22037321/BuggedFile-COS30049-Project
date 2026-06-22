import recent from './image/recent.svg';

export default function ScanHistory() {
  return (
    <div className="App-card App-recent-scans">
        <h2>Recent Scans</h2>
        <div className="App-recent-scans-content">
            <img src={recent} alt="Recent" aria-hidden="true" />
            <span className="App-recent-scans-empty">No scans yet</span>
        </div>
    </div>
  );

//   return (

//   )
}