import { drizzle } from 'drizzle-orm/libsql'

export const db = !['production', 'PRODUCTION'].includes(process.env.NODE_ENV!)
  ? drizzle(process.env.DB_URL!)
  : drizzle({
      connection: {
        url: process.env.DB_URL!,
        authToken: process.env.DB_AUTH_TOKEN!,
      },
    })
