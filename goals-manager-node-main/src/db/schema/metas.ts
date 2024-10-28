// Atualizando o schema da tabela metas para incluir o usuário
import { text, timestamp, integer } from 'drizzle-orm/pg-core';
import { pgTable, foreignKey } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { usuarios } from './usuarios';

export const metas = pgTable('metas', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  titulo: text('titulo').notNull(),
  frequenciaSemanalDesejada: integer('frequenciaSemanalDesejada').notNull(),
  criadaEm: timestamp('criadaEm', { withTimezone: true })
    .notNull()
    .defaultNow(),
  usuario_id: text('usuario_id')
    .references(() => usuarios.id) // Relacionamento com a tabela usuarios
});
