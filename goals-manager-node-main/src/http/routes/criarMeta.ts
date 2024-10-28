import { verificarToken } from '@/app/functions/loginECadastro';
import { criarMeta } from '@/app/functions/criarMeta';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const rotaCriarMeta: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: z.object({
          titulo: z.string(),
          frequenciaSemanalDesejada: z.number().int().min(1).max(7),
        }),
      },
    },
    async request => {
      const { titulo, frequenciaSemanalDesejada } = request.body;
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

      const { meta } = await criarMeta({
        titulo,
        frequenciaSemanalDesejada,
        usuario_id,
      });

      return { metaId: meta.id };
    }
  );
};
