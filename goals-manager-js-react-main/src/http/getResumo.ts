export interface getResumoResponse {
  summary: {
    completas: number;
    total: number;
    metasPorDia: Record<
      string,
      {
        id: string;
        titulo: string;
        criadaEm: string;
      }[]
    >;
  };
}

export async function getResumo(): Promise<getResumoResponse> {
  const token = localStorage.getItem('token'); 

  const response = await fetch('http://localhost:3333/summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter resumo!');
  }

  const data = await response.json();
  return data;
}