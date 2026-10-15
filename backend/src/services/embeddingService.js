import { pipeline } from "@xenova/transformers";

let embeddingPipeline = null;

const getEmbeddingPipeline = async () => {
  if (!embeddingPipeline) {
    // console.log("Loading embedding model...");

    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    // console.log("Embedding model loaded.");
  }

  return embeddingPipeline;
};

export const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate embedding");
  }

  const extractor = await getEmbeddingPipeline();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};

export const generateEmbeddings = async (texts) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("Texts array is required to generate embeddings");
  }

  const extractor = await getEmbeddingPipeline();

  const embeddings = [];

  for (const text of texts) {
    if (!text || typeof text !== "string") {
      throw new Error("Each item must be a valid text string");
    }

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    embeddings.push(Array.from(output.data));
  }

  return embeddings;
};