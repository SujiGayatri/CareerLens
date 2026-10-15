import { FileText } from 'lucide-react';
import '../css/JobDescription.css';

function JobDescription({ value, onChange }) {
  return (
    <div className="jd-section">
      <div className="section-title">
        <div className="section-icon">
          <FileText size={19} />
        </div>

        <div>
          <h3>Job Description</h3>
          <p>Paste the job description you're targeting.</p>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste the job description here...

Example:
We are looking for a Full Stack Developer with experience in React, Node.js, Express.js, MongoDB and REST APIs...`}
      />

      <div className="character-count">
        {value.length} characters
      </div>
    </div>
  );
}

export default JobDescription;