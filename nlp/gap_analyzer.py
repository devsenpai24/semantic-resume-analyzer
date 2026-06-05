from typing import List, Dict, Set

def compare_skill_sets(resume_skills: List[str], jd_skills: List[str]) -> Dict:
    resume_set: Set[str] = set(resume_skills)
    jd_set: Set[str] = set(jd_skills)

    matched_skills = resume_set & jd_set
    missing_skills = jd_set - resume_set
    extra_skills = resume_set - jd_set

    skill_match_score = round((len(matched_skills) / len(jd_set)) * 100, 2) if jd_set else 0.0

    return {
        "matched_skills": sorted(matched_skills),
        "missing_skills": sorted(missing_skills),
        "extra_skills": sorted(extra_skills),
        "skill_match_score": skill_match_score
    }
