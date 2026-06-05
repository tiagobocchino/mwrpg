import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@repo/auth'
import { z } from 'zod'

const bodySchema = z.object({
  query: z.string().min(3).max(500),
  history: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string() })).optional()
})

export async function POST(req: NextRequest) {
  const session = await verifyJWT(req.cookies.get('session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = bodySchema.safeParse(await req.json())
  if (!body.success) return NextResponse.json({ error: body.error.flatten() }, { status: 422 })

  const aiRes = await fetch(`${process.env.AI_API_URL}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': session.tenantId,
      'X-Internal-Secret': process.env.INTERNAL_SECRET!,
    },
    body: JSON.stringify(body.data),
  })

  if (!aiRes.ok) {
    const err = await aiRes.json().catch(() => ({ detail: 'Erro interno' }))
    return NextResponse.json({ error: err.detail }, { status: aiRes.status })
  }

  return NextResponse.json(await aiRes.json())
}
