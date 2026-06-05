from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import query, catalog

app = FastAPI(title="AI Analytics API", version="0.1.0", docs_url="/docs")

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://app.suaplataforma.com"],
    allow_methods=["POST","GET"],
    allow_headers=["Authorization","Content-Type","X-Tenant-Id","X-Internal-Secret"])

app.include_router(query.router)
app.include_router(catalog.router)
