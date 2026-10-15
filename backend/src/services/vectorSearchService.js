import ResumeChunk from "../models/ResumeChunk.js";
import mongoose from "mongoose";

// /**
//  * Performs semantic vector search on resume chunks.
//  *
//  * @param {Array<number>} queryEmbedding - 384-dimensional query vector
//  * @param {Object} options - Search configuration
//  * @returns {Promise<Array>} Relevant resume chunks with similarity scores
//  */
// export const searchResumeChunks = async (
//   queryEmbedding,
//   {
//     limit = 5,
//     resumeId = null,
//   } = {}
// ) => {
//   if (!Array.isArray(queryEmbedding)) {
//     throw new Error("Query embedding must be an array");
//   }

//   if (queryEmbedding.length !== 384) {
//     throw new Error(
//       `Query embedding must contain 384 dimensions. Received ${queryEmbedding.length}`
//     );
//   }
//   console.log("===== SEARCH RESUME CHUNKS =====");
//   console.log("resumeId:", resumeId);
//   console.log("queryEmbedding length:", queryEmbedding.length);


//   const pipeline = [
//     {
//       $vectorSearch: {
//         index: "resume_embedding_index",
//         path: "embedding",
//         queryVector: queryEmbedding,
//         numCandidates: Math.max(limit * 10, 50),
//         limit,
//       },
//     },

//     {
//       $project: {
//         _id: 1,
//         resumeId: 1,
//         chunkIndex: 1,
//         text: 1,
//         section: 1,
//         score: {
//           $meta: "vectorSearchScore",
//         },
//       },
//     },
//   ];

//   // Restrict search to a specific resume
//   if (resumeId) {
//     if (!mongoose.Types.ObjectId.isValid(resumeId)) {
//       throw new Error("Invalid resumeId");
//     }

//     const resumeObjectId = new mongoose.Types.ObjectId(resumeId);

//   const matchingChunks = await ResumeChunk.find({
//     resumeId: resumeObjectId,
//   }).select("_id resumeId chunkIndex text");

//   console.log("===== RESUME CHUNK CHECK =====");
//   console.log("resumeId:", resumeId);
//   console.log("MongoDB ObjectId:", resumeObjectId);
//   console.log("Matching chunks:", matchingChunks.length);
//   console.log("Chunks:", matchingChunks);
//   console.log("==============================");
//     pipeline[0].$vectorSearch.filter = {
//       resumeId: new mongoose.Types.ObjectId(resumeId),
//     };
//   }

//   const results = await ResumeChunk.aggregate(pipeline);
//   console.log("===== VECTOR SEARCH DEBUG =====");
// console.log("resumeId:", resumeId);
// console.log("queryEmbedding length:", queryEmbedding.length);
// console.log("vector results:", results.length);
// console.log("results:", results);
// console.log("===============================");

//   return results;
// };

export const searchResumeChunks = async (
  queryEmbedding,
  {
    limit = 5,
    resumeId = null,
  } = {}
) => {
  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Query embedding must be an array");
  }

  if (queryEmbedding.length !== 384) {
    throw new Error(
      `Query embedding must contain 384 dimensions. Received ${queryEmbedding.length}`
    );
  }

  // console.log("===== SEARCH RESUME CHUNKS =====");
  // console.log("resumeId:", resumeId);
  // console.log("queryEmbedding length:", queryEmbedding.length);

  if (resumeId) {
    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new Error("Invalid resumeId");
    }

    const resumeObjectId =
      new mongoose.Types.ObjectId(resumeId);

    const testChunk = await ResumeChunk.findOne({
  resumeId: resumeObjectId,
});

// console.log("===== FILTER TEST =====");
// console.log("resumeObjectId:", resumeObjectId);
// console.log("Chunk found:", testChunk ? "YES" : "NO");
// console.log("=======================");

    // TEST 1: Check whether chunks exist for this resume
    const matchingChunks = await ResumeChunk.find({
      resumeId: resumeObjectId,
    }).select("_id resumeId chunkIndex text");

    // console.log("===== RESUME CHUNK CHECK =====");
    // console.log(
    //   "Expected resumeId:",
    //   resumeObjectId.toString()
    // );
    // console.log(
    //   "Matching chunks:",
    //   matchingChunks.length
    // );
    // console.log(
    //   "Chunk IDs:",
    //   matchingChunks.map((chunk) =>
    //     chunk._id.toString()
    //   )
    // );
    // console.log("==============================");

    const pipeline = [
      {
        $vectorSearch: {
          index: "resume_embedding_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit,
          filter: {
            resumeId: resumeObjectId,
          },
        },
      },
      {
        $project: {
          _id: 1,
          resumeId: 1,
          chunkIndex: 1,
          text: 1,
          section: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ];

    // TEST 2: Perform vector search
    // const results = await ResumeChunk.aggregate(pipeline);  

    let results = [];

for (let attempt = 1; attempt <= 3; attempt++) {
  results = await ResumeChunk.aggregate(pipeline);

  // console.log(
  //   `Vector search attempt ${attempt}: ${results.length} results`
  // );

  if (results.length > 0) {
    break;
  }

  if (attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

    // console.log("===== VECTOR SEARCH RESULT =====");
    // console.log("Results count:", results.length);
    // console.log(
    //   "Results:",
    //   results.map((result) => ({
    //     id: result._id,
    //     resumeId: result.resumeId,
    //     chunkIndex: result.chunkIndex,
    //     score: result.score,
    //   }))
    // );
    // console.log("================================");

    return results;
  }

  const pipeline = [
    {
      $vectorSearch: {
        index: "resume_embedding_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: Math.max(limit * 10, 50),
        limit,
      },
    },
    {
      $project: {
        _id: 1,
        resumeId: 1,
        chunkIndex: 1,
        text: 1,
        section: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ];

  return await ResumeChunk.aggregate(pipeline);
};