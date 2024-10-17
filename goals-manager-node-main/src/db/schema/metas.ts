import { text, timestamp, integer } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const metas = pgTable('metas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  titulo: text('titulo').notNull(),
  frequenciaSemanalDesejada: integer('frequenciaSemanalDesejada').notNull(),
  criadaEm: timestamp('criadaEm', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
