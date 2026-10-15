import { useState } from 'react';
import { KeyRound, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

import ProviderInstructions from './ProviderInstructions';
import { verifyAIProvider } from '../services/api';
import {
  CheckCircle,
  LockKeyhole,
  Upload,
} from 'lucide-react';

import '../css/AIProviderSetup.css';
import Loading from './Loading';
const providers = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Fast inference with open models',
    placeholder: 'gsk_xxxxxxxxxxxxxxxxx',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google Gemini models',
    placeholder: 'AIzaSyxxxxxxxxxxxxxxxxx',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access multiple AI models',
    placeholder: 'sk-or-v1-xxxxxxxxxxxxxxxx',
  },
  {
    id: 'local',
    name: 'Local',
    description: 'Use a locally running model',
    placeholder: 'No API key required',
  },
];

function AIProviderSetup({ onConnected }) {
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedProvider = providers.find(
    (item) => item.id === provider
  );

  const handleProviderChange = (id) => {
    setProvider(id);
    setApiKey('');
    setError('');
    setSuccess('');
  };

  const verifyApiKey = async () => {
  setError('');
  setSuccess('');

  if (provider !== 'local' && !apiKey.trim()) {
    setError('Please enter your API key.');
    return;
  }

  try {
    setLoading(true);

    await verifyAIProvider({
      provider,
      apiKey: apiKey.trim(),
    });

    setSuccess('API connection verified successfully.');

    setTimeout(() => {
      onConnected(provider, apiKey.trim());
    }, 500);
  } catch (err) {
    setError(
      err.message ||
        'Unable to connect to CareerLens backend. Make sure the server is running.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="setup-page">
      {loading && (
  <Loading
    title="Verifying AI connection..."
  />
)}
      <div className="setup-container">

        <div className="setup-header">
          <div className="brand-mark">
            <Sparkles size={20} />
          </div>

          <span className="eyebrow">
            CAREERLENS
          </span>

          <h1>
            Connect your AI provider.
          </h1>

          <p>
            Bring your own API key and use CareerLens with
            your preferred AI provider.
          </p>
        </div>

        <div className="setup-card">

          <div className="provider-section">
            <label>Choose your AI provider</label>

            <div className="provider-grid">
              {providers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`provider-option ${
                    provider === item.id ? 'selected' : ''
                  }`}
                  onClick={() =>
                    handleProviderChange(item.id)
                  }
                >
                  <div className="provider-radio">
                    {provider === item.id && (
                      <div />
                    )}
                  </div>

                  <div className="provider-info">
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <ProviderInstructions provider={provider} />

          {provider !== 'local' && (
            <div className="key-section">

              <label htmlFor="apiKey">
                <KeyRound size={15} />
                API Key
              </label>

              <div className="key-input-wrapper">
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setError('');
                    setSuccess('');
                  }}
                  placeholder={selectedProvider.placeholder}
                  autoComplete="off"
                />
              </div>

              <p className="input-hint">
                Example format only — never enter the example
                itself.
              </p>

            </div>
          )}

          {error && (
            <div className="status-message error">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="status-message success">
              <CheckCircle2 size={17} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="button"
            className="primary-btn verify-btn"
            onClick={verifyApiKey}
            disabled={loading}
          >
            {loading ? (
              'Verifying...'
            ) : (
              <>
                <KeyRound size={17} />
                Verify & Continue
              </>
            )}
          </button>

          <p className="security-note">
            Your API key is used to connect to your selected
            provider. Never share your real API key publicly.
          </p>

        </div>
      </div>
    </main>
  );
}

export default AIProviderSetup;