
import { Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMetasPendentes } from '../http/getMetasPendentes'
import { concluirMeta } from '../http/concluirMeta'

export function MetasPendentes() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getMetasPendentes,
  })

  if (isLoading || !data) {
    return null
  }

  async function handleConcluirMeta(metaId: string) {
    await concluirMeta({ metaId })

    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.metasPendentes.map(meta => {
        return (
          <OutlineButton
            key={meta.id}
            onClick={() => handleConcluirMeta(meta.id)}
            disabled={meta.completasCount >= meta.frequenciaSemanalDesejada}
          >
            <Plus className="size-4 text-zinc-600" />
            {meta.titulo}
          </OutlineButton>
        )
      })}
    </div>
  )
}
