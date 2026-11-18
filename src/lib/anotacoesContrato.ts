"use client";

/* =============================================================================
   ANOTAÇÕES DE CLÁUSULA — o que se quer mudar no contrato
   -----------------------------------------------------------------------------
   Cada cláusula do módulo de Contratos ganha um campo onde se escreve a
   alteração desejada. A anotação fica guardada e volta na próxima visita.

   ⚠ GUARDADO NO NAVEGADOR, E SÓ NELE.

   O que se escreve aqui não chega à Tridium, não aparece para mais ninguém e
   não acompanha a pessoa para outro computador. Trocou de máquina, usou o
   celular, limpou os dados do navegador ou abriu numa aba anônima: as
   anotações não estão lá. Quem precisa que o jurídico leia tem de exportar e
   mandar — por isso existe o botão de copiar tudo.

   Isso vale enquanto não houver login de verdade. Com sessão no servidor, as
   anotações passam a ser da PESSOA e não do aparelho, e o jurídico as lê sem
   ninguém copiar nada. Ver o cabeçalho de src/lib/sessaoCorretor.ts.

   Os três cuidados do localStorage valem aqui como nos favoritos: ele não
   existe no servidor (daí o `pronto`), pode lançar (daí o try/catch) e pode
   vir corrompido (daí a conferência de formato).
   ============================================================================= */

import { useCallback, useEffect, useState } from "react";

const CHAVE = "tridium:corretor:anotacoes-contrato";

/** Mapa de `aula/clausula` para o texto anotado. */
type Anotacoes = Record<string, string>;

function ler(): Anotacoes {
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return {};
    const dados: unknown = JSON.parse(cru);
    if (typeof dados !== "object" || dados === null || Array.isArray(dados)) {
      return {};
    }
    /* Só entra par de texto com texto: o que está guardado pode ter sido
       escrito por uma versão anterior, por outra aba ou à mão no console. */
    const limpo: Anotacoes = {};
    for (const [k, v] of Object.entries(dados as Record<string, unknown>)) {
      if (typeof v === "string") limpo[k] = v;
    }
    return limpo;
  } catch {
    return {};
  }
}

function gravar(dados: Anotacoes) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch {
    /* Aba anônima, armazenamento bloqueado ou cota cheia: a anotação vale
       enquanto a página não recarregar. Melhor do que travar o campo. */
  }
}

export function useAnotacoesContrato() {
  const [anotacoes, setAnotacoes] = useState<Anotacoes>({});
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setAnotacoes(ler());
    setPronto(true);
  }, []);

  const anotar = useCallback((id: string, texto: string) => {
    setAnotacoes((atuais) => {
      const novas = { ...atuais };
      /* Campo esvaziado some do mapa em vez de guardar string vazia: assim a
         contagem de "quantas cláusulas têm observação" não mente. */
      if (texto.trim() === "") delete novas[id];
      else novas[id] = texto;
      gravar(novas);
      return novas;
    });
  }, []);

  return { anotacoes, pronto, anotar };
}
