# CareerLens — AI Resume Analyzer

CareerLens is an AI-powered resume analysis application that compares a candidate's resume with a target job description and provides an evidence-based match analysis.

It identifies matched, partially matched, and missing requirements, calculates an overall match score, summarizes the candidate's fit, and provides practical recommendations for improving alignment with the target role.

---

## Features

* 📄 Upload and process PDF resumes
* 📝 Enter and analyze job descriptions
* 🤖 AI-powered resume-to-job comparison
* 🔍 Semantic retrieval using MongoDB Vector Search
* 🧩 Resume text chunking and embeddings
* 🎯 Requirement-level matching
* ✅ Matched requirements
* 🟡 Partially matched requirements
* ❌ Missing requirements
* 📊 Deterministic match score
* 💡 AI-generated improvement recommendations
* 📋 Evidence-based analysis
* 🔐 User-provided AI provider API key
* 🧱 Modular frontend and backend architecture

---

## How It Works

CareerLens follows a retrieval-augmented analysis pipeline.

```text
                    ┌─────────────────┐
                    │   Resume PDF    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Extract Resume  │
                    │      Text       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Resume Chunking │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Embeddings    │
                    │   384 dimensions│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     MongoDB     │
                    │  Vector Search  │
                    └────────┬────────┘
                             │
                             │
┌─────────────────┐          │
│ Job Description │──────────┤
└─────────────────┘          │
                             ▼
                    ┌─────────────────┐
                    │ Relevant Resume │
                    │    Context      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Groq LLM     │
                    │   AI Analysis   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Requirements +  │
                    │ Summary +       │
                    │ Recommendations │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Match Score     │
                    │ Calculation     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Analysis Results│
                    └─────────────────┘
```

---

## Analysis Pipeline

### 1. Resume Upload

The candidate uploads a PDF resume.

CareerLens extracts the text and stores the resume information in MongoDB.

### 2. Resume Chunking

The extracted resume text is divided into smaller chunks so that relevant sections can be retrieved efficiently.

### 3. Embeddings

Each resume chunk is converted into a 384-dimensional vector representation.

### 4. MongoDB Vector Search

CareerLens uses MongoDB Vector Search to retrieve resume sections that are semantically relevant to the job description.

The search is also filtered using the specific `resumeId` so that chunks from another candidate's resume are not accidentally retrieved.

### 5. Job Description Analysis

The job description is processed and compared against the relevant resume context.

### 6. AI Analysis

The retrieved resume context and job description are sent to the Groq-powered LLM.

The model identifies important job requirements and classifies each requirement as:

* `matched`
* `partially_matched`
* `missing`

Each requirement also includes:

* Category
* Importance
* Evidence

### 7. Deterministic Match Score

The AI does **not** directly decide the final match score.

CareerLens calculates the score in the backend using the structured requirement results.

| Requirement Importance | Weight |
| ---------------------- | -----: |
| Required               |    60% |
| Preferred              |    25% |
| Nice to Have           |    15% |

Requirement status contributes:

| Status            | Score |
| ----------------- | ----: |
| Matched           |  100% |
| Partially Matched |   50% |
| Missing           |    0% |

This keeps the final score deterministic instead of relying entirely on an LLM-generated percentage.

---

## Requirement Categories

CareerLens can classify requirements into categories such as:

* Technical Skills
* Experience
* Education
* Certifications
* Projects
* Domain Knowledge
* Responsibilities
* Tools & Technologies
* Other

This allows the application to evaluate more than just technical skills.

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React

### Backend

* Node.js
* Express.js
* JavaScript
* REST APIs

### Database

* MongoDB
* MongoDB Vector Search
* Mongoose

### AI / Machine Learning

* Groq
* LLM-based requirement extraction
* Text embeddings
* Retrieval-Augmented Generation (RAG)
* Semantic similarity search

### Other Tools

* Git
* GitHub
* Vercel
* Render

---

## Project Structure

```text
CareerLens/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIProviderSetup.jsx
│   │   │   ├── ProviderInstructions.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   ├── JobDescription.jsx
│   │   │   └── AnalysisResults.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── css/
│   │
│   └── package.json
│
├── backend/
│   ├── controllers/
│   │   └── AnalysisController.js
│   │
│   ├── models/
│   │   ├── Resume.js
│   │   ├── ResumeChunk.js
│   │   ├── JobDescription.js
│   │   └── Analysis.js
│   │
│   ├── services/
│   │   ├── calculateMatchScore.js
│   │   └── ...
│   │
│   ├── routes/
│   │   └── ...
│   │
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* MongoDB database
* Groq API key
* Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/SujiGayatri/n8n-automation.git
```

Move into the project directory:

```bash
cd CareerLens
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd ../backend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

The AI provider API key is supplied through the application rather than hard-coded into the project.

> Never commit real API keys or `.env` files to GitHub.

---

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available through the Vite development server.

---

## Application Flow

```text
AI Provider Setup
        ↓
Resume Upload
        ↓
Job Description
        ↓
Analyze Resume
        ↓
Resume Processing
        ↓
Vector Retrieval
        ↓
AI Requirement Analysis
        ↓
Deterministic Score Calculation
        ↓
Analysis Results
```

---

## Analysis Result

CareerLens presents the analysis in three requirement groups:

### Matched

Requirements clearly demonstrated by the resume.

### Partially Matched

The resume contains relevant evidence, but does not completely satisfy the requirement.

### Missing

No clear evidence of the requirement was found in the resume.

The results also include:

* Overall Match Score
* AI Summary
* Requirement evidence
* Requirement importance
* Requirement category
* Recommendations

---

## Why Use Deterministic Scoring?

LLMs are useful for understanding resumes and job descriptions, but asking an LLM to directly generate a percentage can produce inconsistent results.

CareerLens separates the two responsibilities:

```text
LLM
 ↓
Understand requirements
 ↓
Classify evidence
 ↓
Structured JSON
 ↓
Backend
 ↓
Deterministic scoring
 ↓
Final Match Score
```

This makes the score more predictable and easier to debug.

---

## Privacy

CareerLens is designed so that the candidate provides their own AI provider API key through the application.

API keys should never be stored directly in source code or committed to GitHub.

For production deployments, appropriate security measures should be implemented for handling uploaded resumes and API credentials.

---

## Current Limitations

CareerLens is intended as a practical AI resume analysis project rather than a replacement for professional recruiting systems.

Current limitations include:

* AI classification can occasionally be imperfect.
* Resume quality affects analysis quality.
* Implicit experience is intentionally not assumed.
* Some multi-part job requirements may be difficult to classify precisely.
* Match scores are based on the requirements extracted by the AI.
* The system does not guarantee hiring outcomes.

The goal is to provide a useful, explainable estimate rather than claim perfect accuracy.

---

## Future Improvements

Possible future improvements include:

* Better requirement deduplication
* More advanced resume section detection
* Job-specific keyword and semantic analysis
* Industry-specific scoring
* Resume improvement suggestions
* ATS compatibility analysis
* Resume rewriting
* Job recommendation system
* Historical analysis tracking
* Support for additional AI providers
* Improved evaluation and benchmarking

---

## Key Learning Outcomes

This project demonstrates practical experience with:

* MERN stack development
* REST API development
* MongoDB
* MongoDB Vector Search
* Embeddings
* Retrieval-Augmented Generation
* LLM integration
* Prompt engineering
* PDF text extraction
* Semantic search
* Structured AI outputs
* Deterministic scoring
* Full-stack application architecture
* AI application deployment

---

## Author

**Suji Gayatri Kadiyala**

B.Tech — Artificial Intelligence & Machine Learning

2026 Graduate

---

## License

This project is intended for educational and portfolio purposes.

```
```
