export interface LoginRequest {
    email: string;
    senha: string;
  }
  
  export async function login({ email, senha }: LoginRequest): Promise<string> { // Altera o retorno para string
    const response = await fetch('http://localhost:3333/login', {
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
      throw new Error('Erro ao fazer login!'); // Lança um erro se a resposta não for ok
    }
  
    const data = await response.json();
    console.log('Token recebido:', data.token);
    
    return data.token; // Retorna o token aqui
  }
  

  export function logout() {
    localStorage.removeItem('token'); // Remove o token armazenado no localStorage
  }
  