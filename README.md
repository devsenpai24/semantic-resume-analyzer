# Scorify 🚀
### AI-Powered Resume Analyzer & Job Match Scoring System

Scorify is an NLP-powered resume analysis platform that compares a candidate's resume against a job description, calculates a match score, identifies missing skills, performs semantic similarity analysis, and generates AI-powered improvement suggestions using Groq LLM.

---

## 📌 Features

### 📄 Resume Parsing
- Extract text from PDF resumes using PyMuPDF
- Supports multi-page resumes
- Handles ATS-friendly and standard resume formats

### 🧹 Text Cleaning
- Lowercase normalization
- Special character removal
- Whitespace normalization
- NLP-ready preprocessing

### 🎯 Skill Extraction
- Rule-based NLP skill extraction
- Skill alias normalization
- Detects:
  - Programming Languages
  - Frameworks
  - Databases
  - AI/ML Technologies
  - Cloud & DevOps Tools

### 📊 Skill Gap Analysis
Identifies:
- Matched Skills
- Missing Skills
- Additional Skills
- Skill Match Percentage

### 🧠 Semantic Matching
Uses Sentence Transformers to:
- Compare resume meaning with job description
- Measure contextual similarity
- Generate semantic match score

### 🏆 Final Resume Score
Combines:
- Skill Match Score
- Semantic Similarity Score

Produces:
- Final ATS Score
- Resume Fit Label

### 🤖 AI Suggestions (Groq)
Provides:
- Resume improvement suggestions
- Missing keyword recommendations
- ATS optimization tips
- Resume bullet point rewrites

---

## 🏗️ Project Architecture

```text
Resume PDF
    │
    ▼
PDF Parser
    │
    ▼
Text Cleaner
    │
    ▼
Skill Extractor
    │
    ▼
Gap Analyzer
    │
    ├────────────► Skill Match Score
    │
    ▼
Semantic Matcher
    │
    ├────────────► Semantic Score
    │
    ▼
Scorer
    │
    ▼
Final Resume Score
    │
    ▼
Groq AI Suggestions
```

---

## 📂 Project Structure

```text
scorify/
│
├── backend/
│
├── frontend/
│
├── nlp/
│   ├── pdf_parser.py
│   ├── text_cleaner.py
│   ├── skill_extractor.py
│   ├── gap_analyzer.py
│   ├── semantic_matcher.py
│   ├── scorer.py
│   ├── groq_suggester.py
│   └── test.py
│
├── .env
├── requirements.txt
└── README.md
```

---

## ⚙️ Tech Stack

### Backend
- Python
- FastAPI

### NLP
- Sentence Transformers
- spaCy
- Regex Processing

### PDF Processing
- PyMuPDF

### AI
- Groq API
- Llama 3.3 70B

### Frontend
- React.js
- Tailwind CSS

---

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/scorify.git
cd scorify
```

### Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 📦 Requirements

```txt
pymupdf
sentence-transformers
torch
scikit-learn
spacy
fastapi
uvicorn
python-multipart
groq
python-dotenv
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
```

---

## 🚀 Running the Project

### Run NLP Testing

```bash
python nlp/test.py
```

---

## Example Job Description

```text
We are hiring a Software Developer Intern with skills in:

Python
React
FastAPI
SQL
Docker
Git
REST APIs

Experience in Machine Learning and NLP is preferred.
```

---

## Example Output

### Skill Match Analysis

```json
{
  "matched_skills": [
    "python",
    "react",
    "sql",
    "git"
  ],
  "missing_skills": [
    "docker",
    "fastapi",
    "nlp"
  ],
  "skill_match_score": 57.14
}
```

### Semantic Match

```json
{
  "semantic_score": 71.52,
  "semantic_label": "Moderate Match"
}
```

### Final Score

```json
{
  "final_score": 63.92,
  "final_label": "Good Fit"
}
```

---

## Future Improvements

### ATS Analysis
- Resume formatting score
- Section completeness check
- Contact information validation

### Advanced NLP
- Named Entity Recognition
- Experience extraction
- Education extraction
- Certification extraction

### AI Enhancements
- Resume rewriting
- Cover letter generation
- Interview question generation

### Dashboard
- Resume upload UI
- Score visualization
- Downloadable reports

---

## Roadmap

### Phase 1
- PDF Parsing ✅
- Text Cleaning ✅
- Skill Extraction ✅

### Phase 2
- Skill Matching ✅
- Semantic Similarity ✅
- Final Scoring ✅

### Phase 3
- Groq Suggestions ✅
- FastAPI Integration ⏳

### Phase 4
- React Frontend ⏳
- Authentication ⏳
- Dashboard ⏳

---

## Sample Workflow

```text
Upload Resume
      │
      ▼
Extract PDF Text
      │
      ▼
Clean Resume Data
      │
      ▼
Extract Skills
      │
      ▼
Compare with Job Description
      │
      ▼
Calculate Match Score
      │
      ▼
Generate AI Suggestions
      │
      ▼
Show Results Dashboard
```

---

## Author

**Dev Giri**

Computer Science Engineer | Full Stack Developer | AI Enthusiast

---

## License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
