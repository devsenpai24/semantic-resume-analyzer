
from sentence_transformers import SentenceTransformer
from typing import Dict

# Fast and practical for MVP
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def compute_semantic_similarity(text1: str, text2: str) -> float:
    """
    Returns a similarity score from 0 to 100
    """
    if not text1 or not text2:
        return 0.0

    embeddings = model.encode([text1, text2])
    similarity_matrix = model.similarity(embeddings, embeddings)

    # similarity between text1 and text2
    score = float(similarity_matrix[0][1])

    # convert roughly to percentage
    return round(score * 100, 2)


def classify_match(score: float) -> str:
    if score >= 80:
        return "Strong match"
    if score >= 60:
        return "Moderate match"
    if score >= 40:
        return "Weak match"
    return "Poor match"


def semantic_match_result(resume_text: str, jd_text: str) -> Dict:
    score = compute_semantic_similarity(resume_text, jd_text)

    return {
        "semantic_score": score,
        "semantic_label": classify_match(score)
    }