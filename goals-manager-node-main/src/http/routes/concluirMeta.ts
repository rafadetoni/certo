import { concluirMeta } from '@/app/functions/concluirMeta'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const rotaConcluirMeta: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          metaId: z.string(),
        }),
      },
    },
    async request => {
      const { metaId } = request.body

      const { metaCompleta } = await concluirMeta({
        metaId,
      })

      return { metaCompletaId: metaCompleta.id }
    }
  )
}
