import { z } from 'zod';
import { criarUsuario, loginUsuario } from '@/app/functions/authController';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const loginECadastroSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const rotaLoginECadastro: FastifyPluginAsyncZod = async (app) => {
  app.post('/cadastro', { schema: { body: loginECadastroSchema } }, async (request, reply) => {
    const { email, senha } = request.body;
    try {
      await criarUsuario({ email, senha });
      return reply.status(201).send({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
      return reply.status(500).send({ error: 'Erro ao criar o usuário!' });
    }
  });

app.post('/login', { schema: { body: loginECadastroSchema } }, async (request, reply) => {
  const { email, senha } = request.body;
  try {
    console.log('Tentativa de login com:', email, senha);
    const token = await loginUsuario({ email, senha});
    
    if (token) {
      console.log('Token gerado com sucesso:', token);
      return reply.status(200).send({ token });
    } else {
      console.error('Erro: Credenciais inválidas');
      return reply.status(401).send({ error: 'Senha incorreta!' });
    }
  } catch (error) {
    console.error('Erro no login:', error); // Adicionar log do erro
    return reply.status(500).send({ error: 'Erro ao fazer login!' });
  }
});
}
