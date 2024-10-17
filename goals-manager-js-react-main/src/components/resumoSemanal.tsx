import { CheckCircle2, Plus } from "lucide-react";
import newIcon from '../assets/Goal-Manager-Logo.png';
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import LogoutButton from './logout'; 
import type { getResumoResponse } from "../http/getResumo";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { MetasPendentes } from "./metasPendentes";
import { ChartNoAxesCombined } from 'lucide-react';
import { MetasDiarias } from "./metasDiarias"; 
import { useState } from 'react'; 

dayjs.locale(ptBR);

interface ResumoSemanalProps {
  summary: getResumoResponse["summary"];
}

export function ResumoSemanal({ summary }: ResumoSemanalProps) {
  const [showGraph, setShowGraph] = useState(false);
  const fromDate = dayjs().startOf("week").format("D[ de ]MMM");
  const toDate = dayjs().endOf("week").format("D[ de ]MMM");
  
  const porcentagemCompletada = Math.round(
    (summary.completas * 100) / summary.total,
  );

  const handleMostrarGrafico = () => {
    setShowGraph(!showGraph);
  };

  return (
    <main className="max-w-[640px] min-h-[900px] py-10 px-5 mx-auto flex flex-col gap-5 bg-slate-900 ring-2 ring-offset-2 ring-offset-blue-300 hover:ring-offset-blue-500">  
      <div className="pb-4">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img src={newIcon} alt="Descrição do Ícone" width={60} />  
            <span className="text-lg font-semibold">
              {fromDate} - {toDate}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DialogTrigger asChild className="w-[25%]">
              <Button size="default">
                <Plus className="size-4 hover:animate-spin rotate-90" />
                <span className="hidden md:inline">Cadastrar Meta</span>
              </Button>
            </DialogTrigger>

            <LogoutButton /> {/* Adiciona o botão de logout aqui */}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Progress value={summary.completas} max={summary.total}>
            <ProgressIndicator style={{ width: `${porcentagemCompletada}%` }} />
          </Progress>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Você completou{" "}
              <span className="text-zinc-100">{summary.completas}</span> de{" "}
              <span className="text-zinc-100">{summary.total}</span> metas nessa semana.
            </span>
            <span>{porcentagemCompletada}%</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <MetasPendentes />
      
      <div className="space-y-6 ">
        <div className="flex flex-row mx-auto justify-between">
          <h2 className="text-3xl font-medium">Sua semana</h2>

          <Button variant="secondary" onClick={handleMostrarGrafico} className="w-20 hover:bg-zinc-800 bg-slate-950 opacity-80">
            <ChartNoAxesCombined className="size-5" color="white" />
          </Button>
        </div>

        {showGraph && <MetasDiarias />}

        {!showGraph && summary.metasPorDia &&
          Object.entries(summary.metasPorDia).map(([date, metas]) => {
            const diaDaSemana = dayjs(date).format("dddd");
            const dataAnalisada = dayjs(date).format("D[ de ]MMM");

            return (
              <div className="space-y-4" key={date}>
                <h3 className="font-medium capitalize">
                  {diaDaSemana}{" "}
                  <span className="text-zinc-400 text-xs">({dataAnalisada})</span>
                </h3>

                <ul className="space-y-3">
                  {metas.map((meta) => {
                    const horaAnalisada = dayjs(meta.criadaEm).format("HH:mm[h]");

                    return (
                      <li className="flex items-center gap-2" key={meta.id}>
                        <CheckCircle2 className="size-4 text-green-500" />
                        <span className="text-base text-zinc-400">
                          Você completou "<span className="text-zinc-100">{meta.titulo}</span>"
                          às <span className="text-zinc-100">{horaAnalisada}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </div>
    </main>
  );
}
