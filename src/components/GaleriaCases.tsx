"use client";

/* =============================================================================
   GALERIA DE CASES — percurso horizontal
   -----------------------------------------------------------------------------
   Os projetos especiais da Tridium são objetos longos e horizontais: uma pista
   de skate, uma marquise, uma fileira de totens. A galeria adota a mesma
   direção — o portfólio se lê no eixo em que as obras existem.

   Desktop: a seção prende e o scroll vertical vira avanço horizontal (GSAP).
   Mobile e movimento reduzido: rolagem horizontal nativa com snap, sem pin.
   Nunca fica sem saída — as setas de teclado e o arraste funcionam nos dois.
   ============================================================================= */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefereMovimentoReduzido } from "@/lib/motion";
import { CarrosselFotos, type FotoCard } from "./CarrosselFotos";
import { Pendente } from "./ui";
import { FotoPendente } from "./FotoPendente";

export interface CaseItem {
  chave: string;
  nome: string;
  categoria: string;
  tipo: string;
  local: string;
  ano: string;
  resumo: string;
  descricao: string;
  escopo: readonly string[];
  /* As fotos da obra, na ordem em que ela aconteceu. A primeira abre o card.
     Três ou quatro funcionam bem; acima disso o contador do card vira ruído.
     Vazio enquanto não houver registro fotográfico real. */
  fotos: readonly FotoCard[];
  /* Foto da capa da página, quando a melhor para o card não é a melhor para
     a capa. A capa é panorâmica e corta muito; o card é 4:3 e mostra bem mais
     da foto. Sem `capa`, vale a primeira de `fotos`. */
  capa?: FotoCard;
  descricaoFoto?: string;
}

export function GaleriaCases({ cases }: { cases: readonly CaseItem[] }) {
  const secaoRef = useRef<HTMLDivElement>(null);
  const trilhoRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    const trilho = trilhoRef.current;
    if (!secao || !trilho) return;

    const mm = gsap.matchMedia();

    // O pin horizontal só entra onde há espaço e o usuário aceita movimento.
    mm.add(
      {
        podeAnimar: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
      },
      (contexto) => {
        if (!contexto.conditions?.podeAnimar) return;

        gsap.registerPlugin(ScrollTrigger);

        const distancia = () => trilho.scrollWidth - trilho.clientWidth;
        if (distancia() <= 0) return;

        const animacao = gsap.to(trilho, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: secao,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          animacao.scrollTrigger?.kill();
          animacao.kill();
          gsap.set(trilho, { x: 0 });
        };
      }
    );

    return () => mm.revert();
  }, []);

  const semPin = typeof window !== "undefined" && prefereMovimentoReduzido();

  return (
    /* No desktop a seção ocupa exatamente uma tela: enquanto está presa, o
       card inteiro — foto, nome, resumo e escopo — precisa caber no quadro.
       A foto é quem cede altura (flex-1), não o texto. */
    <div
      ref={secaoRef}
      className="overflow-hidden py-20 md:py-28 lg:flex lg:h-[100svh] lg:min-h-[42rem] lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="wrap shrink-0">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <span className="t-label text-accent-texto">Portfólio</span>
          </div>
          <p className="t-label text-faint">
            {cases.length} projetos · Florianópolis
          </p>
        </div>

        <h2 className="t-display-tight mt-5 max-w-[18ch] fs-secao text-ink">
          Obras que quase ninguém aceita executar.
        </h2>
      </div>

      <ul
        ref={trilhoRef}
        className={`mt-12 flex gap-5 px-[var(--gutter)] md:mt-16 md:gap-8 lg:mt-10 lg:min-h-0 lg:flex-1 lg:items-stretch ${
          semPin
            ? "snap-x snap-mandatory overflow-x-auto"
            : "snap-x snap-mandatory overflow-x-auto lg:overflow-visible"
        }`}
        style={{ scrollbarWidth: "thin" }}
      >
        {cases.map((item, i) => (
          <li
            key={item.chave}
            className="w-[85vw] max-w-[30rem] shrink-0 snap-start sm:w-[62vw] lg:w-[31rem] lg:max-w-none"
          >
            <article className="flex h-full flex-col">
              {/* Até três fotos por obra, folheadas pelas setas: dá para ver
                  a evolução sem sair da grade. Abre sempre na foto 1, a
                  mesma que a obra mostra na capa da página. */}
              <div className="relative aspect-[4/3] overflow-hidden bg-inset lg:aspect-auto lg:min-h-0 lg:flex-1">
                {item.fotos.length > 0 ? (
                  <CarrosselFotos
                    fotos={item.fotos}
                    prioridade={i === 0}
                    tamanhos="(max-width: 640px) 85vw, (max-width: 1024px) 62vw, 34rem"
                    className="h-full w-full"
                  />
                ) : (
                  <FotoPendente
                    className="absolute inset-0"
                    descricao={item.descricaoFoto ?? `Registro real de ${item.nome}`}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 z-10 h-1 w-16 bg-accent"
                />
              </div>

              <div className="flex shrink-0 flex-col border-t border-line pt-5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="t-label text-accent-texto">{item.categoria}</span>
                  <span className="t-label text-faint">{item.local}</span>
                </div>

                <h3 className="t-display-tight mt-4 fs-bloco text-ink">
                  {item.nome}
                </h3>

                <p className="t-body mt-4 max-w-[44ch] text-muted">
                  {item.resumo}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.escopo.map((e) => (
                    <li
                      key={e}
                      className="border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted"
                    >
                      {e}
                    </li>
                  ))}
                </ul>

                {item.ano.startsWith("[") && (
                  <p className="mt-5">
                    <Pendente titulo="Ano de execução a confirmar">
                      Ano pendente
                    </Pendente>
                  </p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
