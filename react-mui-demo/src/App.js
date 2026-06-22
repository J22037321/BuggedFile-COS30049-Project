import logo from './image/logo.svg';
import upload from './image/upload.svg';
import './App.css';
import ScanHistory from './ScanHistory';

function App() {
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
          {/* Main content */}
          <div className="App-content">
            {/* File Upload Section */}
            <div className="App-card App-file-upload">
              <h2>Upload file</h2>
              <div className="App-card App-file-upload-box">
                <img src={upload} alt="Upload" aria-hidden="true" />
                <span className="Drag-drop">Drag and drop a file here</span>
                <span>or click to select a file</span>
                <div className="App-file-types">
                  <span>.exe</span><span>.pdf</span><span>.zip</span><span>.js</span><span>.py</span>
                </div>
              </div>
              <button type="button" className="App-scan-button">
                Scan file
              </button>
            </div>

            {/* Sidebar */}
            <div className="App-sidebar">
              {/* Quick Stats Section */}
              <div className="App-card App-quick-stats">
                <h2>Quick Stats</h2>
                <div className="App-stats">
                  <span>Scans Today</span>
                  <span className="App-value">0</span>
                </div>  
                <div className="App-stats">
                  <span>Threats Detected</span>
                  <span className="App-value App-threats">0</span>
                </div>  
                <div className="App-stats">
                  <span>Clean Files</span>
                  <span className="App-value App-clean">0</span>
                </div>  
              </div>

              {/* Recent Scans Section */}
              <ScanHistory />
            </div>

          </div>
        </main>
      </div>
      



    </div>
    
  
    
    

    
  );
}

export default App;
