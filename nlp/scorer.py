from typing import Dict

def calculate_final_score(skill_match_score: float, semantic_score: float) -> Dict:
    """
    Combine skill match and semantic similarity into one final score.
    """

    final_score = (0.6 * skill_match_score) + (0.4 * semantic_score)

    if final_score >= 80:
        label = "Excellent fit"
    elif final_score >= 65:
        label = "Good fit"
    elif final_score >= 50:
        label = "Average fit"
    elif final_score >= 35:
        label = "Low fit"
    else:
        label = "Poor fit"

    return {
        "final_score": round(final_score, 2),
        "final_label": label
    }