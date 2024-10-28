export interface CadastroRequest {
    email: string;
    senha: string;
  }
  
  export async function cadastro({
    email,
    senha,
  }: CadastroRequest): Promise<void> {
    const response = await fetch('http://localhost:3333/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Erro ao fazer cadastro!');
    }
  
    const data = await response.json();
    localStorage.setItem('token', data.token);
  }
  