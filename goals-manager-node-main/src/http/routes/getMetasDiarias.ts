import { getGraficoMetasDiarias } from "@/app/functions/getMetasDiarias";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const rotaGetGraficoMetasDiarias: FastifyPluginAsyncZod = async (app) => {
	app.get("/daily-goals-chart", {}, async () => {
		const { graficoDiario } = await getGraficoMetasDiarias();

		return { graficoDiario };
	});
};

