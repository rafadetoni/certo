import { db } from "@/db";
import { metasCompletas, metas } from "@/db/schema";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

dayjs.extend(weekOfYear);

export async function getGraficoMetasDiarias() {
	const anoAtual = dayjs().year();
	const semanaAtual = dayjs().week();

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
	);

	const metasCompletasNaSemana = db.$with("metasCompletasNaSemana").as(
		db
			.select({
				id: metasCompletas.id,
				criadaEm: metasCompletas.completadaEm,
				dataCompletada: sql`DATE(${metasCompletas.completadaEm})`.as(
					"dataCompletada",
				),
			})
			.from(metasCompletas)
			.orderBy(desc(metasCompletas.completadaEm))
			.innerJoin(metas, eq(metas.id, metasCompletas.meta_id))
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${metasCompletas.completadaEm}) = ${anoAtual}`,
					sql`EXTRACT(WEEK FROM ${metasCompletas.completadaEm}) = ${semanaAtual}`,
				),
			),
	);

	const graficoMetasDiarias = db.$with("metasCompletasPorDiaDaSemana").as(
		db
			.select({
				dataCompletada: metasCompletasNaSemana.dataCompletada,
				totalCompletadas: count().as("totalCompletadas"),
			})
			.from(metasCompletasNaSemana)
			.groupBy(metasCompletasNaSemana.dataCompletada),
	);

	const [graficoDiario] = await db
		.with(metasCriadasAteASemana, metasCompletasNaSemana, graficoMetasDiarias)
		.select({
			dataCompletada: graficoMetasDiarias.dataCompletada,
			
      completada: sql<number> /*sql*/`
      (SELECT COUNT(*) FROM ${metasCompletasNaSemana})::DECIMAL
    `.mapWith(Number),
    
			total: sql<number> /*sql*/`
      (SELECT SUM(${metasCriadasAteASemana.frequenciaSemanalDesejada}) FROM ${metasCriadasAteASemana})::DECIMAL
    `.mapWith(Number),
		})
		.from(graficoMetasDiarias)
		.orderBy(asc(graficoMetasDiarias.dataCompletada));

	console.log(graficoDiario);

	return {
		graficoDiario,
	};
}