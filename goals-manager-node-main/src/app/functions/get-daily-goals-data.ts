import { db } from "@/db";
import { goalCompletions, goals } from "@/db/schema";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

dayjs.extend(weekOfYear);

export async function getDailyGoalsChart() {
	const currentYear = dayjs().year();
	const currentWeek = dayjs().week();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
					sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`,
				),
			),
	);

	const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
		db
			.select({
				id: goalCompletions.id,
				createdAt: goalCompletions.createdAt,
				completionDate: sql`DATE(${goalCompletions.createdAt})`.as(
					"completionDate",
				),
			})
			.from(goalCompletions)
			.orderBy(desc(goalCompletions.createdAt))
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${goalCompletions.createdAt}) = ${currentYear}`,
					sql`EXTRACT(WEEK FROM ${goalCompletions.createdAt}) = ${currentWeek}`,
				),
			),
	);

	const dailyGoalsChart = db.$with("goals_completed_by_week_day").as(
		db
			.select({
				completionDate: goalsCompletedInWeek.completionDate,
				totalCompletions: count().as("totalCompletions"),
			})
			.from(goalsCompletedInWeek)
			.groupBy(goalsCompletedInWeek.completionDate),
	);

	const [dailyChart] = await db
		.with(goalsCreatedUpToWeek, goalsCompletedInWeek, dailyGoalsChart)
		.select({
			completionDate: dailyGoalsChart.completionDate,
			
      completed: sql<number> /*sql*/`
      (SELECT COUNT(*) FROM ${goalsCompletedInWeek})::DECIMAL
    `.mapWith(Number),
    
			total: sql<number> /*sql*/`
      (SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})::DECIMAL
    `.mapWith(Number),
		})
		.from(dailyGoalsChart)
		.orderBy(asc(dailyGoalsChart.completionDate));

	console.log(dailyChart);

	return {
		dailyChart,
	};
}
