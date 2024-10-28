import { verificarToken } from '@/app/functions/loginECadastro';
import { getMetasSemanaisPendentes } from '@/app/functions/getMetasSemanaisPendentes';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const rotaGetMetasSemanaisPendentes: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', {}, async request => {
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

    const { metasPendentes } = await getMetasSemanaisPendentes(usuario_id);

    return { metasPendentes };
  });
};
