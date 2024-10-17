import { getResumoSemanal } from '@/app/functions/getResumoSemanal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const rotaGetResumoSemanal: FastifyPluginAsyncZod = async app => {
  app.get('/summary', {}, async () => {
    const { summary } = await getResumoSemanal()

    return { summary }
  })
}

