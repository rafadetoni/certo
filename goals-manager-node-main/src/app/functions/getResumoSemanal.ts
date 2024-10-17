import { db } from '@/db'
import { metasCompletas, metas } from '@/db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, desc, eq, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export async function getResumoSemanal() {
  const anoAtual = dayjs().year()
  const semanaAtual = dayjs().week()

  const metasCriadasAteASemana = db.$with("metasCriadasAteASemana").as(
		db
			.select({
				id: metas.id,
				frequenciaSemanalDesejada: metas.frequenciaSemanalDesejada,
				criadaEm: metas.criadaEm,
			})
			.from(metas)
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${metas.criadaEm}) <= ${anoAtual}`,
					sql`EXTRACT(WEEK FROM ${metas.criadaEm}) <= ${semanaAtual}`,
				),
			),
	)

  const metasCompletasNaSemana = db.$with('metasCompletadasNaSemana').as(
    db
      .select({
        id: metasCompletas.id,
        titulo: metas.titulo,
        completadaEm: metasCompletas.completadaEm,
        completadaData: sql`DATE(${metasCompletas.completadaEm})`.as(
          'completadaData'
        ),
      })
      .from(metasCompletas)
      .orderBy(desc(metasCompletas.completadaEm))
      .innerJoin(metas, eq(metas.id, metasCompletas.meta_id))
      .where(
        and(
          sql`EXTRACT(YEAR FROM ${metas.criadaEm}) = ${anoAtual}`,
          sql`EXTRACT(WEEK FROM ${metas.criadaEm}) = ${semanaAtual}`
        )
      )
  )

  const metasCompletasPorDiaDaSemana = db.$with('metasCompletasPorDiaDaSemana').as(
    db
      .select({
        completadaData: metasCompletasNaSemana.completadaData,
        completas: sql<
          { id: string; titulo: string; completadaEm: string }[]
        > /* sql */`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${metasCompletasNaSemana.id},
            'titulo', ${metasCompletasNaSemana.titulo},
            'completadaEm', ${metasCompletasNaSemana.completadaEm}
          )
        )
      `.as('completas'),
      })
      .from(metasCompletasNaSemana)
      .groupBy(metasCompletasNaSemana.completadaData)
  )

  type Summary = Record<
    string,
    { id: string; titulo: string; completadaEm: string }[]
  >

  const [summary] = await db
    .with(metasCriadasAteASemana, metasCompletasNaSemana, metasCompletasPorDiaDaSemana)
    .select({
      completas: sql<number> /*sql*/`
        (SELECT COUNT(*) FROM ${metasCompletasNaSemana})::DECIMAL
      `.mapWith(Number),
      total: sql<number> /*sql*/`
        (SELECT SUM(${metasCriadasAteASemana.frequenciaSemanalDesejada}) FROM ${metasCriadasAteASemana})::DECIMAL
      `.mapWith(Number),
      metasPorDia: sql<Summary> /*sql*/`
        JSON_OBJECT_AGG(${metasCompletasPorDiaDaSemana.completadaData}, ${metasCompletasPorDiaDaSemana.completas})
      `,
    })
    .from(metasCompletasPorDiaDaSemana)

  return { summary }
}
