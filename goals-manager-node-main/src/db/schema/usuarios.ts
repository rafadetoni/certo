import { text, timestamp } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const usuarios = pgTable('usuarios', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  nome: text('nome'), 
  email: text('email'),
  senha: text('senha'),
  criadoEm: timestamp('criadoEm', { withTimezone: true })
    .defaultNow(), 
});
