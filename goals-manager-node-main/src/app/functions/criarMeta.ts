import { db } from "@/db";
import { metas } from "@/db/schema";

interface criarMetaRequest {
  titulo: string;
  frequenciaSemanalDesejada: number;
}

export async function criarMeta({
  titulo,
  frequenciaSemanalDesejada,
}: criarMetaRequest) {
  const [meta] = await db
    .insert(metas)
    .values({
      titulo,
      frequenciaSemanalDesejada,
    })
    .returning();

  return { meta };
}
