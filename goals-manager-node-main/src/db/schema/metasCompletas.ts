import { text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { metas } from './metas'

export const metasCompletas = pgTable('metasCompletas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  meta_id: text('meta_id')
    .references(() => metas.id)
    .notNull(),
  completadaEm: timestamp('completadaEm', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
