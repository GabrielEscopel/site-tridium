"use client";

/* =============================================================================
   ROLAGEM — topo e remedição a cada rota
   -----------------------------------------------------------------------------
   A rolagem é a NATIVA DO NAVEGADOR. Houve aqui uma camada de scroll suave
   (Lenis), tirada a pedido do cliente: a roda do mouse ficava lenta, e nem
   aumentar a distância por clique nem acelerar o assentamento resolveram. Numa
   escolha entre deslizar bonito e navegar rápido, navegar ganha.

   O que sobrou é o que de fato precisava existir:

   - voltar ao topo ao trocar de rota. O App Router preserva a posição entre
     navegações, e sem isto a pessoa chega no meio da página nova;
   - remedir o ScrollTrigger depois da troca. As seções presas — a galeria
     horizontal do portfólio e a jornada em capítulos do Instituto — calculam
     distâncias a partir da altura da página, que só é definitiva depois que o
     conteúdo novo montou.

   O ScrollTrigger funciona com rolagem nativa sem nenhuma ponte: era o Lenis
   que precisava ser costurado a ele, não o contrário.
   ============================================================================= */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function RolagemPorRota() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    /* `instant` de propósito. O CSS tem `scroll-behavior: smooth` no html,
       que serve aos links de âncora — "Ver o portfólio", "Ver a carteira" —
       e é bom que sirva. Mas numa troca de rota ele animaria a subida ao
       topo enquanto o conteúdo novo monta, e isso só atrapalha. */
    window.scrollTo({ top: 0, behavior: "instant" });

    /* A remedição espera o conteúdo novo montar. Sem a espera, o
       ScrollTrigger mede a página antiga e as seções presas erram o fim. */
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
