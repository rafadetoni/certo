import { client, db } from '@/db'
import { metas } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { metasCompletas } from './schema/metasCompletas'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(metasCompletas)
  await db.delete(metas)

  const [meta1, meta2] = await db
    .insert(metas)
    .values([
      {
        titulo: faker.lorem.words(3),
        frequenciaSemanalDesejada: 1,
      },
      {
        titulo: faker.lorem.words(3),
        frequenciaSemanalDesejada: 2,
      },
      {
        titulo: faker.lorem.words(3),
        frequenciaSemanalDesejada: 1,
      },
    ])
    .returning()

  const inicioDaSemana = dayjs().startOf('week')

  await db.insert(metasCompletas).values([
    { meta_id: meta1.id, completadaEm: inicioDaSemana.toDate() },
    { meta_id: meta2.id, completadaEm: inicioDaSemana.add(1, 'day').toDate() },
  ])
}

seed().then(() => {
  console.log('Banco de dados populado com sucesso!!')
  client.end()
})
