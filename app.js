
const GitHubLinkGenerator = () => {
  const [accessToken, setAccessToken] = React.useState('');
  const [scriptLink, setScriptLink] = React.useState('');
  const [localFolder, setLocalFolder] = React.useState('scripts');
  const [runImmediately, setRunImmediately] = React.useState(true);
  const [runLocally, setRunLocally] = React.useState(true);
  const [generatedLink, setGeneratedLink] = React.useState('');
  const [downloadTool, setDownloadTool] = React.useState('curl');

const handleGenerate = () => {
  let rawScriptLink = scriptLink;
  if (!scriptLink.startsWith('http')) {
    // If it's not a full URL, assume it's a GitHub path
    const parts = scriptLink.split('/');
    if (parts.length > 2) {
      // If there are more than 2 parts, insert 'main' after the second part
      parts.splice(2, 0, 'main');
    }
    rawScriptLink = `https://raw.githubusercontent.com/${parts.join('/')}`;
  } else if (scriptLink.includes('github.com')) {
    // If it's a full GitHub URL, replace 'github.com' with 'raw.githubusercontent.com'
    // and remove '/blob/' if present
    rawScriptLink = scriptLink
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
    
    // Insert 'main' if it's not present after the repo name
    const parts = rawScriptLink.split('/');
    const repoIndex = parts.findIndex(part => part === 'raw.githubusercontent.com') + 2;
    if (parts[repoIndex] !== 'main') {
      parts.splice(repoIndex, 0, 'main');
    }
    rawScriptLink = parts.join('/');
  }
  
  const scriptName = rawScriptLink.split('/').pop();
  const folderPath = localFolder ? `~/${localFolder}` : '~';

  let link = '';

  if (accessToken) {
    link += `TOKEN="${accessToken}"\n`;
  }

    if (runLocally) {
      link += `mkdir -p ${folderPath} && \\\n`;

      if (downloadTool === 'curl') {
        if (accessToken) {
          link += `curl -H "Authorization: token $TOKEN" -sSL "${rawScriptLink}" -o ${folderPath}/${scriptName} && \\\n`;
        } else {
          link += `curl -sSL "${rawScriptLink}" -o ${folderPath}/${scriptName} && \\\n`;
        }
      } else {
        if (accessToken) {
          link += `wget --header="Authorization: token $TOKEN" -O ${folderPath}/${scriptName} "${rawScriptLink}" && \\\n`;
        } else {
          link += `wget -O ${folderPath}/${scriptName} "${rawScriptLink}" && \\\n`;
        }
      }

      link += `chmod +x ${folderPath}/${scriptName}`;

      if (runImmediately) {
        link += ` && \\\n${folderPath}/${scriptName}`;
      }
    } else {
      if (downloadTool === 'curl') {
        if (accessToken) {
          link += `curl -H "Authorization: token $TOKEN" -sSL "${rawScriptLink}" | bash`;
        } else {
          link += `curl -sSL "${rawScriptLink}" | bash`;
        }
      } else {
        if (accessToken) {
          link += `wget -qO- --header="Authorization: token $TOKEN" "${rawScriptLink}" | bash`;
        } else {
          link += `wget -qO- "${rawScriptLink}" | bash`;
        }
      }
    }

    setGeneratedLink(link);
  };

  const handleReset = () => {
    setAccessToken('');
    setScriptLink('');
    setLocalFolder('scripts');
    setRunImmediately(true);
    setRunLocally(true);
    setGeneratedLink('');
    setDownloadTool('curl');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      alert('Copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="glg-container">
      <div className="glg-main-container">
        <h1 className="glg-heading">GitHub Link Generator</h1>
        <div className="glg-input-group">
          <label className="glg-label">Download Tool:</label>
          <select
            value={downloadTool}
            onChange={(e) => setDownloadTool(e.target.value)}
            className="glg-select"
          >
            <option value="curl">curl</option>
            <option value="wget">wget</option>
          </select>
        </div>
        <div className="glg-input-group">
          <label className="glg-label">Access Token:</label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="glg-input"
            placeholder="Enter your GitHub access token"
          />
        </div>
        <div className="glg-input-group">
          <label className="glg-label">GitHub Script Link:</label>
          <input
            type="text"
            value={scriptLink}
            onChange={(e) => setScriptLink(e.target.value)}
            className="glg-input"
            placeholder="e.g., user/repo/blob/main/script.sh"
          />
        </div>
        <div className="glg-input-group">
          <label className="glg-label">Local Folder:</label>
          <input
            type="text"
            value={localFolder}
            onChange={(e) => setLocalFolder(e.target.value)}
            className="glg-input"
            placeholder="Default: scripts"
          />
        </div>
        <div className="glg-input-group">
          <label className="glg-label">Run Immediately:</label>
          <input
            type="checkbox"
            checked={runImmediately}
            onChange={(e) => setRunImmediately(e.target.checked)}
          />
        </div>
        {runImmediately && (
          <div className="glg-input-group">
            <label className="glg-label">Run Locally:</label>
            <input
              type="checkbox"
              checked={runLocally}
              onChange={(e) => setRunLocally(e.target.checked)}
            />
          </div>
        )}
        <div className="glg-button-group">
          <button onClick={handleGenerate} className="glg-button glg-button-generate">Generate</button>
          <button onClick={handleReset} className="glg-button glg-button-reset">Reset</button>
        </div>
        {generatedLink && (
          <div className="glg-output-container">
            <h2 className="glg-subheading">Generated Link:</h2>
            <pre className="glg-output">{generatedLink}</pre>
            <button onClick={handleCopy} className="glg-button glg-button-copy">Copy</button>
          </div>
        )}
      </div>
      <div className="glg-donation-container">
        <a 
          href="https://iri.quest/q-donations" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glg-donation-link"
        >
          <span className="glg-donation-icon">🧡</span>
          Donations
        </a>
      </div>
    </div>
  );
};

// Add this at the bottom instead of export
ReactDOM.render(<GitHubLinkGenerator />, document.getElementById('root'));
