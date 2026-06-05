import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
const EXPIRY = '8h'

export interface SessionPayload {
  userId: string
  tenantId: string
  role: 'TENANT_ADMIN' | 'TENANT_ANALYST' | 'TENANT_VIEWER'
  email: string
}

export async function signJWT(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret)
}

export async function verifyJWT(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const { hash } = await import('bcryptjs')
  return hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const { compare } = await import('bcryptjs')
  return compare(password, hash)
}

export function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `anplt_${hex}`
}

export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}
