import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button'; 
import { Input } from './ui/input';
import { Label } from './ui/label'; 
import { login } from '../http/login'; // Supondo que a função de login esteja aqui

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, senha });
    try {
      const token = await login({ email, senha }); // Chama a função de login
      if (token) {
        localStorage.setItem('token', token); // Armazena o token no localStorage
        navigate('/'); // Redireciona para a página principal
      } else {
        setMensagem('Email ou senha incorretos.'); // Mensagem de erro se o login falhar
      }
    } catch (error) {
      setMensagem('Erro ao fazer login.'); // Mensagem de erro
      console.error(error); // Log do erro no console
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/cadastro'); // Redireciona para a página de cadastro
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-800">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:border-purple-600 focus:ring focus:ring-purple-300"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="senha">Senha:</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md focus:border-purple-600 focus:ring focus:ring-purple-300"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
            Entrar
          </Button>
        </form>
        {mensagem && <p className="text-center text-red-500">{mensagem}</p>} {/* Exibe a mensagem */}
        <div className="flex justify-center mt-4">
          <Button 
            type="button" 
            onClick={handleRegisterRedirect} 
            className="text-purple-700 underline"
          >
            Cadastre-se
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;


