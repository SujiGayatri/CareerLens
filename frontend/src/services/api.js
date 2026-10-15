    const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const verifyAIProvider = async ({ provider, apiKey }) => {
  const response = await fetch(`${API_BASE_URL}/ai/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      apiKey,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'API verification failed.'
    );
  }

  return data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append('resume', file);

  const response = await fetch(`${API_BASE_URL}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Resume upload failed.'
    );
  }

  return data;
};

export const createJobDescription = async ({
  jobDescription,
  title = '',
  company = '',
}) => {
  const response = await fetch(
    `${API_BASE_URL}/job-description/process`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        title,
        company,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to process job description.'
    );
  }

  return data;
};

export const analyzeResume = async ({
  resumeId,
  jobDescriptionId,
  provider,
  apiKey,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/analysis/analyze`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeId,
        jobDescriptionId,
        provider,
        apiKey,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || data.message || 'Resume analysis failed.'
    );
  }

  return data;
};