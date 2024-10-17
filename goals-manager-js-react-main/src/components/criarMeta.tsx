import { X, Crosshair } from 'lucide-react';
import { Button } from './ui/button';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './ui/radio-group';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { criarMeta } from '../http/criarMeta';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const criarMetaSchema = z.object({
  titulo: z.string().min(1, 'Informe a atividade que deseja praticar'),
  frequenciaSemanalDesejada: z.coerce.number().min(1).max(7),
});

type criarMetaSchema = z.infer<typeof criarMetaSchema>;

export function CriarMeta() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<criarMetaSchema>({
    resolver: zodResolver(criarMetaSchema),
  });

  async function handleCriarMeta(data: criarMetaSchema) {
    try {
      await criarMeta({
        titulo: data.titulo,
        frequenciaSemanalDesejada: data.frequenciaSemanalDesejada,
      });
      
      reset();
      
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      
      toast.success('Meta criada com sucesso!');
    } catch {
      toast.error('Erro ao criar a meta, tente novamente!');
    }
  }

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>

            <DialogClose>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>

          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        <form
          onSubmit={handleSubmit(handleCriarMeta)}
          className="flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Qual a atividade?</Label>

              <Input
                id="titulo"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc..."
                {...register('titulo')}
              />

              {errors.titulo && (
                <p className="text-sm text-red-400">{errors.titulo.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="frequenciaSemanalDesejada">
                Quantas vezes na semana?
              </Label>

              <Controller
                control={control}
                name="frequenciaSemanalDesejada"
                defaultValue={5}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      value={String(field.value)}
                      onValueChange={field.onChange}
                    >
                      {Array.from({ length: 7 }).map((_, i) => {
                        const frequency = String(i + 1);

                        return (
                          <RadioGroupItem key={i} value={frequency}>
                            <RadioGroupIndicator />
                            <span className="text-zinc-300 text-sm font-medium leading-none">
                              {frequency}x na semana
                            </span>
                            <span className="text-lg leading-none">
                              <Crosshair color='#2311ac' strokeWidth='3' width={18} />
                            </span>
                          </RadioGroupItem>
                        );
                      })}
                    </RadioGroup>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <DialogClose asChild>
              <Button variant="secondary" className="flex-1">
                Fechar
              </Button>
            </DialogClose>

            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
