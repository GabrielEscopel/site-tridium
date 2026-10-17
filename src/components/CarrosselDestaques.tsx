"use client";

/* =============================================================================
   CARROSSEL DE DESTAQUES — abertura do Instituto
   -----------------------------------------------------------------------------
   Inspirado na abertura do Greenpeace: uma foto forte, uma frase e uma ação,
   trocando de slide.

   A mecânica — pausa no hover e no foco, teclado, arrasto, movimento reduzido
   — vive em useCarrossel, compartilhada com o carrossel de imóveis. Aqui ficou
   só a aparência.

   Cuidados que seguem sendo deste componente:
   - Setas e marcadores são botões de verdade, alcançáveis por Tab, e o slide
     visível é anunciado por uma região live.
   - Os slides fora de vista ficam com `inert`, senão o Tab entra em links
     invisíveis e o foco "desaparece" para quem navega por teclado.
   ============================================================================= */

import Image from "next/image";
import Link from "next/link";
import type { Destaque } from "@/content/instituto";
import { useCarrossel } from "@/lib/useCarrossel";
import { FotoPendente } from "./FotoPendente";
import { Rotulo } from "./ui";

export function CarrosselDestaques({ itens }: { itens: readonly Destaque[] }) {
  const total = itens.length;
  const { atual, ir, propsRaiz } = useCarrossel(total);

  if (!total) return null;

  return (
    <section
      {...propsRaiz}
      aria-roledescription="carrossel"
      aria-label="Destaques do Instituto"
      className="relative overflow-hidden bg-inset"
    >
      {/* --- trilho --- */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${atual * 100}%)` }}
      >
        {itens.map((item, i) => {
          const visivel = i === atual;
          return (
            <div
              key={item.chave}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${total}: ${item.eyebrow}`}
              aria-hidden={!visivel}
              inert={!visivel}
              className="relative w-full shrink-0"
            >
              {/* fundo */}
              <div className="absolute inset-0">
                {item.midia.pendente ? (
                  <FotoPendente
                    descricao={item.midia.descricao}
                    className="h-full w-full"
                  />
                ) : (
                  <Image
                    src={item.midia.src!}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    style={{ objectPosition: item.midia.posicao ?? "center" }}
                    className="object-cover"
                  />
                )}
                {item.midia.provisoria && (
                  <span className="absolute bottom-6 right-[var(--gutter)] z-10 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                    ◇ Foto provisória
                  </span>
                )}
                {!item.midia.pendente && (
                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 ${
                      item.textoEm === "direita"
                        ? "bg-gradient-to-l from-black/85 via-black/50 to-transparent"
                        : "bg-gradient-to-r from-black/85 via-black/50 to-transparent"
                    }`}
                  />
                )}
              </div>

              {/* texto */}
              <div className="relative">
                <div
                  className={`wrap flex min-h-[26rem] flex-col justify-end py-16 md:min-h-[34rem] md:py-24 ${
                    item.textoEm === "direita" ? "md:items-end md:text-left" : ""
                  }`}
                >
                  <div
                    className={`max-w-[46ch] ${
                      item.midia.pendente
                        ? "bg-surface/90 p-6 backdrop-blur-sm md:p-8"
                        : ""
                    }`}
                  >
                    <Rotulo>{item.eyebrow}</Rotulo>
                    <h3
                      className={`t-display-tight fs-secao mt-4 ${
                        item.midia.pendente ? "text-ink" : "text-white"
                      }`}
                    >
                      {item.titulo}
                    </h3>
                    <p
                      className={`t-body mt-4 ${
                        item.midia.pendente ? "text-muted" : "text-white/90"
                      }`}
                    >
                      {item.texto}
                    </p>

                    {item.acao.externo ? (
                      <a
                        href={item.acao.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="t-label mt-7 inline-flex items-center gap-3 bg-accent px-6 py-4 text-accent-ink transition-[filter] duration-200 hover:brightness-110"
                      >
                        {item.acao.rotulo}
                        <span aria-hidden="true">→</span>
                      </a>
                    ) : (
                      <Link
                        href={item.acao.href}
                        className="t-label mt-7 inline-flex items-center gap-3 bg-accent px-6 py-4 text-accent-ink transition-[filter] duration-200 hover:brightness-110"
                      >
                        {item.acao.rotulo}
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
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
              <Controle rotulo="Destaque anterior" aoClicar={() => ir(atual - 1)}>
                ←
              </Controle>
              <Controle rotulo="Próximo destaque" aoClicar={() => ir(atual + 1)}>
                →
              </Controle>
            </div>

            <ul className="flex items-center gap-2">
              {itens.map((item, i) => (
                <li key={item.chave}>
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
                      Ir para o destaque {i + 1}: {item.eyebrow}
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
        Destaque {atual + 1} de {total}: {itens[atual].eyebrow}
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
