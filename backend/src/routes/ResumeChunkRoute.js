import express from "express";
import { createResumeChunk, testVectorSearch } from "../controllers/ResumeChunkController.js";

const router = express.Router();

router.post("/", createResumeChunk);
router.post("/search", testVectorSearch);

export default router;