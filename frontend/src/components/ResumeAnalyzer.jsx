import { useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

import ResumeUpload from './ResumeUpload';
import JobDescription from './JobDescription';
import '../css/ResumeAnalyzer.css';
import { uploadResume, createJobDescription, analyzeResume } from '../services/api';
import AnalysisResults from './AnalysisResults';
import Loading from './Loading';

function ResumeAnalyzer({ provider, apiKey, onBack }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [jobDescriptionId, setJobDescriptionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const canAnalyze =
    resume !== null && jobDescription.trim().length > 30;
  const handleAnalyze = async () => {
    if (!canAnalyze || loading) return;

    setLoading(true);
    setError('');

    try {
      let currentResumeId = resumeId;
      let currentJobDescriptionId = jobDescriptionId;

      // Upload resume only if it hasn't been processed yet
      if (!currentResumeId) {
        const resumeResult = await uploadResume(resume);

        currentResumeId = resumeResult.data.resumeId;
        setResumeId(currentResumeId);

        // console.log('Resume processed:', resumeResult.data);
      }

      // Process job description only if it hasn't been processed yet
      if (!currentJobDescriptionId) {
        const jobDescriptionResult = await createJobDescription({
          jobDescription: jobDescription.trim(),
        });

        currentJobDescriptionId =
          jobDescriptionResult.data.jobDescriptionId;

        setJobDescriptionId(currentJobDescriptionId);

        // console.log('Job description processed:',jobDescriptionResult.data);
      }

      // console.log('===== FINAL ANALYSIS REQUEST =====');
      // console.log('resumeId:', currentResumeId);
      // console.log(
      //   'jobDescriptionId:',
      //   currentJobDescriptionId
      // );
      // console.log('Provider:', provider);
      // console.log('==================================');

      // Run AI analysis
      const analysisResponse = await analyzeResume({
        resumeId: currentResumeId,
        jobDescriptionId: currentJobDescriptionId,
        provider,
        apiKey,
      });

      setAnalysis(analysisResponse.data);

      // console.log('Analysis completed:',analysisResponse.data);

    } catch (err) {
      console.error(
        'Resume analysis failed:',
        err
      );

      setError(
        err.message ||
        'Failed to analyze resume.'
      );
    } finally {
      setLoading(false);
    }
  };
  if (analysis) {
    return (
      <AnalysisResults
        analysis={analysis}
        onBack={() => setAnalysis(null)}
      />
    );
  }

  return (

    <main className="analyzer-page">
      {loading && <Loading title="Analyzing Resume..."/>}

      <div className="analyzer-container">

        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Change AI connection
        </button>

        <div className="analyzer-header">
          <span className="eyebrow">
            <Sparkles size={14} />
            AI Resume Analysis
          </span>

          <h1>Analyze your resume.</h1>

          <p>
            Upload your resume and add the job description.
            CareerLens will compare them using evidence from your resume.
          </p>
        </div>

        <div className="analyzer-grid">

          <section className="analyzer-card">
            <div className="card-number">01</div>

            <h2>Your Resume</h2>

            <p className="card-description">
              Upload the resume you want to analyze.
            </p>

            <ResumeUpload
              file={resume}
              onFileChange={setResume}
            />
          </section>

          <section className="analyzer-card">
            <div className="card-number">02</div>

            <h2>Target Job</h2>

            <p className="card-description">
              Paste the job description you're applying for.
            </p>

            <JobDescription
              value={jobDescription}
              onChange={(value) => {
                setJobDescription(value);
                setJobDescriptionId(null);
              }}
            />
          </section>

        </div>

        <div className="analyze-action">
          <div>
            <strong>Ready to analyze?</strong>

            <span>
              {provider} will be used for the AI analysis.
            </span>
          </div>

          <button
  className="primary-btn analyze-btn"
  disabled={!canAnalyze || loading}
  onClick={handleAnalyze}
>
  <Sparkles size={17} />
  {loading ? 'Analyzing Resume...' : 'Analyze Resume'}
</button>
        </div>

        {error && (
          <div className="analysis-error">
            {error}
          </div>
        )}

      </div>
    </main>
  );
}

export default ResumeAnalyzer;