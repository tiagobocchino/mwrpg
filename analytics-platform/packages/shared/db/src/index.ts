import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })

export * from './schema'
export { eq, and, or, lt, gt, lte, gte, desc, asc, sql as sqlExpr } from 'drizzle-orm'
