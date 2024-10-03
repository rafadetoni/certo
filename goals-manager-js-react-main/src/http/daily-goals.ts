export interface GetDailyGoalsResponse {
    summary: {
      completed: number
      total: number
      goalsPerDay: Record<
        string,
        {
          id: string
          title: string
          createdAt: string
        }[]
      >
    }
  }
  
  export async function getSummary(): Promise<GetDailyGoalsResponse> {
    const response = await fetch('http://localhost:3333/daily-goals-chart')
    const data = await response.json()
  
    return data
  }
  