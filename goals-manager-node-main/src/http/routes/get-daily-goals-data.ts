import { getDailyGoalsChart } from "@/app/functions/get-daily-goals-data";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getDailyGoalsChartRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/daily-goals-chart", {}, async () => {
		const { dailyChart } = await getDailyGoalsChart();

		return { dailyChart };
	});
};
