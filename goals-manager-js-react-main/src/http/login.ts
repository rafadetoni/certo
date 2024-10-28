export interface LoginRequest {
    email: string;
    senha: string;
  }
  
  export async function login({ email, senha }: LoginRequest): Promise<string> { 
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
      throw new Error('Erro ao fazer login!'); 
    }
  
    const data = await response.json();    
    localStorage.setItem('token', data.token);
    return data.token;
  }
  

  export function logout() {
    localStorage.removeItem('token');
  }
  