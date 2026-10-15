import express from "express";
import { createAnalysis, retrieveResumeContext, testResumeAnalysis, analyzeResume, getAnalysisById } from "../controllers/AnalysisController.js";

const router = express.Router();

router.post("/", createAnalysis);
router.post("/retrieve", retrieveResumeContext);
router.post("/test", testResumeAnalysis);
router.post("/analyze", analyzeResume);
router.get("/:analysisId", getAnalysisById);

export default router;