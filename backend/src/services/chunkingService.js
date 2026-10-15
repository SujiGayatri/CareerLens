const chunkResumeText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || typeof text !== "string") {
    throw new Error("Resume text is required for chunking.");
  }

  const cleanedText = text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const words = cleanedText.split(/\s+/);

  const chunks = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunkText = words
      .slice(start, end)
      .join(" ")
      .trim();

    if (chunkText) {
      chunks.push({
        chunkIndex,
        text: chunkText,
        section: null,
      });

      chunkIndex++;
    }

    if (end >= words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};

export default chunkResumeText;