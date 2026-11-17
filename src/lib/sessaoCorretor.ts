"use client";

/* =============================================================================
   SESSÃO DO CORRETOR — a tranca de papelão
   -----------------------------------------------------------------------------
   ⚠ ISTO NÃO É SEGURANÇA, E É PROPOSITAL QUE NÃO SEJA AINDA.

   A conferência acontece no navegador, com a senha escrita no código que o
   navegador baixa. Quem abrir as ferramentas de desenvolvedor lê a senha em
   segundos; quem digitar o endereço do painel direto chega nele antes de este
   código rodar. Serve para montar e testar o fluxo — a porta, a chave e o que
   tem do outro lado. Não serve para guardar nada.

   Enquanto for assim, NADA DE VALOR REAL entra no painel: sem dado de
   cliente, sem proposta, sem documento, sem comissão.

   O QUE FALTA PARA VIRAR SEGURANÇA DE VERDADE, nesta ordem:
     1. banco de dados com usuários e senha guardada em hash (bcrypt, argon2)
     2. rota de API que confere a senha NO SERVIDOR e devolve sessão assinada
     3. cookie httpOnly, que o JavaScript da página não consegue ler
     4. o painel renderizado no servidor, só depois de conferir a sessão lá
   O site roda em Node na Hostinger, então os quatro cabem. É outra etapa.

   `sessionStorage`, e não `localStorage`, de propósito: a sessão morre quando
   a aba fecha. Num computador compartilhado do escritório isso é o mínimo.
   ============================================================================= */

import { useCallback, useEffect, useState } from "react";
import { credencialTeste } from "@/content/corretor";

const CHAVE = "tridium:corretor:sessao";

export interface Sessao {
  usuario: string;
  desde: string;
}

function ler(): Sessao | null {
  try {
    const cru = window.sessionStorage.getItem(CHAVE);
    if (!cru) return null;
    const dados: unknown = JSON.parse(cru);
    if (
      typeof dados === "object" &&
      dados !== null &&
      typeof (dados as Sessao).usuario === "string"
    ) {
      return dados as Sessao;
    }
    return null;
  } catch {
    return null;
  }
}

export function useSessaoCorretor() {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  /* Enquanto `pronto` for false não se sabe se há sessão: o primeiro render
     acontece no servidor, onde `sessionStorage` não existe. Mostrar "entre"
     antes disso faria a tela piscar para quem já entrou. */
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setSessao(ler());
    setPronto(true);
  }, []);

  const entrar = useCallback((usuario: string, senha: string): boolean => {
    const ok =
      usuario.trim().toLowerCase() === credencialTeste.usuario &&
      senha === credencialTeste.senha;
    if (!ok) return false;

    const nova: Sessao = {
      usuario: usuario.trim().toLowerCase(),
      desde: new Date().toISOString(),
    };
    try {
      window.sessionStorage.setItem(CHAVE, JSON.stringify(nova));
    } catch {
      /* Aba anônima com armazenamento bloqueado: a sessão vale enquanto a
         página não recarregar. Melhor do que barrar a entrada. */
    }
    setSessao(nova);
    return true;
  }, []);

  const sair = useCallback(() => {
    try {
      window.sessionStorage.removeItem(CHAVE);
    } catch {
      /* Nada a fazer: o estado abaixo já tira a pessoa do painel. */
    }
    setSessao(null);
  }, []);

  return { sessao, pronto, entrar, sair };
}
