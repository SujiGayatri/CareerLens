export const calculateMatchScore = (requirements) => {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return 0;
  }

  const importanceWeights = {
    required: 0.60,
    preferred: 0.25,
    nice_to_have: 0.15,
  };

  const statusScores = {
    matched: 1,
    partially_matched: 0.5,
    missing: 0,
  };

  let totalWeight = 0;
  let achievedWeight = 0;

  for (const requirement of requirements) {
    const importanceWeight =
      importanceWeights[requirement.importance];

    const statusScore =
      statusScores[requirement.status];

    if (
      importanceWeight === undefined ||
      statusScore === undefined
    ) {
      continue;
    }

    totalWeight += importanceWeight;
    achievedWeight += importanceWeight * statusScore;
  }

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round(
    (achievedWeight / totalWeight) * 100
  );
};