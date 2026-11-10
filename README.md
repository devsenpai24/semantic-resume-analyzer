# SynapCV ⚡
### Neural Resume Intelligence & ATS Job Match Scoring System

**SynapCV** is an enterprise-grade NLP resume analysis platform that evaluates candidate resumes against target job descriptions. It calculates dual-layer alignment scores (hard skill matrix + deep semantic embeddings), identifies missing competency gaps, and produces recruiter-grade ATS optimizations powered by Groq LLM.

---

## 💎 Design Philosophy & Frontend
Built without AI slop or generic boilerplate templates. Designed with:
- **Obsidian & Teal Theme**: Deep space dark palette, subtle glowing borders, and clean typography (Inter + JetBrains Mono).
- **Radial Circular Score Dashboard**: Instant visualization of Overall ATS Alignment, Semantic Resonance, and Skill Coverage.
- **Categorized Skill Matrix**: Interactive domain filtering (Languages, Frameworks, Cloud & DevOps, AI/ML, Databases).
- **Recruiter Intelligence Hub**: Quantified STAR-format bullet point rewrites, missing ATS keyword pill cloud with 1-click copy, and executive career verdicts.
- **Sample Role Presets**: 1-click testing for Full Stack, AI/ML, and Cloud/DevOps engineers.
- **Dual Frontend Architecture**:
  1. **Modern React Web App** (`frontend/`): Vite + React 18 + Tailwind CSS + Lucide Icons.
  2. **FastAPI Engine** (`nlp/api.py`): High-throughput REST API with PyMuPDF & Sentence Transformers.
  3. **Streamlit App** (`nlp/app.py`): Polished, custom-styled single-file alternative.

---

## 📌 Architecture & Features

```
                   ┌───────────────────────────────┐
                   │    Candidate PDF Resume       │
                   └──────────────┬────────────────┘
                                  │ (PyMuPDF / fitz)
                                  ▼
                   ┌───────────────────────────────┐
                   │     Text Cleaning & Norm      │
                   └──────┬─────────────────┬──────┘
                          │                 │
    (Rule-based Regex)    ▼                 ▼    (Sentence Transformers)
┌───────────────────────────────┐     ┌──────────────────────────────────┐
│   Skill Extraction Matrix     │     │ 384-d Dense Vector Embeddings    │
│   (Languages, Cloud, AI...)   │     │ (all-MiniLM-L6-v2)               │
└──────────────┬────────────────┘     └─────────────────┬────────────────┘
               │                                        │
               ▼                                        ▼
┌───────────────────────────────┐     ┌──────────────────────────────────┐
│   Skill Match Score (60%)     │     │ Semantic Resonance Score (40%)   │
└──────────────┬────────────────┘     └─────────────────┬────────────────┘
               │                                        │
               └──────────────────┬─────────────────────┘
                                  ▼
               ┌───────────────────────────────────────┐
               │    Final ATS Composite Alignment      │
               │    = (0.6 * Skill) + (0.4 * Semantic) │
               └──────────────────┬────────────────────┘
                                  │
                                  ▼
               ┌───────────────────────────────────────┐
               │ Groq LLM Recruiter Suggestions Hub    │
               │ (STAR Bullet Rewrites & Missing Keys) │
               └───────────────────────────────────────┘
```

### 1. 📄 Resume Parsing
- Multi-page PDF text extraction via PyMuPDF (`fitz`).
- Handles complex multi-column and ATS-friendly layouts.

### 2. 🧹 Text Normalization
- Case normalization, unicode cleanup, and whitespace trimming.

### 3. 🎯 Rule-Based NLP Skill Matrix
- Normalizes canonical skills and aliases across 5 domains:
  - **Languages**: Python, TypeScript, Java, C++, Go, etc.
  - **Frameworks**: React, Redux, Node.js, FastAPI, Django, Flask, etc.
  - **Cloud & DevOps**: AWS, GCP, Azure, Docker, Kubernetes, Terraform, CI/CD, Git.
  - **AI / ML**: PyTorch, HuggingFace Transformers, LLMs, Scikit-learn, Spacy, NLP.
  - **Databases & Data**: PostgreSQL, MongoDB, Redis, Kafka, Elasticsearch, Spark.

### 4. 🧠 Semantic Similarity Matching
- Computes contextual similarity using `sentence-transformers/all-MiniLM-L6-v2`.
- Detects conceptual equivalence even when exact keywords differ (e.g. "managed multi-region clusters" matching "Kubernetes cloud infrastructure").

### 5. 🤖 Groq LLM Intelligence Hub
- Generates targeted executive critique.
- Extracts missing ATS keywords for instant copy-paste.
- Rewrites weak resume bullet points into high-impact, quantified STAR achievements.

---

## 🚀 Quickstart Guide

### 1. Modern React Web Application (Recommended)

#### Terminal 1 — Start the FastAPI Engine:
```bash
python3 nlp/api.py
# Runs on http://localhost:8000
```

#### Terminal 2 — Start the Vite Frontend:
```bash
cd frontend
npm run dev
# Open http://localhost:5173 in your browser
```

---

### 2. Streamlit UI (Alternative)

```bash
streamlit run nlp/app.py
```

---

## 🔑 Groq API Configuration (Optional)
To enable real-time Groq LLM suggestions, create a `.env` file in the project root:
```env
GROQ_API_KEY="your-groq-api-key-here"
```
*(If no API key is provided, SynapCV automatically uses its built-in rule-based intelligence fallback so your workflow is never interrupted).*

---

## 📂 Project Structure

```
SynapCV/
├── frontend/                     # Modern React + Vite + Tailwind Web Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Navigation, Preset Selector & System Health
│   │   │   ├── ResumeDropzone.jsx # PyMuPDF Drag-and-Drop & Text Inspector
│   │   │   ├── JobDescriptionEditor.jsx # JD Editor & Quick Role Presets
│   │   │   ├── ScoreDashboard.jsx # Radial Gauge & ATS Fit Breakdown
│   │   │   ├── SkillIntelligence.jsx # Categorized Skill Gap Matrix
│   │   │   ├── SemanticDeepDive.jsx # Vector Embedding Similarity Insights
│   │   │   └── AIOptimizerHub.jsx # Groq STAR Rewrites & Keyword Cloud
│   │   ├── data/presets.js       # Real-world candidate profiles & job descriptions
│   │   ├── utils/analyzer.js     # NLP extractor & client fallback logic
│   │   ├── App.jsx               # Master state & layout
│   │   └── index.css             # Obsidian & Teal design system
│   ├── tailwind.config.js
│   └── package.json
│
├── nlp/                          # Python NLP Core Engine
│   ├── api.py                    # High-throughput FastAPI REST API
│   ├── app.py                    # Upgraded Streamlit interface
│   ├── resume_analyzer.py        # Core orchestration pipeline
│   ├── semantic_matcher.py       # SentenceTransformers MiniLM-L6
│   ├── skill_extractor.py        # Rule-based NLP skill dictionary
│   ├── gap_analyzer.py           # Skill gap comparative matrix
│   ├── scorer.py                 # Weighted composite score formula
│   ├── pdf_parser.py             # PyMuPDF PDF parser
│   ├── text_cleaner.py           # Preprocessing & normalization
│   ├── llm_services.py           # Groq LLM prompt & schema parser
│   └── requirements.txt
│
└── README.md
```
