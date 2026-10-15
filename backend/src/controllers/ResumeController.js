import parseResumePDF from "../services/pdfParser.js";
import chunkResumeText from "../services/chunkingService.js";

import Resume from "../models/ResumeModel.js";
import ResumeChunk from "../models/ResumeChunk.js";

import { generateEmbeddings } from "../services/embeddingService.js";

export const uploadResume = async (req, res) => {
  try {
    // 1. Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume PDF.",
      });
    }

    // console.log("Resume received:", req.file.originalname);
    // console.log("File size:", req.file.size);

    // 2. Extract text from PDF
    const extractedText = await parseResumePDF(req.file.buffer);

    // console.log("Resume text extracted successfully.");

    // 3. Save resume to MongoDB
    const resume = await Resume.create({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      extractedText,
      status: "processed",
    });

    // console.log("Resume saved to MongoDB:", resume._id);

    // 4. Split resume text into chunks
    const chunks = chunkResumeText(extractedText);

    // console.log(`Resume divided into ${chunks.length} chunks.`);

    // 5. Extract chunk text
    const chunkTexts = chunks.map((chunk) => chunk.text);

    // 6. Generate embeddings for all chunks
    const embeddings = await generateEmbeddings(chunkTexts);

    // console.log(
    //   `Generated ${embeddings.length} embeddings.`
    // );

    // 7. Combine chunks + embeddings
    const chunkDocuments = chunks.map((chunk, index) => ({
      resumeId: resume._id,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      section: chunk.section,
      embedding: embeddings[index],
    }));

    // 8. Save all chunks + embeddings
    await ResumeChunk.insertMany(chunkDocuments);

    // console.log(
    //   `${chunkDocuments.length} resume chunks saved to MongoDB.`
    // );

    // 9. Return successful response
    return res.status(200).json({
      success: true,
      message: "Resume processed and embedded successfully.",
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        chunkCount: chunks.length,
        embeddingDimensions: embeddings[0]?.length || 0,
      },
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    // PDF parsing / validation error
    if (
      error.message === "Failed to extract text from the PDF." ||
      error.message === "No readable text was found in the PDF."
    ) {
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }

    // MongoDB / embedding / unexpected server error
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing the resume.",
      error: error.message,
    });
  }
};