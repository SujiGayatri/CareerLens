const processJobDescriptionText = (jobDescription) => {
  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job description cannot be empty.");
  }

  const cleanedText = jobDescription
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanedText) {
    throw new Error("Job description contains no readable text.");
  }

  return cleanedText;
};

export default processJobDescriptionText;