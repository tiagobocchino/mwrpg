import re

BLOCKED_PATTERNS = [
    r"\bINSERT\b", r"\bUPDATE\b", r"\bDELETE\b", r"\bDROP\b",
    r"\bCREATE\b", r"\bALTER\b", r"\bTRUNCATE\b", r"\bGRANT\b",
    r"\bREVOKE\b", r"\bEXEC\b", r"\bEXECUTE\b",
]

class SQLValidationError(Exception):
    pass

def validate(sql: str) -> None:
    """Garante que o SQL é somente SELECT. Lança SQLValidationError se inválido."""
    upper = sql.upper()
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, upper):
            raise SQLValidationError(f"SQL inválido: operação não permitida detectada")
    stripped = sql.strip()
    if not stripped.upper().startswith("SELECT") and not stripped.upper().startswith("WITH"):
        raise SQLValidationError("SQL deve começar com SELECT ou WITH")
