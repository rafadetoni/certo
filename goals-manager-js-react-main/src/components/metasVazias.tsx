import { Plus } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import imglogo from '../assets/DALL_E-2024-09-27-21.10-removebg-preview (1) (1).png'
import { Button } from './ui/button'
import LogoutButton from './logout'; 
export function MetasVazias() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <div className="absolute top-4 right-4"> 
        <LogoutButton /> {}
      </div>
      
      <img src={imglogo} alt="Goals-manager-logo" width={200} />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </main>
  )
}
