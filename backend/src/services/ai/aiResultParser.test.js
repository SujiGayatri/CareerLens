import test from "node:test";
import assert from "node:assert/strict";

import { parseAIAnalysisResult } from "./aiResultParser.js";

const validResult = {
  matchScore: 38,
  summary: "Good fit for the role.",
  matchedSkills: ["JavaScript"],
  missingSkills: ["Kubernetes"],
  recommendations: ["Highlight relevant project experience."],
};

test("parses a valid JSON analysis", () => {
  assert.deepEqual(
    parseAIAnalysisResult(JSON.stringify(validResult)),
    validResult
  );
});

test("parses fenced JSON surrounded by text and normalizes strings", () => {
  const response = `Analysis:
\`\`\`json
${JSON.stringify({
  ...validResult,
  summary: "  Uses {Node} effectively.  ",
  matchedSkills: [" JavaScript ", ""],
})}
\`\`\`
`;

  assert.deepEqual(parseAIAnalysisResult(response), {
    ...validResult,
    summary: "Uses {Node} effectively.",
    matchedSkills: ["JavaScript"],
  });
});

test("rejects invalid analysis fields", () => {
  assert.throws(
    () =>
      parseAIAnalysisResult(
        JSON.stringify({ ...validResult, matchScore: 101 })
      ),
    /matchScore must be a number between 0 and 100/
  );

  assert.throws(
    () =>
      parseAIAnalysisResult(
        JSON.stringify({ ...validResult, matchedSkills: ["JavaScript", 2] })
      ),
    /matchedSkills must contain only strings/
  );
});

test("rejects responses without a valid JSON analysis object", () => {
  assert.throws(
    () => parseAIAnalysisResult("I could not complete the analysis."),
    /AI returned invalid JSON/
  );
});
