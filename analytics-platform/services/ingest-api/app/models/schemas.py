from pydantic import BaseModel, field_validator
from typing import Any

class IngestPayload(BaseModel):
    records: list[dict[str, Any]]

    @field_validator('records')
    @classmethod
    def validate_records(cls, v: list) -> list:
        if not v: raise ValueError("records não pode ser vazio")
        if len(v) > 10_000: raise ValueError("máximo 10.000 registros por request")
        return v

class IngestResponse(BaseModel):
    status: str
    records: int
    dataset: str
    tenant_id: str
