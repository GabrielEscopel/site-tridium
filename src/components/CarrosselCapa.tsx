"use client";

/* =============================================================================
   CARROSSEL DE CAPA — a abertura das três frentes
   -----------------------------------------------------------------------------
   Um componente só, usado por engenharia, imóveis e instituto. O que muda
   entre as três é o que passa e o que está escrito por cima — nunca a
   estrutura. É a mesma regra que vale para o resto do site.

   A chamada fica PARADA sobre as fotos. Ela é o posicionamento da frente, não
   do slide: título que pisca a cada sete segundos cansa, e essa frase precisa
   estar legível no instante em que alguém chega.

   Quem está passando aparece na legenda embaixo, ao lado dos controles. Onde
   o slide tem destino próprio — a página do imóvel, a seção do projeto — a
   legenda é o link. Assim a foto não vira enfeite anônimo e nada se perde ao
   trocar o texto do slide por um texto fixo.

   A mecânica (pausa no hover e no foco, teclado, arrasto, movimento reduzido)
   vem de useCarrossel.
   ============================================================================= */

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCarrossel } from "@/lib/useCarrossel";
import { FotoPendente } from "./FotoPendente";

export interface SlideCapa {
  chave: string;
  /** null mostra o painel de foto pendente no lugar da imagem. */
  imagem: string | null;
  /** object-position, quando o enquadramento central corta o que importa. */
  posicao?: string;
  /** Foto de banco no lugar da real. Mostra o selo na legenda. */
  provisoria?: boolean;
  /** O que precisa ser fotografado, quando ainda não há foto. */
  descricaoPendente?: string;
  /** O nome de quem está passando. */
  titulo: string;
  /** Detalhe curto ao lado do nome: categoria, tipo, preço. */
  etiqueta?: string;
  /** Destino do slide. Sem ele, a legenda é só legenda. */
  href?: string;
  externo?: boolean;
  /** Rótulo do link. "Ver" quando não informado. */
  acao?: string;
}

export function CarrosselCapa({
  itens,
  rotulo,
  children,
}: {
  itens: readonly SlideCapa[];
  /** Nome do carrossel para leitores de tela. */
  rotulo: string;
  /** A chamada da frente: rótulo, título e botões. Fica fixa sobre as fotos. */
  children: ReactNode;
}) {
  const total = itens.length;
  const { atual, ir, propsRaiz } = useCarrossel(total);

  if (!total) return null;

  const slide = itens[atual];

  const legenda = (
    <>
      <span className="t-label shrink-0 text-accent-texto">
        {String(atual + 1).padStart(2, "0")}
      </span>

      <span className="text-sm text-white">{slide.titulo}</span>

      {slide.etiqueta && (
        <span className="t-label text-white/55">{slide.etiqueta}</span>
      )}

      {slide.provisoria && (
        <span className="t-label inline-flex items-center gap-2 border border-dashed border-white/55 px-2 py-0.5 text-white/65">
          ◇ Foto provisória
        </span>
      )}

      {slide.href && (
        <span className="t-label inline-flex items-center gap-2 text-accent-texto">
          {slide.acao ?? "Ver"}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover/legenda:translate-x-1"
          >
            →
          </span>
        </span>
      )}
    </>
  );

  const CLASSES_LEGENDA =
    "group/legenda flex flex-wrap items-center gap-x-4 gap-y-2 no-underline";

  /* `sobre-foto` inverte a paleta da frente dentro da capa: o fundo aqui é
     fotografia escurecida, e a tinta escura das frentes claras sumiria. */
  return (
    <section
      {...propsRaiz}
      aria-roledescription="carrossel"
      aria-label={rotulo}
      className="sobre-foto relative flex min-h-[86svh] flex-col justify-end overflow-hidden bg-inset pb-10 pt-32 md:min-h-[88svh] md:pb-12"
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
                  /* Não é 100vw porque a capa é alta e a foto é deitada: o
                     `object-cover` desenha a imagem bem mais larga que a tela
                     e mostra só a faixa do meio. Num celular de 390px, uma
                     foto 3:2 é desenhada com ~1090px de largura — pedir
                     100vw traria um arquivo de 390 e a capa ficaria mole.
                     Os multiplicadores caem conforme a tela alarga, porque aí
                     o corte lateral diminui. */
                  sizes="(max-width: 640px) 280vw, (max-width: 1024px) 175vw, 100vw"
                  style={{ objectPosition: item.posicao ?? "center" }}
                  className="object-cover"
                />
              ) : (
                <FotoPendente
                  descricao={item.descricaoPendente ?? `Registro real de ${item.titulo}`}
                  className="h-full w-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Véu + degradês. A escuridão fica concentrada ONDE O TEXTO ESTÁ, e
            não espalhada pela foto inteira: assim a imagem abre e a leitura
            não perde nada. Medido nas doze fotos de capa das três frentes —
            manda a mais clara.

            Não há véu parelho: ele escurecia a foto inteira para resolver um
            problema que só existe atrás do texto. O que restou:

            1. de baixo para cima, onde ficam o título e a legenda;
            2. da esquerda para a direita, atrás da coluna de texto. Só no
               desktop: no celular o texto ocupa a largura toda e um degradê
               lateral deixaria o fim das linhas sem apoio;
            3. uma faixa no topo, sob o menu. Sem ela, o menu claro cai em
               cima do céu de uma foto clara e some.

            No canto livre — direita, meia altura — a foto aparece sem véu
            nenhum: 2,9× mais clara do que na primeira versão. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.86] via-black/[0.42] to-transparent" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/[0.78] via-black/35 to-transparent md:block" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="blueprint pointer-events-none absolute inset-0 opacity-15" />
      </div>

      {/* ---------- chamada fixa ---------- */}
      <div className="wrap relative">{children}</div>

      {/* ---------- legenda e controles ---------- */}
      <div className="wrap relative mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 md:mt-16">
        {/* A região live anuncia a troca; o link fica dentro dela, não nela,
            para o leitor de tela não ler "link" a cada sete segundos. */}
        <div aria-live="polite" className="min-w-0">
          {slide.href ? (
            slide.externo ? (
              <a
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className={CLASSES_LEGENDA}
              >
                {legenda}
              </a>
            ) : (
              <Link href={slide.href} className={CLASSES_LEGENDA}>
                {legenda}
              </Link>
            )
          ) : (
            <p className={CLASSES_LEGENDA}>{legenda}</p>
          )}
        </div>

        {total > 1 && (
          <div className="flex items-center gap-5">
            <div className="flex gap-2">
              <Controle rotulo="Slide anterior" aoClicar={() => ir(atual - 1)}>
                ←
              </Controle>
              <Controle rotulo="Próximo slide" aoClicar={() => ir(atual + 1)}>
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
                      Ir para {i + 1}: {item.titulo}
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
