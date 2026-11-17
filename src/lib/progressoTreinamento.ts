"use client";

/* =============================================================================
   PROGRESSO DO TREINAMENTO
   -----------------------------------------------------------------------------
   Guarda quais aulas o corretor já concluiu, no navegador dele.

   ⚠ É PESSOAL E LOCAL. Nada disso chega à Tridium: o gestor não vê quem
   concluiu o quê, e trocar de computador começa do zero. Para o treinamento
   virar acompanhamento de equipe é preciso o mesmo banco de dados que o
   login de verdade pede — aí o progresso passa a ser do usuário, não do
   navegador.

   Os mesmos três cuidados do resto do site com `localStorage`: não existe no
   servidor (daí o `pronto`), pode lançar e pode vir corrompido.
   ============================================================================= */

import { useCallback, useEffect, useMemo, useState } from "react";
import { procedimentos } from "@/content/corretor";

const CHAVE = "tridium:corretor:treinamento";

function ler(): string[] {
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return [];
    const d: unknown = JSON.parse(cru);
    if (!Array.isArray(d)) return [];
    return d.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function gravar(chaves: string[]) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(chaves));
  } catch {
    /* Aba anônima ou cota cheia: vale para esta visita e não sobrevive. */
  }
}

export function useProgressoTreinamento() {
  const [concluidas, setConcluidas] = useState<string[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setConcluidas(ler());
    setPronto(true);
  }, []);

  const alternar = useCallback((chave: string) => {
    setConcluidas((atuais) => {
      const novas = atuais.includes(chave)
        ? atuais.filter((c) => c !== chave)
        : [...atuais, chave];
      gravar(novas);
      return novas;
    });
  }, []);

  const zerar = useCallback(() => {
    setConcluidas([]);
    gravar([]);
  }, []);

  /* A contagem ignora chave que não existe mais: aula removida do conteúdo
     não pode continuar contando como concluída e inflar o percentual. */
  const resumo = useMemo(() => {
    const validas = new Set<string>();
    const porModulo: Record<string, { feitas: number; total: number }> = {};

    for (const etapa of procedimentos) {
      let feitas = 0;
      for (const topico of etapa.topicos) {
        const id = `${etapa.chave}/${topico.chave}`;
        validas.add(id);
        if (concluidas.includes(id)) feitas += 1;
      }
      porModulo[etapa.chave] = { feitas, total: etapa.topicos.length };
    }

    const feitas = concluidas.filter((c) => validas.has(c)).length;
    const total = validas.size;

    return {
      feitas,
      total,
      percentual: total === 0 ? 0 : Math.round((feitas / total) * 100),
      porModulo,
    };
  }, [concluidas]);

  const concluida = useCallback(
    (etapa: string, topico: string) =>
      concluidas.includes(`${etapa}/${topico}`),
    [concluidas]
  );

  return { pronto, concluida, alternar, zerar, resumo };
}
