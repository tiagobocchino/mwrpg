from fastapi import APIRouter, Depends, BackgroundTasks
from ..middleware.auth import get_tenant
from ..models.schemas import IngestPayload, IngestResponse
from ..workers.s3_writer import write_to_bronze

router = APIRouter(prefix="/ingest", tags=["ingest"])

@router.post("/{dataset}", response_model=IngestResponse)
async def ingest(dataset: str, payload: IngestPayload, background_tasks: BackgroundTasks, tenant: dict = Depends(get_tenant)):
    """Recebe registros e os grava como Parquet no S3 (camada bronze). Processamento assíncrono."""
    background_tasks.add_task(write_to_bronze, tenant_id=tenant["id"], dataset=dataset, records=payload.records)
    return IngestResponse(status="queued", records=len(payload.records), dataset=dataset, tenant_id=tenant["id"])
