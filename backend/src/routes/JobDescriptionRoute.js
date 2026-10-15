  import express from "express";
  import {
    processJobDescription,
  } from "../controllers/JobDescriptionController.js";

  const router = express.Router();

  router.post("/process", processJobDescription);

  export default router;