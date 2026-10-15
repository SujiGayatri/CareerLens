import Groq from "groq-sdk";

const generateWithGroq = async ({
  apiKey,
  systemPrompt,
  userPrompt,
}) => {
  if (!apiKey) {
    throw new Error("Groq API key is required");
  }

  const groq = new Groq({
    apiKey,
  });

  const completion = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    temperature: 0,
    max_completion_tokens: 2048,
    // response_format: {
    //   type: "json_object",
    // },
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

//   console.log("===== GROQ COMPLETION =====");
// console.dir(completion, { depth: null });
// console.log("===========================");

  const response = completion.choices[0]?.message?.content;

  if (!response) {
    throw new Error("Groq returned an empty response");
  }

  return response;
};

export const generateAIResponse = async ({
  provider,
  apiKey,
  systemPrompt,
  userPrompt,
}) => {
  if (!provider) {
    throw new Error("AI provider is required");
  }

  if (provider === "groq") {
    return generateWithGroq({
      apiKey,
      systemPrompt,
      userPrompt,
    });
  }

  if (provider === "local") {
    throw new Error(
      "Local provider generation is not implemented yet"
    );
  }

  throw new Error(
    `AI provider "${provider}" is not implemented yet`
  );
};