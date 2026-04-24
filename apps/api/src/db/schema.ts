import { sqliteTable, int, text, real } from 'drizzle-orm/sqlite-core'

export const jobs = sqliteTable('jobs', {
  // Core
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull().unique(),
  company: text().notNull(),
  link: text().notNull().unique(),
  status: text().notNull().default(''),
  location: text().notNull().default(''),
  source: text().notNull(),
  description: text(),
  createdAt: text().notNull(),
  expiresAt: text().notNull().default(''),
  updatedAt: text(),
  clicks: int().notNull().default(0),
  manuallyAdded: int({ mode: 'boolean' }).notNull().default(false),

  // Enrichment
  isDevRole: int({ mode: 'boolean' }),
  relevanceScore: real(),
  tags: text(), // JSON string → string[]
  salaryMin: int(),
  salaryMax: int(),
  workType: text().$type<'remote' | 'hybrid' | 'onsite' | 'unknown'>(),
  enrichmentStatus: text()
    .$type<'pending' | 'done' | 'failed' | 'skipped'>()
    .notNull()
    .default('pending'),
  enrichedAt: text(),
})

export const subscribers = sqliteTable('subscribers', {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  createdAt: text().notNull(),
  confirmed: int({ mode: 'boolean' }).notNull().default(false),
})

export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert
export type Subscriber = typeof subscribers.$inferSelect
export type NewSubscriber = typeof subscribers.$inferInsert
