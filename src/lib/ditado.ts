"use client";

/* =============================================================================
   DITADO — falar em vez de digitar
   -----------------------------------------------------------------------------
   Usa a Web Speech API, que já vem no navegador: nada é instalado e nenhum
   servidor nosso entra no caminho.

   ⚠ O ÁUDIO NÃO FICA NO APARELHO. No Chrome, o reconhecimento acontece em
   servidor do Google, não no computador: o que se fala sai da máquina para ser
   transcrito. Quanto tempo esse áudio é guardado não está documentado de forma
   clara. Como aqui se dita observação sobre contrato, o aviso aparece NA TELA,
   ao lado do microfone — quem fala precisa saber para onde a voz vai.

   ONDE FUNCIONA. Chrome, Edge e Safari têm a API, com o prefixo `webkit` nos
   dois últimos. O FIREFOX NÃO TEM. Por isso `suportado` é conferido de
   verdade e o botão simplesmente não aparece onde a API não existe — em vez de
   aparecer e falhar no clique.

   PRECISA DE HTTPS. O navegador só libera o microfone em contexto seguro
   (https ou localhost). O site atende em https com redirecionamento do http,
   então funciona em produção.

   A API não está nos tipos padrão do DOM, daí as declarações mínimas abaixo:
   só o que esta tela usa, e não a interface inteira.
   ============================================================================= */

import { useCallback, useEffect, useRef, useState } from "react";

interface ResultadoFala {
  isFinal: boolean;
  0: { transcript: string };
}

interface EventoFala {
  resultIndex: number;
  results: { length: number; [i: number]: ResultadoFala };
}

interface Reconhecedor {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: EventoFala) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type ConstrutorReconhecedor = new () => Reconhecedor;

function construtor(): ConstrutorReconhecedor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstrutorReconhecedor;
    webkitSpeechRecognition?: ConstrutorReconhecedor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Mensagem de erro em português. Os códigos vêm da especificação. */
function recado(codigo: string): string {
  if (codigo === "not-allowed" || codigo === "service-not-allowed") {
    return "O navegador bloqueou o microfone. Libere o acesso e tente de novo.";
  }
  if (codigo === "no-speech") return "Não ouvi nada. Tente outra vez.";
  if (codigo === "audio-capture") return "Nenhum microfone encontrado.";
  if (codigo === "network") return "Sem conexão para transcrever a fala.";
  return "Não consegui transcrever agora.";
}

/**
 * @param aoTranscrever recebe cada trecho JÁ FECHADO pelo reconhecedor.
 *        Trecho provisório não é entregue: ele muda enquanto a pessoa fala, e
 *        escrever cada versão no campo faria o texto dançar na tela.
 */
export function useDitado(aoTranscrever: (texto: string) => void) {
  const [suportado, setSuportado] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const reconhecedor = useRef<Reconhecedor | null>(null);

  /* A API só existe no navegador; conferir no primeiro render daria resultado
     diferente do servidor e quebraria a hidratação. */
  useEffect(() => {
    setSuportado(construtor() !== null);
  }, []);

  /* O callback muda a cada render do componente de cima. Guardá-lo numa ref
     evita recriar o reconhecedor — e perder a escuta em curso — a cada
     letra digitada no campo. */
  const entrega = useRef(aoTranscrever);
  useEffect(() => {
    entrega.current = aoTranscrever;
  }, [aoTranscrever]);

  const parar = useCallback(() => {
    reconhecedor.current?.stop();
    reconhecedor.current = null;
    setOuvindo(false);
  }, []);

  const ouvir = useCallback(() => {
    const C = construtor();
    if (!C) return;
    setErro(null);

    const r = new C();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = true;

    r.onresult = (e) => {
      let fechado = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) fechado += res[0].transcript;
      }
      if (fechado) entrega.current(fechado);
    };
    r.onerror = (e) => {
      setErro(recado(e.error));
      setOuvindo(false);
      reconhecedor.current = null;
    };
    /* `onend` dispara também quando o navegador encerra sozinho, depois de um
       silêncio. Sem isto o botão ficaria vermelho para sempre. */
    r.onend = () => {
      setOuvindo(false);
      reconhecedor.current = null;
    };

    reconhecedor.current = r;
    setOuvindo(true);
    try {
      r.start();
    } catch {
      setErro(recado("outro"));
      setOuvindo(false);
      reconhecedor.current = null;
    }
  }, []);

  const alternar = useCallback(() => {
    if (ouvindo) parar();
    else ouvir();
  }, [ouvindo, ouvir, parar]);

  /* Sair da página ou fechar a cláusula com o microfone ligado deixaria a
     escuta correndo e o indicador do navegador aceso. */
  useEffect(() => () => reconhecedor.current?.stop(), []);

  return { suportado, ouvindo, erro, alternar };
}
