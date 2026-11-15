"use client";

/* =============================================================================
   FAVORITOS — a lista de quem está olhando
   -----------------------------------------------------------------------------
   Guarda no navegador da pessoa, sem cadastro e sem servidor: ela marca os
   imóveis que quer rever e eles continuam lá quando voltar. Nada disso chega
   à Tridium — é uma lista pessoal, não um lead.

   Três cuidados que o localStorage exige e que são fáceis de esquecer:

   1. ELE NÃO EXISTE NO SERVIDOR. A página é estática e o HTML sai pronto da
      build, onde `window` não existe. Por isso o primeiro render devolve
      sempre a lista vazia e só depois, já no navegador, o efeito carrega o
      que estava salvo. Ler direto no `useState` daria HTML diferente do que
      o React monta e quebraria a hidratação.

   2. ELE PODE LANÇAR. Em aba anônima, com dados de site bloqueados ou com a
      cota cheia, tanto a leitura quanto a escrita estouram. Tudo vai em
      try/catch, e falhar significa só perder a memória entre visitas — a
      página continua funcionando.

   3. ELE PODE VIR CORROMPIDO. O que está lá foi escrito por uma versão
      anterior do site, ou por outra aba, ou à mão pelo console. Só entra o
      que for mesmo um array de textos.

   `pronto` diz se o efeito já rodou. Sem ele, o contador piscaria "0" por um
   instante em toda visita de quem tem favoritos salvos.
   ============================================================================= */

import { useCallback, useEffect, useState } from "react";

const CHAVE = "tridium:imoveis:favoritos";

function ler(): string[] {
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return [];
    const dados: unknown = JSON.parse(cru);
    if (!Array.isArray(dados)) return [];
    return dados.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function gravar(chaves: string[]) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(chaves));
  } catch {
    /* Aba anônima, cota cheia ou site bloqueado. A lista vale para esta
       visita e não sobrevive a ela. Nada a fazer, nada a avisar. */
  }
}

export function useFavoritos() {
  const [chaves, setChaves] = useState<string[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setChaves(ler());
    setPronto(true);

    /* Duas abas abertas na carteira: favoritar numa atualiza a outra.
       `storage` só dispara em OUTRAS abas, nunca na que gravou. */
    const aoMudar = (e: StorageEvent) => {
      if (e.key === CHAVE) setChaves(ler());
    };
    window.addEventListener("storage", aoMudar);
    return () => window.removeEventListener("storage", aoMudar);
  }, []);

  const alternar = useCallback((chave: string) => {
    setChaves((atuais) => {
      const novas = atuais.includes(chave)
        ? atuais.filter((c) => c !== chave)
        : [...atuais, chave];
      gravar(novas);
      return novas;
    });
  }, []);

  const limpar = useCallback(() => {
    setChaves([]);
    gravar([]);
  }, []);

  return { chaves, pronto, alternar, limpar };
}
