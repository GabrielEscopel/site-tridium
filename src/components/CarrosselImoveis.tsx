"use client";

/* =============================================================================
   CARROSSEL DE IMÓVEIS EM DESTAQUE — abertura da página de imóveis
   -----------------------------------------------------------------------------
   Mesma pegada da abertura do Instituto: uma foto grande, pouco texto e uma
   ação. A diferença é o que passa — aqui são os imóveis que interessam hoje,
   marcados com `destaque: true` na carteira.

   Por que substituiu a foto fixa que havia antes: aquela imagem era decorativa
   e ocupava uma tela inteira sem dizer nada. Este espaço agora trabalha — a
   mesma altura leva a pessoa a um imóvel de verdade.

   A mecânica (pausa, teclado, toque, movimento reduzido) vem de useCarrossel.
   ============================================================================= */

import Image from "next/image";
import Link from "next/link";
import {
  formatarPreco,
  resumirImovel,
  type Imovel,
} from "@/content/imobiliaria";
import { useCarrossel } from "@/lib/useCarrossel";

export function CarrosselImoveis({ itens }: { itens: readonly Imovel[] }) {
  const total = itens.length;
  const { atual, ir, propsRaiz } = useCarrossel(total);

  if (!total) return null;

  return (
    <section
      {...propsRaiz}
      aria-roledescription="carrossel"
      aria-label="Imóveis em destaque"
      className="relative overflow-hidden bg-inset"
    >
      {/* --- trilho --- */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${atual * 100}%)` }}
      >
        {itens.map((imovel, i) => {
          const visivel = i === atual;
          const foto = imovel.fotos[0];

          return (
            <div
              key={imovel.chave}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}: ${imovel.tipo} no ${imovel.bairro}`}
              aria-hidden={!visivel}
              inert={!visivel}
              className="relative w-full shrink-0"
            >
              {/* fundo */}
              <div className="absolute inset-0">
                {foto && (
                  <Image
                    src={foto.src}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
                {/* No celular o texto fica embaixo; no desktop, à esquerda.
                    O degradê acompanha, senão a leitura cai sobre o claro. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent"
                />
                {foto?.provisoria && (
                  <span className="absolute right-[var(--gutter)] top-6 z-10 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                    ◇ Foto provisória
                  </span>
                )}
              </div>

              {/* texto — o pb grande abre espaço para os controles embaixo */}
              <div className="relative">
                <div className="wrap flex min-h-[21rem] flex-col justify-end pb-24 pt-14 md:min-h-[27rem] md:pb-28 md:pt-20">
                  <div className="max-w-[44ch]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="t-label bg-accent px-2.5 py-1 text-accent-ink">
                        {imovel.codigo}
                      </span>
                      <span className="t-label text-white/80">
                        {imovel.tipo} · {imovel.cidade}
                      </span>
                    </div>

                    <h3 className="t-display-tight fs-bloco mt-5 text-white">
                      {imovel.bairro}
                    </h3>

                    <p className="t-body mt-2 text-white/85">
                      {resumirImovel(imovel)}
                    </p>

                    <p className="t-display-tight fs-card mt-4 text-white">
                      {formatarPreco(imovel.preco)}
                    </p>

                    <Link
                      href={`/imobiliaria/${imovel.chave}`}
                      className="t-label mt-7 inline-flex items-center gap-3 bg-accent px-6 py-4 text-accent-ink no-underline transition-[filter] duration-200 hover:brightness-110"
                    >
                      Ver o imóvel
                      <span aria-hidden="true">→</span>
                    </Link>
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
              <Controle rotulo="Imóvel anterior" aoClicar={() => ir(atual - 1)}>
                ←
              </Controle>
              <Controle rotulo="Próximo imóvel" aoClicar={() => ir(atual + 1)}>
                →
              </Controle>
            </div>

            <ul className="flex items-center gap-2">
              {itens.map((imovel, i) => (
                <li key={imovel.chave}>
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
                      Ir para o imóvel {i + 1}: {imovel.tipo} no {imovel.bairro}
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
        Destaque {atual + 1} de {total}: {itens[atual].tipo} no{" "}
        {itens[atual].bairro}
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
