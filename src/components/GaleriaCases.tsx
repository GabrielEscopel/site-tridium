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
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefereMovimentoReduzido } from "@/lib/motion";
import { CarrosselFotos, type FotoCard } from "./CarrosselFotos";
import { FotoPendente } from "./FotoPendente";

export interface CaseItem {
  chave: string;
  nome: string;
  categoria: string;
  tipo: string;
  local: string;
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
  /* Entra no carrossel de abertura da página. O portfólio mostra todas as
     obras; a capa mostra as escolhidas, senão vira uma fileira de pontinhos
     que ninguém consegue usar. */
  destaque?: boolean;
  descricaoFoto?: string;
  /* A obra que ganhou página própria. Sem isto, o case vive só no card —
     e é assim que deve ser enquanto não houver conteúdo real para uma
     página inteira. Página criada por obrigação de simetria vira texto de
     enchimento, e texto de enchimento prejudica as obras que têm o que
     mostrar. Ver `PaginaObra`, logo abaixo. */
  pagina?: PaginaObra;
}

/* -----------------------------------------------------------------------------
   PÁGINA DE OBRA
   -----------------------------------------------------------------------------
   A página de um case existe por dois motivos ao mesmo tempo, e o desenho
   atende aos dois:

     PARA QUEM JÁ CONHECE a Tridium e quer ver o que ela fez — a obra, a
     ficha, o registro fotográfico.
     PARA QUEM PROCURA NO BUSCADOR por "reforma em shopping center" e nunca
     ouviu falar da casa — o método, o que esse tipo de obra exige e as
     perguntas que todo administrador de shopping faz antes de contratar.

   Por isso `secoes` e `faq` convivem: as seções aprofundam o tema, e o FAQ
   é o que o buscador lê como resposta direta.

   ⚠ A LINHA QUE NÃO SE CRUZA: o que a página afirma sobre ESTA obra tem de
   estar confirmado pelo cliente. O que é método — como se trabalha num
   prédio em operação, o que a norma exige em altura — é verdadeiro em geral
   e se escreve como método, nunca como "foi exatamente assim que fizemos
   aqui". Misturar os dois é inventar currículo com o nome de um cliente
   real em cima.
   ----------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
   FRENTE DE OBRA
   -----------------------------------------------------------------------------
   Uma frente é um serviço inteiro dentro da mesma obra: a fachada, a praça de
   alimentação, os mesaninos. É o que torna a página ESCANEÁVEL — quem abre vê
   o que foi feito antes de ler uma linha, e é assim que ela precisa funcionar
   quando o link for mandado à administração de um shopping.

   FOTO OU PAINEL DE PENDENTE, nunca imagem de banco. Frente sem registro
   fotográfico mostra o painel dizendo QUAL foto falta — que serve ao leitor
   como aviso honesto e à casa como lista de produção.

   `antes` e `depois` existem porque o próprio descritivo do cliente pede: num
   retrofit, o par é o argumento. Quando houver os dois, eles substituem a
   foto única.
   ----------------------------------------------------------------------------- */

export interface FrenteDeObra {
  titulo: string;
  texto: string;
  /** Marco no tempo, quando a frente tiver um: "2019". */
  quando?: string;
  foto?: FotoCard;
  /** O que precisa ser fotografado, enquanto não houver foto. */
  fotoPendente?: string;
  antes?: FotoCard;
  depois?: FotoCard;
}

export interface PaginaObra {
  /** A abertura da página. Mais longa que o resumo do card, que é uma linha. */
  chamada: string;
  /** Os números que resumem a obra, em faixa, logo abaixo da descrição.
      É o que a administração de um shopping lê primeiro — e o que enche o
      espaço que sobrava ao lado de um texto curto. */
  numeros?: readonly { valor: string; rotulo: string }[];
  /** As frentes de trabalho, em grade visual. */
  frentes?: readonly FrenteDeObra[];
  /** Ficha técnica. Valor em `[A CONFIRMAR]` aparece como pendente, e não some. */
  ficha: readonly { rotulo: string; valor: string }[];
  /** O aprofundamento, na ordem de leitura. */
  secoes: readonly { titulo: string; texto?: string; itens?: readonly string[] }[];
  /** O que a casa faz neste tipo de obra. É a parte que responde "vocês
      fazem isso também?" sem obrigar a pessoa a voltar para a home. */
  servicos?: readonly { titulo: string; texto: string }[];
  /** O título dessa lista — "O que a Tridium faz em shopping center".
      É campo próprio porque deduzi-lo da categoria daria errado: toda obra
      de reforma herdaria o assunto da primeira que teve página. */
  tituloServicos?: string;
  /** As perguntas que o cliente faz antes de contratar. Viram também o
      schema FAQPage da página, que é o que o buscador mostra. */
  faq?: readonly { pergunta: string; resposta: string }[];
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

        {/* A chamada acompanha o que o portfólio virou. Já foi "obras que
            quase ninguém aceita executar", escrita para os projetos especiais
            de demonstração, e depois "obra feita no meio da cidade", quando
            sobraram quatro obras urbanas. Com catorze, o que elas provam
            juntas é alcance: tem parede ripada de uma sala e tem estrutura de
            concreto em curva. */}
        <h2 className="t-display-tight mt-5 max-w-[22ch] fs-secao text-ink">
          De uma parede a uma estrutura inteira.
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

                {/* O LINK FICA NO TÍTULO, E NÃO NO CARD INTEIRO.
                    O card tem um carrossel de fotos dentro, com setas
                    próprias: embrulhar tudo num <Link> engoliria os cliques
                    das setas e deixaria o visitante sem como folhear as
                    fotos. Título clicável mais a chamada embaixo dão o
                    mesmo alcance sem tirar nada.

                    Obra sem página continua como estava, em texto parado —
                    link que leva a lugar nenhum é pior que link nenhum. */}
                <h3 className="t-display-tight mt-4 fs-bloco text-ink">
                  {item.pagina ? (
                    <Link
                      href={`/engenharia/${item.chave}`}
                      className="group/link inline-flex items-start gap-3 text-ink no-underline transition-colors duration-200 hover:text-accent-texto"
                    >
                      {item.nome}
                      <span
                        aria-hidden="true"
                        className="mt-[0.15em] shrink-0 text-accent-texto transition-transform duration-300 ease-out group-hover/link:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  ) : (
                    item.nome
                  )}
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

              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
