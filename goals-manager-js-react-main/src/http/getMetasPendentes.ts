export interface getMetasPendentesResponse {
  metasPendentes: {
    id: string
    titulo: string
    frequenciaSemanalDesejada: number
    completasCount: number
  }[]
}

export async function getMetasPendentes(): Promise<getMetasPendentesResponse> {
  const response = await fetch('http://localhost:3333/pending-goals')
  const data = await response.json()

  return data
}
