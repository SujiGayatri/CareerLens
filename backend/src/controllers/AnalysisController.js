import mongoose from "mongoose";
import Analysis from "../models/AnalysisModel.js";
import JobDescription from "../models/JobDescriptionModel.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { searchResumeChunks } from "../services/vectorSearchService.js";
import { generateAIResponse } from "../services/ai/aiGenerationService.js";
import { buildResumeAnalysisPrompt } from "../services/analysisPromptService.js";
import { parseAIAnalysisResult } from "../services/ai/aiResultParser.js";
import { calculateMatchScore } from "../services/calculateMatchScore.js";

const normalizeCategory = (category) => {
  const value = String(category).toLowerCase().trim();

  const map = {
    "technical skills": "technical_skill",
    "technical skill": "technical_skill",
    "experience": "experience",
    "education": "education",
    "certification": "certification",
    "project": "project",
    "domain knowledge": "domain_knowledge",
    "responsibility": "responsibility",
    "process & methodology": "responsibility",
    "soft skills": "other",
    "tools": "tool_or_technology",
    "tool or technology": "tool_or_technology",
  };

  return map[value] || "other";
};

const normalizeImportance = (importance) => {
  const value = String(importance).toLowerCase().trim();

  if (value === "high") return "required";
  if (value === "medium") return "preferred";
  if (value === "low") return "nice_to_have";

  return value;
};

const generateAndParseAnalysis = async ({
  provider,
  apiKey,
  systemPrompt,
  userPrompt,
}) => {
  let previousParseError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let aiResponse;

    try {
      console.log("System prompt length:", systemPrompt.length);
console.log("User prompt length:", userPrompt.length);
console.log(
  "Approx input characters:",
  systemPrompt.length + userPrompt.length
);
      aiResponse = await generateAIResponse({
  provider,
  apiKey,
  systemPrompt,
  userPrompt:
    attempt === 0
      ? userPrompt
      : `${userPrompt}

Return only one valid JSON object using this structure:

{
  "requirements": [
    {
      "requirement": "",
      "category": "",
      "importance": "",
      "status": "",
      "evidence": ""
    }
  ],
  "summary": "",
  "recommendations": []
}

No Markdown. No extra text.`,
});


    } catch (error) {
      const stageError = new Error(
        error instanceof Error ? error.message : "AI provider request failed"
      );
      stageError.analysisStage = "AI generation";
      throw stageError;
    }

    try {
      return {
        aiResponse,
        analysisResult: parseAIAnalysisResult(aiResponse),
      };
    } catch (error) {
      previousParseError = error;
      if (attempt === 0) {
        console.warn(
          "AI response did not match the required analysis format; retrying once."
        );
      }
    }
  }

  const stageError = new Error(
    `AI response remained invalid after one retry: ${
      previousParseError instanceof Error
        ? previousParseError.message
        : "Unrecognized AI response"
    }`
  );
  stageError.analysisStage = "AI response parsing";
  throw stageError;
};

const sendAnalysisError = (res, error, message) => {
  console.error(message, error);

  if (error instanceof Error && error.analysisStage) {
    return res.status(502).json({
      success: false,
      message: `Resume analysis failed during ${error.analysisStage}.`,
      error: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message,
    error: error instanceof Error ? error.message : "Unknown error",
  });
};

export const createAnalysis = async (req, res) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;

    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescriptionId are required.",
      });
    }

    const analysis = await Analysis.create({
      resumeId,
      jobDescriptionId,
    });

    return res.status(201).json({
      success: true,
      message: "Analysis record created successfully.",
      data: analysis,
    });
  } catch (error) {
    console.error("Analysis creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create analysis record.",
    });
  }
};


// STEP 17.2
// Retrieve resume chunks relevant to a Job Description
export const retrieveResumeContext = async (req, res) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;

    // Validate required IDs
    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescriptionId are required.",
      });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resumeId.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobDescriptionId.",
      });
    }

    // 1. Find the Job Description
    const jobDescription = await JobDescription.findById(
      jobDescriptionId
    );

    if (!jobDescription) {
      return res.status(404).json({
        success: false,
        message: "Job description not found.",
      });
    }

    // 2. Get the actual JD text
    const jdText = jobDescription.description;

    if (!jdText) {
      return res.status(400).json({
        success: false,
        message: "Job description has no text.",
      });
    }

    // 3. Convert JD text into a 384-dimensional embedding
    const jdEmbedding = await generateEmbedding(jdText);

    // 4. Search the specified resume for relevant chunks
    const relevantChunks = await searchResumeChunks(jdEmbedding, {
      limit: 5,
      resumeId,
    });
    // 5. Return retrieval result
    return res.status(200).json({
      success: true,
      message: "Resume context retrieved successfully.",
      data: {
        resumeId,
        jobDescriptionId,
        jdTitle: jobDescription.title,
        company: jobDescription.company,
        retrievedChunkCount: relevantChunks.length,
        chunks: relevantChunks,
      },
    });
  } catch (error) {
    console.error("Resume context retrieval error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve resume context.",
      error: error.message,
    });
  }
};


export const testResumeAnalysis = async (req, res) => {
  try {
    const {
      resumeId,
      jobDescriptionId,
      provider,
      apiKey,
    } = req.body;

    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescriptionId are required.",
      });
    }

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "AI provider is required.",
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resumeId.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobDescriptionId.",
      });
    }

    // 1. Get job description
    const jobDescription = await JobDescription.findById(
      jobDescriptionId
    );

    if (!jobDescription) {
      return res.status(404).json({
        success: false,
        message: "Job description not found.",
      });
    }

    // 2. Generate embedding for the job description
    const jdEmbedding = await generateEmbedding(
      jobDescription.description
    );

    // 3. Retrieve relevant resume chunks
    const relevantChunks = await searchResumeChunks(
      jdEmbedding,
      {
        limit: 5,
        resumeId,
      }
    );

    console.log('===== VECTOR RETRIEVAL DEBUG =====');
console.log('resumeId:', resumeId);
console.log('JD embedding length:', jdEmbedding?.length);
console.log(
  'Relevant chunks count:',
  relevantChunks?.length
);
console.log(
  'Relevant chunks:',
  relevantChunks
);
console.log('==================================');

    if (relevantChunks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No relevant resume context found.",
      });
    }

    // 4. Build the AI prompt
    const {
      systemPrompt,
      userPrompt,
    } = buildResumeAnalysisPrompt({
      jobDescription: jobDescription.description,
      resumeChunks: relevantChunks,
    });

    // 5. Send prompt to selected AI provider
    const { aiResponse, analysisResult } = await generateAndParseAnalysis({
      provider,
      apiKey,
      systemPrompt,
      userPrompt,
    });

    const matchScore = calculateMatchScore(
  analysisResult.requirements
);

console.log("Calculated match score:", matchScore);

    // 6. Return everything useful for testing
    return res.status(200).json({
      success: true,
      message: "Resume analysis test completed successfully.",

      data: {
        provider,
        resumeId,
        jobDescriptionId,

        retrievedChunkCount: relevantChunks.length,

        retrievedChunks: relevantChunks,

        aiResponse,
        analysisResult,
      },
    });
  } catch (error) {
    return sendAnalysisError(
      res,
      error,
      "Resume analysis test failed."
    );
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const {
      resumeId,
      jobDescriptionId,
      provider,
      apiKey,
    } = req.body;

    // 1. Validate required fields
    if (!resumeId || !jobDescriptionId) {
      return res.status(400).json({
        success: false,
        message: "resumeId and jobDescriptionId are required.",
      });
    }

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "AI provider is required.",
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required.",
      });
    }

    // 2. Validate IDs
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resumeId.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(jobDescriptionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid jobDescriptionId.",
      });
    }

    // 3. Get job description
    const jobDescription = await JobDescription.findById(
      jobDescriptionId
    );

    if (!jobDescription) {
      return res.status(404).json({
        success: false,
        message: "Job description not found.",
      });
    }

    // 4. Generate JD embedding
    const jdEmbedding = await generateEmbedding(
      jobDescription.description
    );

    // 5. Retrieve relevant resume context
    const relevantChunks = await searchResumeChunks(
      jdEmbedding,
      {
        limit: 5,
        resumeId,
      }
    );

    if (relevantChunks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No relevant resume context found.",
      });
    }

    // 6. Build AI prompt
    const {
      systemPrompt,
      userPrompt,
    } = buildResumeAnalysisPrompt({
      jobDescription: jobDescription.description,
      resumeChunks: relevantChunks,
    });

    // 7. Generate AI response
    const { analysisResult } = await generateAndParseAnalysis({
      provider,
      apiKey,
      systemPrompt,
      userPrompt,
    });
    const matchScore = calculateMatchScore(
  analysisResult.requirements
);

console.log("Calculated match score:", matchScore);

    // 9. Save/update analysis
   const analysis = await Analysis.findOneAndUpdate(
  {
    resumeId,
    jobDescriptionId,
  },
  {
    provider,
    matchScore,
    requirements: analysisResult.requirements,
    summary: analysisResult.summary,
    recommendations: analysisResult.recommendations,
    rawResult: analysisResult,
  },
  {
    returnDocument: "after",
    upsert: true,
    runValidators: true,
  }
);

    // 10. Return final result
    return res.status(200).json({
      success: true,
      message: "Resume analysis completed successfully.",
      data: {
  analysisId: analysis._id,
  resumeId,
  jobDescriptionId,
  provider,
  matchScore: analysis.matchScore,
  requirements: analysis.requirements,
  summary: analysis.summary,
  recommendations: analysis.recommendations,
},
    });
  } catch (error) {
    return sendAnalysisError(
      res,
      error,
      "Resume analysis failed."
    );
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { analysisId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(analysisId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysisId.",
      });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        analysisId: analysis._id,
        resumeId: analysis.resumeId,
        jobDescriptionId: analysis.jobDescriptionId,
        provider: analysis.provider,
        matchScore: analysis.matchScore,
        summary: analysis.summary,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        recommendations: analysis.recommendations,
      },
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analysis.",
      error: error.message,
    });
  }
};