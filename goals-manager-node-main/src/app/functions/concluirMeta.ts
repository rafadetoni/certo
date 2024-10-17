import { db } from '@/db'
import { metasCompletas, metas } from '@/db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { eq, sql, and } from 'drizzle-orm'

dayjs.extend(weekOfYear)

interface criarRequestMetaCompleta {
  metaId: string
}

export async function concluirMeta({
  metaId,
}: criarRequestMetaCompleta) {
  const anoAtual = dayjs().year()
  const semanaAtual = dayjs().week()

  const metaCompletaCounts = db.$with('metaCompletaCounts').as(
    db
      .select({
        metaId: metasCompletas.meta_id,
        completasCount: sql`COUNT(${metasCompletas.id})`.as(
          'completasCount'
        ),
      })
      .from(metasCompletas)
      .where(
        and(
          eq(metasCompletas.meta_id, metaId),
          sql`EXTRACT(YEAR FROM ${metasCompletas.completadaEm}) = ${anoAtual}`,
          sql`EXTRACT(WEEK FROM ${metasCompletas.completadaEm}) = ${semanaAtual}`
        )
      )
      .groupBy(metasCompletas.meta_id)
  )

  const resultado = await db
    .with(metaCompletaCounts)
    .select({
      incompleta: sql /*sql*/`
        COALESCE(${metas.frequenciaSemanalDesejada}, 0) > COALESCE(${metaCompletaCounts.completasCount}, 0)
      `,
    })
    .from(metas)
    .leftJoin(metaCompletaCounts, eq(metas.id, metaCompletaCounts.metaId))
    .where(eq(metas.id, metaId))
    .limit(1)


    const { incompleta } = resultado[0]

    if (!incompleta) {
    throw new Error('Meta já concluída essa semana!')
  }

  const [metaCompleta] = await db
    .insert(metasCompletas)
    .values({
      meta_id: metaId,
    })
    .returning()

  return {
    metaCompleta,
  }
}


