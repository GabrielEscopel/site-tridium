"use client";

/* =============================================================================
   PORTAIS DAS TRÊS FRENTES — o elemento-assinatura do hub
   -----------------------------------------------------------------------------
   Três faixas empilhadas, na mesma ordem e proporção dos três galões do
   símbolo. A faixa ativa se expande e empurra as outras: a escolha do usuário
   reorganiza o grupo diante dele.

   Cada faixa é um <a> real. Foco por teclado dispara exatamente a mesma
   expansão do mouse — a interação não é exclusiva de quem usa ponteiro.
   ============================================================================= */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { frentes } from "@/content/site";
import { MarcaTridium } from "./MarcaTridium";

export function PortaisFrentes() {
  const [ativo, setAtivo] = useState<number | null>(null);

  return (
    <section aria-labelledby="portais-titulo" className="bg-void">
      <h2 id="portais-titulo" className="sr-only">
        As três frentes do Grupo Tridium
      </h2>

      <div
        className="flex flex-col lg:h-[100svh] lg:min-h-[38rem]"
        onMouseLeave={() => setAtivo(null)}
      >
        {frentes.map((frente, i) => {
          const estaAtivo = ativo === i;
          const outroAtivo = ativo !== null && !estaAtivo;

          return (
            <Link
              key={frente.id}
              href={frente.href}
              data-front={frente.id}
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              onBlur={() => setAtivo(null)}
              className="group relative flex min-h-[15rem] flex-1 items-end overflow-hidden border-t border-line-strong no-underline transition-[flex-grow] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-offset-[-3px] sm:min-h-[17rem] lg:min-h-0"
              style={{
                flexGrow: estaAtivo ? 2.1 : outroAtivo ? 0.62 : 1,
              }}
            >
              {/* Fotografia */}
              <Image
                src={frente.imagem}
                alt=""
                fill
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
              />

              {/* Véu: garante o contraste do texto sobre qualquer foto */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-void/72 transition-colors duration-500 group-hover:bg-void/58 group-focus-visible:bg-void/58"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-void via-void/45 to-transparent"
              />

              {/* Fio de acento na borda superior */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                style={{ backgroundColor: frente.accent }}
              />

              <div className="wrap relative w-full pb-8 pt-16 sm:pb-10 lg:pb-12">
                <div className="flex flex-col items-start gap-y-6 lg:flex-row lg:items-end lg:justify-between lg:gap-x-8">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      {/* O galão correspondente a esta frente no símbolo */}
                      <MarcaTridium
                        className="h-4 w-4 shrink-0"
                        titulo=""
                        galoes={[
                          i === 0 ? frente.accent : "transparent",
                          i === 1 ? frente.accent : "transparent",
                          i === 2 ? frente.accent : "transparent",
                        ]}
                        base="transparent"
                      />
                      {/* O nome vai em osso, não no acento: sobre fotografia o
                          acento não sustenta 4.5:1 em corpo pequeno. A cor da
                          frente aparece no galão, no fio e na borda — onde é
                          gráfica, e não texto. */}
                      <span className="t-label text-bone">{frente.nome}</span>
                      {frente.status === "em-estruturacao" && (
                        <span className="t-label text-bone/70">
                          · em estruturação
                        </span>
                      )}
                    </div>

                    <span className="t-display mt-4 block text-[clamp(2.75rem,1.4rem+6.4vw,7.5rem)] text-bone">
                      {frente.verbo}
                    </span>

                    <p
                      className="mt-4 max-w-[42ch] text-bone/85 transition-all duration-500 lg:max-w-[46ch] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                      style={{ fontSize: "clamp(0.9375rem,0.9rem+0.2vw,1.0625rem)", lineHeight: 1.6 }}
                    >
                      {frente.resumo}
                    </p>
                  </div>

                  <span className="t-label flex shrink-0 items-center gap-3 text-bone lg:pr-20">
                    Entrar
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
                    >
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
