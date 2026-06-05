# backend/app/services/pdf_parser.py

import fitz  # PyMuPDF
from typing import Union
import io

def extract_text_from_pdf(file: Union[str, bytes, io.BytesIO]) -> str:
    """
    Extract text from PDF.
    
    Supports:
    - file path (str)
    - bytes (FastAPI upload)
    - BytesIO object
    
    Returns clean extracted text.
    """

    chunks = []

    try:
        # Handle different input types
        if isinstance(file, str):
            doc = fitz.open(file)
        elif isinstance(file, bytes):
            doc = fitz.open(stream=file, filetype="pdf")
        elif isinstance(file, io.BytesIO):
            doc = fitz.open(stream=file.read(), filetype="pdf")
        else:
            raise ValueError("Unsupported file type")

        try:
            for page in doc:
                # Primary extraction
                text = page.get_text("text", sort=True)

                # Fallback extraction if empty
                if not text.strip():
                    text = page.get_text("blocks")

                    if isinstance(text, list):
                        text = " ".join([b[4] for b in text if len(b) > 4])

                if text:
                    chunks.append(text)

        finally:
            doc.close()

    except Exception as e:
        raise RuntimeError(f"PDF parsing failed: {str(e)}")

    final_text = "\n".join(chunks)

    return normalize_extracted_text(final_text)


def normalize_extracted_text(text: str) -> str:
    """
    Clean raw PDF text to make it usable for NLP
    """

    if not text:
        return ""

    # Replace weird unicode bullets
    text = text.replace("\u2022", " ")
    text = text.replace("\xa0", " ")

    # Fix broken line spacing
    text = text.replace("\r", "\n")

    # Remove excessive newlines
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    # Join lines smartly
    cleaned_lines = []
    for line in lines:
        # Merge lines that were split mid-sentence
        if cleaned_lines and not cleaned_lines[-1].endswith(('.', ':')):
            cleaned_lines[-1] += " " + line
        else:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines).strip()