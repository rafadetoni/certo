import { db } from '@/db';
import { metasCompletas, metas } from '@/db/schema';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { and, asc, count, eq, sql } from 'drizzle-orm';

dayjs.extend(weekOfYear);

export async function getMetasSemanaisPendentes(usuarioId: string) {
  const anoAtual = dayjs().year();
  const semanaAtual = dayjs().week();

  const metasCriadasAteASemana = db.$with("metasCriadasAteASemana").as(
    db
      .select({
        id: metas.id,
        titulo: metas.titulo,
        frequenciaSemanalDesejada: metas.frequenciaSemanalDesejada,
        criadaEm: metas.criadaEm,
        usuario_id: metas.usuario_id,
      })
      .from(metas)
      .where(
        and(
          eq(metas.usuario_id, usuarioId), 
          sql`EXTRACT(YEAR FROM ${metas.criadaEm}) <= ${anoAtual}`,
          sql`EXTRACT(WEEK FROM ${metas.criadaEm}) <= ${semanaAtual}`,
        ),
      ),
  );

  const metasCompletasCount = db.$with('metasCompletasCount').as(
    db
      .select({
        metaId: metas.id,
        completasCount: count(metasCompletas.id).as('completasCount'),
      })
      .from(metasCompletas)
      .innerJoin(metas, eq(metas.id, metasCompletas.meta_id))
      .where(eq(metas.usuario_id, usuarioId)) 
      .groupBy(metas.id)
  );

  const metasPendentes = await db
    .with(metasCriadasAteASemana, metasCompletasCount)
    .select({
      id: metasCriadasAteASemana.id,
      titulo: metasCriadasAteASemana.titulo,
      frequenciaSemanalDesejada: metasCriadasAteASemana.frequenciaSemanalDesejada,
      completasCount: sql`COALESCE(${metasCompletasCount.completasCount}, 0)`,
    })
    .from(metasCriadasAteASemana)
    .orderBy(asc(metasCriadasAteASemana.criadaEm))
    .leftJoin(
      metasCompletasCount,
      eq(metasCriadasAteASemana.id, metasCompletasCount.metaId)
    );

  if (!metasPendentes.length) {
    console.warn('Nenhuma meta pendente encontrada.');
  }

  return { metasPendentes };
}
