export interface criarMetaRequest {
  titulo: string;
  frequenciaSemanalDesejada: number;
}

export async function criarMeta({
  titulo,
  frequenciaSemanalDesejada,
}: criarMetaRequest): Promise<void> {
  const token = localStorage.getItem('token'); 

  const response = await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
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
