import {
  pgTable, uuid, text, integer, jsonb,
  timestamp, boolean, index
} from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  plan:      text('plan').notNull().default('essencial'),
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  tenantId:     uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role').notNull().default('VIEWER'),
  createdAt:    timestamp('created_at').defaultNow().notNull()
}, t => ({
  tenantIdx: index('users_tenant_idx').on(t.tenantId)
}))

export const apiKeys = pgTable('api_keys', {
  id:        uuid('id').primaryKey().defaultRandom(),
  tenantId:  uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  keyHash:   text('key_hash').notNull().unique(),
  label:     text('label').notNull().default('default'),
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
})

export const kpis = pgTable('kpis', {
  id:           uuid('id').primaryKey().defaultRandom(),
  tenantId:     uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  createdBy:    uuid('created_by').references(() => users.id),
  title:        text('title').notNull(),
  sql:          text('sql').notNull(),
  format:       text('format').notNull().default('number'),
  refreshEvery: integer('refresh_every').notNull().default(300),
  pinned:       boolean('pinned').notNull().default(false),
  createdAt:    timestamp('created_at').defaultNow().notNull()
}, t => ({
  tenantIdx: index('kpis_tenant_idx').on(t.tenantId)
}))

export const savedAnalyses = pgTable('saved_analyses', {
  id:        uuid('id').primaryKey().defaultRandom(),
  tenantId:  uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  userId:    uuid('user_id').references(() => users.id),
  title:     text('title').notNull(),
  query:     text('query').notNull(),
  sql:       text('sql').notNull(),
  vizConfig: jsonb('viz_config').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, t => ({
  tenantIdx: index('analyses_tenant_idx').on(t.tenantId)
}))

export const semanticCatalog = pgTable('semantic_catalog', {
  id:          uuid('id').primaryKey().defaultRandom(),
  tenantId:    uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  tableName:   text('table_name').notNull(),
  description: text('description').notNull(),
  grain:       text('grain').notNull(),
  columns:     jsonb('columns').notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull()
}, t => ({
  tenantTableIdx: index('catalog_tenant_table_idx').on(t.tenantId, t.tableName)
}))

export const tenantReports = pgTable('tenant_reports', {
  id:           uuid('id').primaryKey().defaultRandom(),
  tenantId:     uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  reportSlug:   text('report_slug').notNull(),
  pbiEmbedUrl:  text('pbi_embed_url'),
  filterColumn: text('filter_column'),
  filterValue:  text('filter_value'),
  active:       boolean('active').notNull().default(true),
  rotatedAt:    timestamp('rotated_at')
})
