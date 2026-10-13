"use client";

/* =============================================================================
   REVEAL — entrada de conteúdo por scroll
   -----------------------------------------------------------------------------
   Discreto de propósito: 24px e opacidade. O movimento marcante do site está
   reservado para o símbolo no hub e para os capítulos do Instituto; se cada
   bloco também dançasse, nenhum dos dois se destacaria.
   ============================================================================= */

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefereMovimentoReduzido } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Escalona os filhos diretos em vez de animar o bloco inteiro. */
  stagger?: boolean;
  atraso?: number;
  as?: ElementType;
}

export function Reveal({
  children,
  className,
  stagger = false,
  atraso = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefereMovimentoReduzido()) {
      gsap.set(stagger ? Array.from(el.children) : el, { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const alvos = stagger ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      gsap.set(alvos, { opacity: 0, y: 24 });
      gsap.to(alvos, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: atraso,
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, atraso]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
