"use client";

/* =============================================================================
   METAS DO CORRETOR — o acompanhamento da semana
   -----------------------------------------------------------------------------
   Meta sem forma de conferir é desejo. Aqui o corretor marca o que fez, e a
   contagem se apaga sozinha quando a semana vira — senão o número de uma
   semana boa fica inflando o da seguinte.

   A SEMANA É A ISO: começa na segunda e termina no domingo, e a virada
   acontece na madrugada de domingo para segunda. É a semana que o mercado
   usa, e a que o corretor tem na cabeça quando diz "essa semana eu agenciei
   dois".

   ⚠ FICA NO NAVEGADOR DE QUEM MARCOU. O gestor não vê, e trocar de
   computador começa do zero. Para meta virar acompanhamento de equipe é
   preciso o mesmo banco de dados que o login de verdade pede — e aí a
   conferência deixa de ser honra pessoal e passa a cruzar com a carteira:
   dois agenciamentos marcados têm de ter dois imóveis novos com o nome
   dele.
   ============================================================================= */

import { useCallback, useEffect, useState } from "react";

const CHAVE = "tridium:corretor:metas";

/** "2026-W47". Semana ISO: segunda a domingo, e a semana 1 é a que contém
    a primeira quinta-feira do ano. */
export function semanaAtual(data = new Date()): string {
  const d = new Date(
    Date.UTC(data.getFullYear(), data.getMonth(), data.getDate())
  );
  /* Domingo é 0 em JavaScript e 7 na ISO; sem este ajuste, toda semana que
     começasse num domingo cairia na anterior. */
  const diaIso = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - diaIso); // vai para a quinta da semana
  const inicioDoAno = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(((d.getTime() - inicioDoAno.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(semana).padStart(2, "0")}`;
}

/** "17 a 23 de novembro" — o intervalo da semana corrente, para a tela. */
export function intervaloDaSemana(data = new Date()): string {
  const d = new Date(data);
  const diaIso = d.getDay() || 7;
  const segunda = new Date(d);
  segunda.setDate(d.getDate() - diaIso + 1);
  const domingo = new Date(segunda);
  domingo.setDate(segunda.getDate() + 6);

  const mes = (x: Date) =>
    x.toLocaleDateString("pt-BR", { month: "long" });

  return segunda.getMonth() === domingo.getMonth()
    ? `${segunda.getDate()} a ${domingo.getDate()} de ${mes(domingo)}`
    : `${segunda.getDate()} de ${mes(segunda)} a ${domingo.getDate()} de ${mes(domingo)}`;
}

/** { semana: { chaveDaMeta: quantidade } } */
type Registro = Record<string, Record<string, number>>;

function ler(): Registro {
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return {};
    const d: unknown = JSON.parse(cru);
    return typeof d === "object" && d !== null && !Array.isArray(d)
      ? (d as Registro)
      : {};
  } catch {
    return {};
  }
}

function gravar(r: Registro) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(r));
  } catch {
    /* Aba anônima ou cota cheia: vale enquanto a aba viver. */
  }
}

export function useMetasCorretor() {
  const [registro, setRegistro] = useState<Registro>({});
  const [pronto, setPronto] = useState(false);
  const semana = semanaAtual();

  useEffect(() => {
    /* Guarda só as oito últimas semanas. Sem isso o registro cresce para
       sempre, e o histórico antigo não serve para nada sem servidor. */
    const lido = ler();
    const semanas = Object.keys(lido).sort().slice(-8);
    const podado: Registro = {};
    for (const s of semanas) podado[s] = lido[s];
    setRegistro(podado);
    gravar(podado);
    setPronto(true);
  }, []);

  const feito = useCallback(
    (meta: string) => registro[semana]?.[meta] ?? 0,
    [registro, semana]
  );

  const marcar = useCallback(
    (meta: string, quantidade: number) => {
      setRegistro((atual) => {
        const daSemana = { ...(atual[semana] ?? {}) };
        if (quantidade <= 0) delete daSemana[meta];
        else daSemana[meta] = quantidade;
        const novo = { ...atual, [semana]: daSemana };
        gravar(novo);
        return novo;
      });
    },
    [semana]
  );

  return { pronto, feito, marcar, semana, intervalo: intervaloDaSemana() };
}
