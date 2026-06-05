import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@repo/auth'
import { db, kpis, eq } from '@repo/db'
import { z } from 'zod'

const createSchema = z.object({
  title:        z.string().min(1).max(100),
  sql:          z.string().min(10),
  format:       z.enum(['currency','percent','number','duration']).default('number'),
  refreshEvery: z.number().int().min(60).max(86400).default(300),
  pinned:       z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const session = await verifyJWT(req.cookies.get('session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await db.select().from(kpis).where(eq(kpis.tenantId, session.tenantId)).orderBy(kpis.pinned, kpis.createdAt)
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await verifyJWT(req.cookies.get('session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['TENANT_ADMIN','TENANT_ANALYST'].includes(session.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = createSchema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 })
  const [created] = await db.insert(kpis).values({ tenantId: session.tenantId, createdBy: session.userId, ...body.data }).returning()
  return NextResponse.json(created, { status: 201 })
}
