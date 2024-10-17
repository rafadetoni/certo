export interface criarMetaRequest {
  titulo: string;
  frequenciaSemanalDesejada: number;
}

export async function criarMeta({
  titulo,
  frequenciaSemanalDesejada,
}: criarMetaRequest): Promise<void> {
  const response = await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      titulo,
      frequenciaSemanalDesejada,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar meta!');
  }
}
