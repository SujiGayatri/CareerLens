import { useRef, useState } from 'react';
import { AlertCircle, FileText, Upload, X } from 'lucide-react';

import '../css/ResumeUpload.css';

function ResumeUpload({ file, onFileChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError('');

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setError('Please upload a PDF file only.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be 5 MB or less.');
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemove = (event) => {
    event.stopPropagation();

    onFileChange(null);
    setError('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="resume-upload-section">
      <div
        className={`upload-box ${file ? 'has-file' : ''} ${
          error ? 'has-error' : ''
        }`}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        {!file ? (
          <>
            <div className="upload-icon">
              <Upload size={24} />
            </div>

            <h3>Upload your resume</h3>

            <p>Drop your PDF here or click to browse</p>

            <span>PDF only • Maximum 5 MB</span>
          </>
        ) : (
          <div className="selected-file">
            <div className="file-icon">
              <FileText size={22} />
            </div>

            <div className="file-info">
              <strong>{file.name}</strong>

              <span>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={handleRemove}
              aria-label="Remove resume"
            >
              <X size={17} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="upload-error">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;