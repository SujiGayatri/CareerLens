import { ExternalLink, Info } from 'lucide-react';


const instructions = {
  groq: {
    title: 'How to get your Groq API key',
    steps: [
      'Go to the Groq Console.',
      'Sign in or create your account.',
      'Open the API Keys section.',
      'Create a new API key.',
      'Copy the key and paste it below.',
    ],
    linkText: 'Open Groq Console',
    link: 'https://console.groq.com/keys',
  },

  gemini: {
    title: 'How to get your Gemini API key',
    steps: [
      'Open Google AI Studio.',
      'Sign in with your Google account.',
      'Create or generate an API key.',
      'Copy the key.',
      'Paste it into the field below.',
    ],
    linkText: 'Open Google AI Studio',
    link: 'https://aistudio.google.com/app/apikey',
  },

  openrouter: {
    title: 'How to get your OpenRouter API key',
    steps: [
      'Go to OpenRouter.',
      'Sign in or create your account.',
      'Open your Keys section.',
      'Create a new API key.',
      'Copy the key and paste it below.',
    ],
    linkText: 'Open OpenRouter',
    link: 'https://openrouter.ai/keys',
  },

  local: {
    title: 'Using a local model',
    steps: [
      'Install a local LLM runtime such as Ollama.',
      'Download a supported model.',
      'Start the local model server.',
      'CareerLens will connect to your local model.',
    ],
  },
};

function ProviderInstructions({ provider }) {
  const data = instructions[provider];

  return (
    <div className="provider-instructions">

      <div className="instructions-header">
        <div className="instructions-icon">
          <Info size={16} />
        </div>

        <strong>{data.title}</strong>
      </div>

      <ol>
        {data.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {data.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noreferrer"
          className="provider-link"
        >
          {data.linkText}
          <ExternalLink size={13} />
        </a>
      )}

    </div>
  );
}

export default ProviderInstructions;