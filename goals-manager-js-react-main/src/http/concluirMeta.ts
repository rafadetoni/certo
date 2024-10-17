export interface concluirMetaRequest
 {
  metaId: string
}

export async function concluirMeta({
  metaId,
}: concluirMetaRequest): Promise<void> {
  const response = await fetch('http://localhost:3333/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      metaId,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao concluir meta!')
  }
}
