"use client";

/* =============================================================================
   CARROSSEL — comportamento compartilhado
   -----------------------------------------------------------------------------
   A mecânica é a mesma no Instituto e nos Imóveis; só a aparência muda. Estava
   escrita duas vezes, e um conserto de acessibilidade num lado não chegaria ao
   outro. Agora mora aqui.

   O que este gancho garante, e que um carrossel costuma errar:
   - o avanço automático para no hover, no foco do teclado e com a aba oculta.
     Texto que some enquanto a pessoa lê é o defeito clássico do padrão;
   - com `prefers-reduced-motion`, não avança sozinho em momento nenhum;
   - as setas ← → do teclado funcionam quando o carrossel tem foco;
   - o arrasto no toque não bloqueia a rolagem vertical da página.

   Quem usa continua responsável pelo resto: setas e marcadores como botões de
   verdade, `inert` nos slides fora de vista e uma região live anunciando a
   troca.
   ============================================================================= */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { prefereMovimentoReduzido } from "./motion";

const INTERVALO = 7000;

export function useCarrossel(total: number, intervalo = INTERVALO) {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const raizRef = useRef<HTMLElement>(null);
  const toqueX = useRef<number | null>(null);

  const ir = useCallback(
    (i: number) => setAtual(((i % total) + total) % total),
    [total]
  );

  /* --- avanço automático --- */
  useEffect(() => {
    if (total <= 1 || pausado || prefereMovimentoReduzido()) return;

    const id = window.setInterval(() => {
      if (!document.hidden) setAtual((i) => (i + 1) % total);
    }, intervalo);

    return () => window.clearInterval(id);
  }, [total, pausado, intervalo]);

  /* --- setas do teclado quando o carrossel tem foco --- */
  useEffect(() => {
    const el = raizRef.current;
    if (!el) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        ir(atual - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        ir(atual + 1);
      }
    };

    el.addEventListener("keydown", aoTeclar);
    return () => el.removeEventListener("keydown", aoTeclar);
  }, [atual, ir]);

  /* Pausa e arrasto. Espalhar no elemento raiz do carrossel. */
  const propsRaiz = {
    ref: raizRef,
    onMouseEnter: () => setPausado(true),
    onMouseLeave: () => setPausado(false),
    onFocusCapture: () => setPausado(true),
    onBlurCapture: () => setPausado(false),
    onTouchStart: (e: TouchEvent) => {
      toqueX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: TouchEvent) => {
      if (toqueX.current === null) return;
      const dx = e.changedTouches[0].clientX - toqueX.current;
      if (Math.abs(dx) > 50) ir(atual + (dx < 0 ? 1 : -1));
      toqueX.current = null;
    },
  };

  return { atual, ir, propsRaiz };
}
