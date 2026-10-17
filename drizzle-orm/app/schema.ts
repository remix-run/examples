import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const example = sqliteTable('example', {
  id: integer('id').primaryKey(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})
