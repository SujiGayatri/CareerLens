import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react';

import '../css/AnalysisResults.css';

function AnalysisResults({ analysis, onBack }) {
  if (!analysis) {
    return null;
  }

  const {
    matchScore,
    requirements=[],
    summary,
    recommendations = [],
  } = analysis;

  return (
    <main className="results-page">
      <div className="results-container">

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Analyze another resume
        </button>

        <div className="results-header">
          <span className="eyebrow">
            <Sparkles size={14} />
            AI Resume Analysis
          </span>

          <h1>Your resume analysis.</h1>

          <p>
            CareerLens compared your resume with the target job
            description using relevant evidence from your resume.
          </p>
        </div>

        {/* Summary + Match Score */}
<div className="analysis-overview-grid">

  {/* AI Summary - Left */}
  <section className="result-card summary-card">

    <div className="result-card-header">
      <div className="result-icon">
        <Sparkles size={19} />
      </div>

      <div>
        <h2>AI Summary</h2>
        <p>Overall assessment of your resume.</p>
      </div>
    </div>

    <p className="summary-text">
      {summary}
    </p>

  </section>


  {/* Match Score - Right */}
  <section className="score-card">

    <div className="score-content">

      <div className="score-label">
        <Target size={18} />
        Overall Match
      </div>

      <div className="score-number">
        {matchScore}%
      </div>

      <p>
        Your resume matches approximately {matchScore}% of
        the requirements identified in the job description.
      </p>

    </div>

    <div className="score-circle">
      <div
        className="score-progress"
        style={{
          '--score': `${matchScore * 3.6}deg`,
        }}
      >
        <span>{matchScore}%</span>
      </div>
    </div>

  </section>

</div>

        {/* Skills */}
        {/* <div className="skills-grid">

          <section className="result-card">

            <div className="result-card-header">
              <div className="result-icon success-icon">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <h2>Matched Skills</h2>
                <p>
                  Skills and experience that align with the role.
                </p>
              </div>
            </div>

            <div className="skills-list">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, index) => (
                  <span className="skill-tag matched" key={index}>
                    <CheckCircle2 size={14} />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="empty-state">
                  No strong matches were identified.
                </p>
              )}
            </div>

          </section>
          <section className="result-card">

            <div className="result-card-header">
              <div className="result-icon warning-icon">
                <XCircle size={19} />
              </div>

              <div>
                <h2>Missing Skills</h2>
                <p>
                  Requirements that are not clearly demonstrated.
                </p>
              </div>
            </div>

            <div className="skills-list">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, index) => (
                  <span className="skill-tag missing" key={index}>
                    <XCircle size={14} />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="empty-state">
                  No significant skill gaps were identified.
                </p>
              )}
            </div>

          </section>

        </div> */}

      {/* Requirements */}
<div className="requirements-grid">

  {/* Matched */}
  <section className="result-card requirement-column">

    <div className="result-card-header">
      <div className="result-icon success-icon">
        <CheckCircle2 size={19} />
      </div>

      <div>
        <h2>Matched</h2>
        <p>Requirements clearly demonstrated.</p>
      </div>
    </div>

    <div className="skills-list">

      {requirements.filter(
        (item) => item.status === 'matched'
      ).length > 0 ? (

        requirements
          .filter((item) => item.status === 'matched')
          .map((item, index) => (
            <span
              className="skill-tag matched"
              key={index}
            >
              <CheckCircle2 size={14} />
              {item.requirement}
            </span>
          ))

      ) : (
        <p className="empty-state">
          No strong matches were identified.
        </p>
      )}

    </div>

  </section>


  {/* Partially Matched */}
  <section className="result-card requirement-column">

    <div className="result-card-header">
      <div className="result-icon partial-icon">
        <Target size={19} />
      </div>

      <div>
        <h2>Partially Matched</h2>
        <p>Relevant evidence, but not fully satisfied.</p>
      </div>
    </div>

    <div className="skills-list">

      {requirements.filter(
        (item) => item.status === 'partially_matched'
      ).length > 0 ? (

        requirements
          .filter(
            (item) => item.status === 'partially_matched'
          )
          .map((item, index) => (
            <span
              className="skill-tag partial"
              key={index}
            >
              <Target size={14} />
              {item.requirement}
            </span>
          ))

      ) : (
        <p className="empty-state">
          No partial matches were identified.
        </p>
      )}

    </div>

  </section>


  {/* Missing */}
  <section className="result-card requirement-column">

    <div className="result-card-header">
      <div className="result-icon warning-icon">
        <XCircle size={19} />
      </div>

      <div>
        <h2>Missing</h2>
        <p>No clear evidence found in the resume.</p>
      </div>
    </div>

    <div className="skills-list">

      {requirements.filter(
        (item) => item.status === 'missing'
      ).length > 0 ? (

        requirements
          .filter((item) => item.status === 'missing')
          .map((item, index) => (
            <span
              className="skill-tag missing"
              key={index}
            >
              <XCircle size={14} />
              {item.requirement}
            </span>
          ))

      ) : (
        <p className="empty-state">
          No significant gaps were identified.
        </p>
      )}

    </div>

  </section>

</div>

        {/* Recommendations */}
        <section className="result-card recommendations-card">

          <div className="result-card-header">
            <div className="result-icon">
              <Lightbulb size={19} />
            </div>

            <div>
              <h2>Recommendations</h2>
              <p>
                Practical suggestions based on the identified gaps.
              </p>
            </div>
          </div>

          <div className="recommendations-list">
            {recommendations.map((recommendation, index) => (
              <div
                className="recommendation-item"
                key={index}
              >
                <span className="recommendation-number">
                  {index + 1}
                </span>

                <p>{recommendation}</p>
              </div>
            ))}
          </div>

        </section>

      </div>
    </main>
  );
}

export default AnalysisResults;
