import ResumeChunk from "../models/ResumeChunk.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { searchResumeChunks } from "../services/vectorSearchService.js";

export const createResumeChunk = async (req, res) => {
  try {
    const { resumeId, chunkIndex, text, section } = req.body;

    if (!resumeId || chunkIndex === undefined || !text) {
      return res.status(400).json({
        success: false,
        message: "resumeId, chunkIndex and text are required.",
      });
    }
    const embedding = await generateEmbedding(text);

    const chunk = await ResumeChunk.create({
      resumeId,
      chunkIndex,
      text,
      section,
      embedding,
      
    });

    return res.status(201).json({
      success: true,
      message: "Resume chunk created successfully.",
      data: chunk,
    });
  } catch (error) {
    console.error("Resume chunk creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create resume chunk.",
    });
  }
};

export const testVectorSearch = async (req, res) => {
  try {
    const { query, resumeId } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // Convert the user's query into a 384-dimensional embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search the resume chunks using MongoDB Vector Search
    const results = await searchResumeChunks(queryEmbedding, {
      limit: 5,
      resumeId: resumeId || null,
    });

    return res.status(200).json({
      success: true,
      query,
      resultCount: results.length,
      results,
    });
  } catch (error) {
    console.error("Vector search error:", error);

    return res.status(500).json({
      success: false,
      message: "Vector search failed",
      error: error.message,
    });
  }
};