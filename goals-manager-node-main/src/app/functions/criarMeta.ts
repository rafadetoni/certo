import { db } from "@/db";
import { metas } from "@/db/schema";

interface criarMetaRequest {
  titulo: string;
  frequenciaSemanalDesejada: number;
  usuario_id: string
}

export async function criarMeta({
  titulo,
  frequenciaSemanalDesejada,
  usuario_id
}: criarMetaRequest) {
  const [meta] = await db
    .insert(metas)
    .values({
      titulo,
      frequenciaSemanalDesejada,
      usuario_id
    })
    .returning();

  return { meta };
}