import { getResumoSemanal } from '@/app/functions/getResumoSemanal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { verificarToken } from '@/app/functions/loginECadastro';

export const rotaGetResumoSemanal: FastifyPluginAsyncZod = async app => {
  app.get('/summary', {}, async request => {
    const authorizationHeader = request.headers['authorization'];
    
    if (!authorizationHeader) {
      return { error: 'Token de autorização não fornecido.' };
    }

    const token = authorizationHeader.split(' ')[1];
    const decoded = verificarToken(token);

    if (!decoded || typeof decoded === 'string') {
      return { error: 'Token inválido.' };
    }

    const usuario_id = decoded.id; 

    const { summary } = await getResumoSemanal(usuario_id)

    return { summary }
  })
}



