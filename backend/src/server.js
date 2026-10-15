import {generateAIResponse} from './services/ai/aiGenerationService.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import resumeRoute from './routes/ResumeRoute.js';
import jobDescriptionRoute from './routes/JobDescriptionRoute.js';
import connectDB from './config/db.js';
import resumeChunkRoute from './routes/ResumeChunkRoute.js';
import analysisRoute from './routes/AnalysisRoute.js';

await connectDB();
const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'careerlens-api',
  });
});

app.post('/api/ai/verify', async (req, res) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider) {
      return res.status(400).json({
        ok: false,
        message: 'Provider is required.',
      });
    }

    if (provider === 'local') {
      return res.json({
        ok: true,
        provider,
        message: 'Local provider selected.',
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        ok: false,
        message: 'API key is required.',
      });
    }

    if (provider === 'groq') {
      const groq = new Groq({
        apiKey,
      });

      await groq.models.list();

      return res.json({
        ok: true,
        provider: 'groq',
        message: 'Groq API key verified successfully.',
      });
    }

    return res.status(400).json({
      ok: false,
      message: `${provider} verification is not implemented yet.`,
    });
  } catch (error) {
    console.error('AI verification error:', error.message);

    return res.status(401).json({
      ok: false,
      message: 'Invalid API key or provider connection failed.',
    });
  }
});

app.post("/api/ai/test-generation", async (req, res) => {
  try {
    const { provider, apiKey } = req.body;

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "Provider is required.",
      });
    }

    if (provider !== "groq") {
      return res.status(400).json({
        success: false,
        message: "For now, only Groq generation is supported.",
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required.",
      });
    }

    const response = await generateAIResponse({
      provider,
      apiKey,

      systemPrompt:
        "You are a helpful AI assistant. Answer clearly and briefly.",

      userPrompt:
        "Explain what a REST API is in two simple sentences.",
    });

    return res.status(200).json({
      success: true,
      provider,
      response,
    });
  } catch (error) {
    console.error("AI generation test error:", error);

    return res.status(500).json({
      success: false,
      message: "AI generation failed.",
      error: error.message,
    });
  }
});

app.use('/api/resume', resumeRoute);
app.use('/api/job-description', jobDescriptionRoute);
app.use('/api/resume-chunk', resumeChunkRoute);
app.use('/api/analysis', analysisRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerLens API running on port ${PORT}`);
});