import re

def clean_text(text: str) -> str:
    if not text:
        return ""

    # lowercase
    text = text.lower()

    # remove weird characters
    text = re.sub(r"[^a-z0-9+#./\-\s\n]", " ", text)

    # fix spacing
    text = re.sub(r"\s+", " ", text)

    # keep line structure
    text = re.sub(r"\n+", "\n", text)

    return text.strip()