"use client";

/* =============================================================================
   SCROLL SUAVE — Lenis sincronizado ao ticker do GSAP
   -----------------------------------------------------------------------------
   Um único loop de animação para os dois: sem isso, Lenis e ScrollTrigger
   rodam em rAFs separados e o pin treme.
   Desliga por completo quando o usuário pede movimento reduzido.
   ============================================================================= */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefereMovimentoReduzido } from "@/lib/motion";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefereMovimentoReduzido()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (tempo: number) => lenis.raf(tempo * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Cada rota recalcula suas próprias medidas de scroll
  useEffect(() => {
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
