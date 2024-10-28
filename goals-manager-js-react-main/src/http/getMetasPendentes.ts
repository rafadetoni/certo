export interface getMetasPendentesResponse {
  metasPendentes: {
    id: string;
    titulo: string;
    frequenciaSemanalDesejada: number;
    completasCount: number;
  }[];
}

export async function getMetasPendentes(): Promise<getMetasPendentesResponse> {
  const token = localStorage.getItem('token'); 

  const response = await fetch('http://localhost:3333/pending-goals', {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter metas pendentes!');
  }

  const data: getMetasPendentesResponse = await response.json();
  return data;
}
