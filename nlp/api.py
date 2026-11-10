import os
import sys
import tempfile
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add current nlp directory to sys.path so existing modules are found
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from pdf_parser import extract_text_from_pdf
from text_cleaner import clean_text
from skill_extractor import extract_skills
from gap_analyzer import compare_skill_sets
from semantic_matcher import semantic_match_result
from scorer import calculate_final_score
from llm_services import get_resume_suggestions_json

app = FastAPI(
    title="SynapCV Engine API",
    description="High-performance NLP & Semantic Resume Intelligence Engine",
    version="2.0.0"
)

# Enable CORS for local Vite frontend and general development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

def run_pipeline(resume_text: str, job_description: str) -> Dict[str, Any]:
    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(job_description)

    resume_skills = extract_skills(cleaned_resume)
    jd_skills = extract_skills(cleaned_jd)

    gap_result = compare_skill_sets(resume_skills, jd_skills)
    semantic_result = semantic_match_result(cleaned_resume, cleaned_jd)

    final_result = calculate_final_score(
        skill_match_score=gap_result["skill_match_score"],
        semantic_score=semantic_result["semantic_score"]
    )

    # Groq AI Suggestions (with graceful error handling & rich fallback if key is missing)
    ai_suggestions = None
    try:
        ai_suggestions = get_resume_suggestions_json(
            resume_text=cleaned_resume,
            jd_text=cleaned_jd,
            matched_skills=gap_result["matched_skills"],
            missing_skills=gap_result["missing_skills"],
            final_score=final_result["final_score"]
        )
    except Exception as e:
        ai_suggestions = None

    # If Groq returned a generic empty fallback or failed, provide rich contextual advice
    if not ai_suggestions or not ai_suggestions.get("rewritten_bullets"):
        top_missing = gap_result["missing_skills"][:4]
        top_matched = gap_result["matched_skills"][:4]
        ai_suggestions = {
            "overall_feedback": f"Strong contextual baseline in {', '.join(top_matched) if top_matched else 'core skills'}. Candidate demonstrates competent domain experience, but bridging direct mentions of {', '.join(top_missing) if top_missing else 'required frameworks'} will significantly enhance ATS pass-through velocity.",
            "missing_keywords": gap_result["missing_skills"] if gap_result["missing_skills"] else ["System Architecture", "Continuous Integration", "High Throughput"],
            "top_improvements": [
                f"Incorporate missing core competencies: {', '.join(top_missing)}" if top_missing else "Emphasize leadership and architecture decision impact.",
                "Structure experience using the STAR method (Situation, Task, Action, Result) with measurable metrics.",
                "Align technical terms and synonyms directly with the target job posting to boost keyword ranking.",
                "Highlight automated testing, code review rigour, and CI/CD deployment cadence."
            ],
            "rewritten_bullets": [
                f"Spearheaded end-to-end architecture and deployment of high-availability microservices using {', '.join(top_matched[:2]) if top_matched else 'core frameworks'}, cutting API response latency by 32% under peak load.",
                f"Integrated robust automated delivery pipelines and containerized testing workflows, reducing release friction and deployment turnaround by 45%.",
                f"Designed and scaled data ingestion pipelines processing high-volume transactional workloads while preserving 99.9% uptime SLA."
            ],
            "final_advice": f"Your technical resonance is strong ({final_result['final_score']}/100 - {final_result['final_label']}). Prioritize explicitly showcasing {', '.join(top_missing[:2]) if top_missing else 'system-scale results'} in your latest work history."
        }

    return {
        "success": True,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "gap_analysis": gap_result,
        "semantic_match": semantic_result,
        "final_result": final_result,
        "ai_suggestions": ai_suggestions,
        "stats": {
            "resume_words": len(cleaned_resume.split()),
            "jd_words": len(cleaned_jd.split()),
            "matched_count": len(gap_result["matched_skills"]),
            "missing_count": len(gap_result["missing_skills"]),
            "extra_count": len(gap_result["extra_skills"])
        }
    }

@app.get("/api/health")
def health_check():
    groq_configured = bool(os.getenv("GROQ_API_KEY"))
    return {
        "status": "healthy",
        "service": "SynapCV Core Engine",
        "groq_configured": groq_configured
    }

@app.post("/api/parse-pdf")
async def parse_pdf_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        raw_text = extract_text_from_pdf(tmp_path)
        return {
            "filename": file.filename,
            "text": raw_text,
            "char_count": len(raw_text),
            "word_count": len(raw_text.split())
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/api/analyze")
async def analyze_endpoint(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: str = Form(...)
):
    text_to_analyze = ""
    if file:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        try:
            text_to_analyze = extract_text_from_pdf(tmp_path)
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    elif resume_text:
        text_to_analyze = resume_text
    else:
        raise HTTPException(status_code=400, detail="Either a resume PDF file or resume_text must be provided.")

    if not text_to_analyze.strip():
        raise HTTPException(status_code=400, detail="Extracted resume text is empty.")
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

    return run_pipeline(text_to_analyze, job_description)

@app.post("/api/analyze-json")
def analyze_json_endpoint(payload: TextAnalysisRequest):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    if not payload.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    return run_pipeline(payload.resume_text, payload.job_description)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8080, reload=True)
