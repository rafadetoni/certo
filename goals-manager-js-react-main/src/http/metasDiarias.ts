export interface getMetasDiariasResponse {
  summary: {
    completadas: number
    total: number
    metasPorDia: Record<
      string,
      {
        id: string
        titulo: string
        criadaEm: string
      }[]
    >
  }
}

export async function getResumo(): Promise<getMetasDiariasResponse> {
  const response = await fetch('http://localhost:3333/daily-goals-chart')
  const data = await response.json()

  return data
}
