from pdf_parser import extract_text_from_pdf
from text_cleaner import clean_text
from skill_extractor import extract_skills
from gap_analyzer import compare_skill_sets
from semantic_matcher import semantic_match_result
from scorer import calculate_final_score
from llm_services import get_resume_suggestions_json


def analyze_resume(file_path, job_description):
    raw = extract_text_from_pdf(file_path)

    cleaned_resume = clean_text(raw)
    cleaned_jd = clean_text(job_description)

    resume_skills = extract_skills(cleaned_resume)
    jd_skills = extract_skills(cleaned_jd)

    gap_result = compare_skill_sets(resume_skills, jd_skills)
    semantic_result = semantic_match_result(cleaned_resume, cleaned_jd)

    final_result = calculate_final_score(
        skill_match_score=gap_result["skill_match_score"],
        semantic_score=semantic_result["semantic_score"]
    )

    ai_suggestions = get_resume_suggestions_json(
        resume_text=cleaned_resume,
        jd_text=cleaned_jd,
        matched_skills=gap_result["matched_skills"],
        missing_skills=gap_result["missing_skills"],
        final_score=final_result["final_score"]
    )

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "gap_analysis": gap_result,
        "semantic_match": semantic_result,
        "final_result": final_result,
        "ai_suggestions": ai_suggestions
    }