import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { rotaCriarMeta } from './routes/criarMeta'
import { rotaConcluirMeta } from './routes/concluirMeta'
import { rotaGetResumoSemanal } from './routes/getResumoSemanal'
import { rotaGetMetasSemanaisPendentes } from './routes/getMetasSemanaisPendentes'
import { rotaGetGraficoMetasDiarias } from './routes/getMetasDiarias'
import { rotaLoginECadastro } from './routes/loginECadastro';

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(rotaLoginECadastro);
app.register(rotaCriarMeta)
app.register(rotaConcluirMeta)
app.register(rotaGetResumoSemanal)
app.register(rotaGetMetasSemanaisPendentes)
app.register(rotaGetGraficoMetasDiarias)

app.listen({ port: 3333 }).then(() => {
  console.log('Servidor HTTP rodando!')
})


