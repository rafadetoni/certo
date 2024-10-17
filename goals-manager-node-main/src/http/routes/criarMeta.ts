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

      const { meta } = await criarMeta({
        titulo,
        frequenciaSemanalDesejada,
      });

      return { metaId: meta.id };
    }
  );
};
