"use client";

/* =============================================================================
   CARROSSEL DE OBRAS — abertura da engenharia
   -----------------------------------------------------------------------------
   Terceira aplicação do mesmo padrão: foto grande, pouco texto, uma ação.
   Instituto mostra projetos, Imóveis mostra imóveis, aqui são as obras.

   Substituiu a capa de tela inteira que havia antes — uma foto de prancheta
   que falava de escritório, não de obra. O portfólio completo continua logo
   abaixo, com o percurso horizontal; isto aqui é a vitrine.

   A mecânica (pausa, teclado, toque, movimento reduzido) vem de useCarrossel.
   ============================================================================= */

import Image from "next/image";
import type { CaseItem } from "./GaleriaCases";
import { useCarrossel } from "@/lib/useCarrossel";
import { FotoPendente } from "./FotoPendente";

export function CarrosselObras({ itens }: { itens: readonly CaseItem[] }) {
  const total = itens.length;
  const { atual, ir, propsRaiz } = useCarrossel(total);

  if (!total) return null;

  return (
    <section
      {...propsRaiz}
      aria-roledescription="carrossel"
      aria-label="Obras em destaque"
      className="relative overflow-hidden bg-inset"
    >
      {/* --- trilho --- */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${atual * 100}%)` }}
      >
        {itens.map((obra, i) => {
          const visivel = i === atual;

          return (
            <div
              key={obra.chave}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}: ${obra.nome}`}
              aria-hidden={!visivel}
              inert={!visivel}
              className="relative w-full shrink-0"
            >
              {/* fundo */}
              <div className="absolute inset-0">
                {obra.imagem ? (
                  <Image
                    src={obra.imagem}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    style={{ objectPosition: obra.imagemPosicao ?? "center" }}
                    className="object-cover"
                  />
                ) : (
                  <FotoPendente
                    descricao={obra.descricaoFoto ?? `Registro real de ${obra.nome}`}
                    className="h-full w-full"
                  />
                )}

                {obra.imagem && (
                  <>
                    {/* No celular o texto fica embaixo; no desktop, à
                        esquerda. O degradê acompanha. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent"
                    />
                    {obra.imagemProvisoria && (
                      <span className="absolute right-[var(--gutter)] top-6 z-10 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                        ◇ Foto provisória
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* texto — o pb grande abre espaço para os controles embaixo */}
              <div className="relative">
                <div className="wrap flex min-h-[21rem] flex-col justify-end pb-24 pt-14 md:min-h-[27rem] md:pb-28 md:pt-20">
                  <div
                    className={`max-w-[44ch] ${
                      obra.imagem ? "" : "bg-surface/90 p-6 backdrop-blur-sm md:p-8"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="t-label bg-accent px-2.5 py-1 text-accent-ink">
                        {obra.categoria}
                      </span>
                      <span
                        className={`t-label ${obra.imagem ? "text-white/80" : "text-faint"}`}
                      >
                        {obra.local}
                      </span>
                    </div>

                    <h3
                      className={`t-display-tight fs-bloco mt-5 ${
                        obra.imagem ? "text-white" : "text-ink"
                      }`}
                    >
                      {obra.nome}
                    </h3>

                    <p
                      className={`t-body mt-3 ${
                        obra.imagem ? "text-white/85" : "text-muted"
                      }`}
                    >
                      {obra.resumo}
                    </p>

                    <a
                      href="#portfolio"
                      className="t-label mt-7 inline-flex items-center gap-3 bg-accent px-6 py-4 text-accent-ink no-underline transition-[filter] duration-200 hover:brightness-110"
                    >
                      Ver no portfólio
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- controles --- */}
      {total > 1 && (
        <div className="wrap pointer-events-none absolute inset-x-0 bottom-6 md:bottom-8">
          <div className="pointer-events-auto flex items-center gap-5">
            <div className="flex gap-2">
              <Controle rotulo="Obra anterior" aoClicar={() => ir(atual - 1)}>
                ←
              </Controle>
              <Controle rotulo="Próxima obra" aoClicar={() => ir(atual + 1)}>
                →
              </Controle>
            </div>

            <ul className="flex items-center gap-2">
              {itens.map((obra, i) => (
                <li key={obra.chave}>
                  <button
                    type="button"
                    onClick={() => ir(i)}
                    aria-current={i === atual ? "true" : undefined}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === atual
                        ? "w-8 bg-accent"
                        : "w-1.5 bg-white/55 hover:bg-white/85"
                    }`}
                  >
                    <span className="sr-only">
                      Ir para a obra {i + 1}: {obra.nome}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Anuncia a troca para leitores de tela sem roubar o foco */}
      <p aria-live="polite" className="sr-only">
        Obra {atual + 1} de {total}: {itens[atual].nome}
      </p>
    </section>
  );
}

function Controle({
  children,
  rotulo,
  aoClicar,
}: {
  children: React.ReactNode;
  rotulo: string;
  aoClicar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className="grid h-11 w-11 place-items-center border border-white/35 bg-black/35 text-white transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink"
    >
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">{rotulo}</span>
    </button>
  );
}
