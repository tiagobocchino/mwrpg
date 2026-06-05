# Skill: Adicionar nova rota de API

Adicione uma rota: $ARGUMENTS ("método PATH | descrição | serviço: web/ingest/ai")

## Qual serviço recebe a rota?

- `apps/web/app/api/` → Route Handlers Next.js — autenticados via cookie JWT, acesso ao DB
- `services/ingest-api/` → FastAPI — clientes externos via API key, acesso ao S3
- `services/ai-analytics/` → FastAPI — interno apenas, via X-Internal-Secret

## Padrão Next.js

```typescript
export async function POST(req: NextRequest) {
  const session = await verifyJWT(req.cookies.get('session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = schema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: body.error }, { status: 422 })
  // lógica com session.tenantId
}
```

## Padrão FastAPI

```python
@router.post("/", response_model=Response)
async def rota(body: Request, tenant: dict = Depends(get_tenant)):
    """Descrição."""
    return Response(...)
```
