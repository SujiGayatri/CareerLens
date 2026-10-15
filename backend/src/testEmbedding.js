import { generateEmbeddings } from "./services/embeddingService.js";

const testBatchEmbedding = async () => {
  try {
    const texts = [
      "B.Tech Artificial Intelligence and Machine Learning graduate.",
      "Experienced in React, Node.js, Express.js and MongoDB.",
      "Built an AI-powered clothing inventory application.",
      "Developed a smart weather intelligence dashboard.",
    ];

    // console.log(`Generating embeddings for ${texts.length} chunks...`);

    const embeddings = await generateEmbeddings(texts);

    // console.log("Batch embedding generation successful.");
    // console.log("Number of embeddings:", embeddings.length);

    // embeddings.forEach((embedding, index) => {
    //   console.log(
    //     `Chunk ${index}: ${embedding.length} dimensions`
    //   );
    // });

    // console.log(
    //   "First 5 values of first embedding:",
    //   embeddings[0].slice(0, 5)
    // );
  } catch (error) {
    console.error("Batch embedding generation failed:", error);
  }
};

testBatchEmbedding();