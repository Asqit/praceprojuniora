import { relations, sql } from 'drizzle-orm'
import { sqliteTable, int, text, real } from 'drizzle-orm/sqlite-core'

export const jobs = sqliteTable('jobs', {
  // Core
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
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

  // Community
  upvotes: int().notNull().default(0),
  downvotes: int().notNull().default(0),

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

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: int({ mode: 'timestamp' }).default(sql`(current_timestamp)`),
})

export const opaqueTokens = sqliteTable('opaque-tokens', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text().notNull().unique(),
  expiresAt: int({ mode: 'timestamp' }).notNull(),
  revokedAt: int({ mode: 'timestamp' }),
  createdAt: int({ mode: 'timestamp' }).default(sql`(current_timestamp)`),
})

export const opaqueTokensRelations = relations(opaqueTokens, ({ one }) => ({
  user: one(users, {
    fields: [opaqueTokens.userId],
    references: [users.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  opaqueTokens: many(opaqueTokens),
}))

export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert
export type Subscriber = typeof subscribers.$inferSelect
export type NewSubscriber = typeof subscribers.$inferInsert
