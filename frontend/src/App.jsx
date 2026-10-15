import { useState } from 'react';

import AIProviderSetup from './components/AIProviderSetup';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import './App.css';

function App() {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');

  const handleConnection = (selectedProvider, selectedApikey) => {
    setProvider(selectedProvider);
    setApiKey(selectedApikey);
    setConnected(true);
  };

  if (connected) {
    return (
      <div className="app">
        <ResumeAnalyzer
          provider={provider}
          apiKey={apiKey}
          onBack={() => setConnected(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <AIProviderSetup onConnected={handleConnection} />
    </div>
  );
}

export default App;