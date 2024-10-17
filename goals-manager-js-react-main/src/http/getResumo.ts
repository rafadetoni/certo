export interface getResumoResponse {
  summary: {
    completas: number
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

export async function getResumo(): Promise<getResumoResponse> {
  const response = await fetch('http://localhost:3333/summary')
  const data = await response.json()

  return data
}
