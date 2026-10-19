"use client";

/* =============================================================================
   CARROSSEL DE OBRAS — abertura da engenharia, em tela cheia
   -----------------------------------------------------------------------------
   Aqui o carrossel É a capa: ocupa a primeira dobra inteira e as obras passam
   atrás do título.

   A diferença em relação aos carrosséis do Instituto e dos Imóveis: ali cada
   slide traz o próprio texto e o próprio botão, porque cada slide leva a uma
   página diferente. Aqui o texto é um só — é a chamada da empresa, não da
   obra — e fica PARADO enquanto as fotos trocam. Título que pisca a cada sete
   segundos cansa, e a frase de posicionamento precisa ficar legível o tempo
   todo.

   Quem está passando aparece na legenda embaixo, ao lado dos controles: é o
   que impede a foto de virar enfeite anônimo.

   A mecânica (pausa, teclado, toque, movimento reduzido) vem de useCarrossel.
   ============================================================================= */

import type { ReactNode } from "react";
import Image from "next/image";
import type { CaseItem } from "./GaleriaCases";
import { useCarrossel } from "@/lib/useCarrossel";
import { FotoPendente } from "./FotoPendente";

export function CarrosselObras({
  itens,
  children,
}: {
  itens: readonly CaseItem[];
  /** A chamada da página: rótulo, título e botões. Fica fixa sobre as fotos. */
  children: ReactNode;
}) {
  const total = itens.length;
  const { atual, ir, propsRaiz } = useCarrossel(total);

  if (!total) return null;

  const obra = itens[atual];

  return (
    <section
      {...propsRaiz}
      aria-roledescription="carrossel"
      aria-label="Obras da Tridium"
      className="relative flex min-h-[86svh] flex-col justify-end overflow-hidden bg-inset pb-10 pt-32 md:min-h-[88svh] md:pb-12"
    >
      {/* ---------- fotos ---------- */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${atual * 100}%)` }}
        >
          {itens.map((item, i) => (
            <div key={item.chave} className="relative h-full w-full shrink-0">
              {item.imagem ? (
                <Image
                  src={item.imagem}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  style={{ objectPosition: item.imagemPosicao ?? "center" }}
                  className="object-cover"
                />
              ) : (
                <FotoPendente
                  descricao={item.descricaoFoto ?? `Registro real de ${item.nome}`}
                  className="h-full w-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Véu + degradês. São três camadas porque as quatro fotos são muito
            diferentes entre si — uma tem céu branco, outra é escura:
            1. véu parelho, para nivelar o que vier;
            2. de baixo para cima, onde fica o título;
            3. uma faixa no topo, sob o menu. Sem ela, o menu claro cai em
               cima do céu da foto do skatepark e some. */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/80 to-transparent" />
        <div className="blueprint pointer-events-none absolute inset-0 opacity-15" />
      </div>

      {/* ---------- chamada fixa ---------- */}
      <div className="wrap relative">{children}</div>

      {/* ---------- legenda e controles ---------- */}
      <div className="wrap relative mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 md:mt-16">
        <p aria-live="polite" className="t-label text-white/75">
          <span className="text-accent-texto">
            {String(atual + 1).padStart(2, "0")}
          </span>
          {" — "}
          {obra.nome}
          <span className="text-white/45"> · {obra.categoria}</span>{" "}
          {obra.imagemProvisoria && (
            <span className="ml-2 inline-flex items-center gap-2 border border-dashed border-white/60 px-2 py-0.5 text-white/70">
              ◇ Foto provisória
            </span>
          )}
        </p>

        {total > 1 && (
          <div className="flex items-center gap-5">
            <div className="flex gap-2">
              <Controle rotulo="Obra anterior" aoClicar={() => ir(atual - 1)}>
                ←
              </Controle>
              <Controle rotulo="Próxima obra" aoClicar={() => ir(atual + 1)}>
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
                      Ir para a obra {i + 1}: {item.nome}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function Controle({
  children,
  rotulo,
  aoClicar,
}: {
  children: ReactNode;
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
