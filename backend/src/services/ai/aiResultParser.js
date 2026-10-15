const normalizeCategory = (category) => {
  const value = String(category).toLowerCase().trim();

  const map = {
    "technical skills": "technical_skill",
    "technical skill": "technical_skill",
    "experience": "experience",
    "education": "education",
    "certification": "certification",
    "project": "project",
    "domain knowledge": "domain_knowledge",
    "responsibility": "responsibility",
    "process & methodology": "responsibility",
    "soft skills": "other",
    "tools": "tool_or_technology",
    "tool or technology": "tool_or_technology",
  };

  return map[value] || "other";
};

const normalizeImportance = (importance) => {
  const value = String(importance).toLowerCase().trim();

  if (value === "high") return "required";
  if (value === "medium") return "preferred";
  if (value === "low") return "nice_to_have";

  return value;
};
const extractJsonObjects = (response) => {
  const candidates = [];
  let depth = 0;
  let start = -1;
  let insideString = false;
  let escaped = false;

  for (let index = 0; index < response.length; index += 1) {
    const character = response[index];

    if (insideString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        insideString = false;
      }
      continue;
    }

    if (character === '"') {
      insideString = true;
    } else if (character === "{") {
      if (depth === 0) {
        start = index;
      }
      depth += 1;
    } else if (character === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0) {
        candidates.push(response.slice(start, index + 1));
      }
    }
  }

  return candidates;
};

const validateAnalysisResult = (parsedResult) => {
  if (
    !parsedResult ||
    typeof parsedResult !== "object" ||
    Array.isArray(parsedResult)
  ) {
    throw new Error("AI analysis result must be a JSON object");
  }

  const {
    requirements,
    summary,
    recommendations,
  } = parsedResult;

  if (!Array.isArray(requirements)) {
    throw new Error("AI analysis requirements must be an array");
  }

  if (typeof summary !== "string") {
    throw new Error("AI analysis summary must be a string");
  }

  if (!Array.isArray(recommendations)) {
    throw new Error("AI analysis recommendations must be an array");
  }

  const validCategories = [
    "technical_skill",
    "experience",
    "education",
    "certification",
    "project",
    "domain_knowledge",
    "responsibility",
    "tool_or_technology",
    "other",
  ];

  const validImportance = [
    "required",
    "preferred",
    "nice_to_have",
  ];

  const validStatuses = [
    "matched",
    "partially_matched",
    "missing",
  ];

  const validatedRequirements = requirements.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(
        `AI analysis requirement ${index + 1} must be an object`
      );
    }

    const {
  requirement,
  category,
  importance,
  status,
  evidence,
} = item;

const normalizedCategory = normalizeCategory(category);
const normalizedImportance = normalizeImportance(importance);

if (typeof requirement !== "string" || !requirement.trim()) {
  throw new Error(
    `AI analysis requirement ${index + 1} must have a valid requirement`
  );
}

if (!validCategories.includes(normalizedCategory)) {
  throw new Error(
    `AI analysis requirement ${index + 1} has an invalid category`
  );
}

if (!validImportance.includes(normalizedImportance)) {
  throw new Error(
    `AI analysis requirement ${index + 1} has an invalid importance`
  );
}

if (!validStatuses.includes(status)) {
  throw new Error(
    `AI analysis requirement ${index + 1} has an invalid status`
  );
}

if (typeof evidence !== "string") {
  throw new Error(
    `AI analysis requirement ${index + 1} evidence must be a string`
  );
}

return {
  requirement: requirement.trim(),
  category: normalizedCategory,
  importance: normalizedImportance,
  status,
  evidence: evidence.trim(),
};
  });

  const normalizeStringArray = (values, fieldName) => {
    if (!values.every((value) => typeof value === "string")) {
      throw new Error(
        `AI analysis ${fieldName} must contain only strings`
      );
    }

    return values.map((value) => value.trim()).filter(Boolean);
  };

  return {
    requirements: validatedRequirements,
    summary: summary.trim(),
    recommendations: normalizeStringArray(
      recommendations,
      "recommendations"
    ),
  };
};

export const parseAIAnalysisResult = (aiResponse) => {
  let parsed;

  try {
    parsed = JSON.parse(aiResponse);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  return validateAnalysisResult(parsed);
};