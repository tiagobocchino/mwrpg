from typing import Any

def suggest(schema: list[dict], rows: list[dict]) -> dict[str, Any]:
    """Sugere o tipo de visualização mais adequado com base no shape dos dados."""
    row_count = len(rows)
    col_count = len(schema)
    numeric = [c for c in schema if c["type"]=="number"]
    dates   = [c for c in schema if c["type"]=="date"]
    strings = [c for c in schema if c["type"]=="string"]

    if row_count==1 and len(numeric)==1 and col_count<=2:
        return {"type": "kpi", "yAxis": numeric[0]["name"]}
    if dates and numeric and row_count>1:
        return {"type": "line", "xAxis": dates[0]["name"], "yAxis": [n["name"] for n in numeric[:3]]}
    if strings and numeric and row_count<=30:
        return {"type": "bar", "xAxis": strings[0]["name"], "yAxis": numeric[0]["name"]}
    if len(strings)==1 and len(numeric)==1 and row_count<=8:
        return {"type": "pie", "xAxis": strings[0]["name"], "yAxis": numeric[0]["name"]}
    return {"type": "table"}
