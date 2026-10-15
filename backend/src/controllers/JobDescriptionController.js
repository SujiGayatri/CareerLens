import processJobDescriptionText from "../services/jobDescriptionProcessor.js";
import JobDescription from "../models/JobDescriptionModel.js";

export const processJobDescription = async (req, res) => {
  try {
    const { jobDescription, title, company } = req.body;

    // 1. Check whether JD was provided
    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide a job description.",
      });
    }

    // 2. Check whether JD is actually text
    if (typeof jobDescription !== "string") {
      return res.status(400).json({
        success: false,
        message: "Job description must be text.",
      });
    }

    // 3. Process JD
    const processedText =
      processJobDescriptionText(jobDescription);

    // 4. Save JD to MongoDB
    const savedJobDescription = await JobDescription.create({
      title: title || null,
      company: company || null,
      description: processedText,
    });

    console.log(
      "Job description saved to MongoDB:",
      savedJobDescription._id
    );

    // 5. Return successful response
    return res.status(200).json({
      success: true,
      message: "Job description processed and saved successfully.",
      data: {
        jobDescriptionId: savedJobDescription._id,
        title: savedJobDescription.title,
        company: savedJobDescription.company,
        originalLength: jobDescription.length,
        processedLength: processedText.length,
        text: processedText,
      },
    });
  } catch (error) {
    console.error("Job description processing error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process job description.",
    });
  }
};