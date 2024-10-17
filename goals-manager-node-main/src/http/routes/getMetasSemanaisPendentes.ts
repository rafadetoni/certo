import { getMetasSemanaisPendentes } from '@/app/functions/getMetasSemanaisPendentes'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const rotaGetMetasSemanaisPendentes: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', {}, async () => {
    const { metasPendentes } = await getMetasSemanaisPendentes()

    return { metasPendentes }
  })
}
