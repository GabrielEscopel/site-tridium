/* =============================================================================
   CORPO DE PROJETO — o padrão repetível do Instituto
   -----------------------------------------------------------------------------
   Cada projeto tem a própria página, e todas são montadas por este componente,
   sempre na mesma ordem:

       o projeto  →  como funciona (opcional)  →  contemplados
       →  registro  →  números  →  como apoiar ESTE projeto

   Projeto novo = um bloco a mais no array `projetos` em content/instituto.ts.
   Nada aqui precisa mudar.

   Cada etapa é um <Bloco>: rótulo, fio e um respiro grande antes do próximo.
   Sem essa marcação a página virava um texto corrido em que não se via onde
   um assunto terminava e o outro começava.

   O apoio fica DENTRO de cada projeto, e não numa seção única no fim do site:
   quem se interessou pela capoeira quer ajudar a capoeira, e mandar essa
   pessoa para um bloco genérico de doação perde o impulso.
   ============================================================================= */

import type { ReactNode } from "react";
import Image from "next/image";
import type { Projeto } from "@/content/instituto";
import { whatsappLink } from "@/content/site";
import { FotoPendente } from "./FotoPendente";
import { Numeros, Pendente, Rotulo } from "./ui";
import { RegistroMidia } from "./RegistroMidia";
import { Reveal } from "./Reveal";

export function CorpoProjeto({
  projeto,
  children,
}: {
  projeto: Projeto;
  /** Conteúdo extra do projeto (a jornada em capítulos, no Moradia Digna). */
  children?: ReactNode;
}) {
  const { destaque } = projeto;

  return (
    <>
      {/* --- O projeto: texto e ficha --- */}
      <Bloco titulo="O projeto">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
          <Reveal className="max-w-[62ch] space-y-5">
            {projeto.sobre.map((paragrafo, i) => (
              <p key={i} className="t-body text-muted">
                {paragrafo}
              </p>
            ))}
          </Reveal>

          <Reveal as="dl" className="lg:w-72">
            {projeto.ficha.map((linha) => (
              <div
                key={linha.rotulo}
                className="flex flex-col gap-1 border-t border-line py-4"
              >
                <dt className="t-label text-faint">{linha.rotulo}</dt>
                <dd className="text-sm leading-snug text-ink">{linha.valor}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </Bloco>

      {/* --- A tradição em que o projeto se apoia (só onde existir) --- */}
      {projeto.contexto && (
        <Bloco titulo="A tradição">
          <Reveal>
            <h3 className="t-display-tight fs-secao max-w-[20ch] text-ink">
              {projeto.contexto.titulo}
            </h3>
            <div className="mt-8 max-w-[62ch] space-y-5">
              {projeto.contexto.texto.map((paragrafo, i) => (
                <p key={i} className="t-body text-muted">
                  {paragrafo}
                </p>
              ))}
            </div>
          </Reveal>

          {/* O vocabulário da tradição. Em lista, e não dentro do texto
              corrido: são palavras que a pessoa vai ouvir na roda, e vale que
              fiquem destacadas para serem reconhecidas depois. */}
          {projeto.contexto.termos && (
            <Reveal as="dl" className="mt-14 grid gap-px bg-line sm:grid-cols-2">
              {projeto.contexto.termos.map((t) => (
                <div key={t.termo} className="bg-surface p-6 sm:p-8">
                  <dt className="t-display-tight fs-card text-ink">{t.termo}</dt>
                  <dd className="t-body mt-3 text-muted">{t.significado}</dd>
                </div>
              ))}
            </Reveal>
          )}

          {projeto.contexto.fonte && (
            <Reveal className="mt-10">
              <a
                href={projeto.contexto.fonte.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label group inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-accent-texto"
              >
                {projeto.contexto.fonte.rotulo}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </Reveal>
          )}
        </Bloco>
      )}

      {/* --- Como funciona (jornada, só onde existir) --- */}
      {children}

      {/* --- Contemplados --- */}
      {destaque && (
        <Bloco titulo="Contemplados">
          <Reveal>
            <div className="grid gap-8 border border-line bg-raised p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
              <div className="relative">
                {destaque.midia.pendente ? (
                  <FotoPendente
                    descricao={destaque.midia.descricao}
                    className="aspect-[4/5] w-full"
                  />
                ) : (
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-inset">
                    <Image
                      src={destaque.midia.src!}
                      alt={destaque.midia.alt ?? destaque.midia.descricao}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      style={{ objectPosition: destaque.midia.posicao ?? "center" }}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <Rotulo>{destaque.papel}</Rotulo>
                <p className="t-display-tight fs-secao mt-4 text-ink">
                  {destaque.nome}
                </p>
                <p className="t-body mt-6 max-w-[52ch] text-muted">
                  {destaque.texto}
                </p>
              </div>
            </div>
          </Reveal>
        </Bloco>
      )}

      {/* --- Registro --- */}
      <Bloco titulo="Registro">
        <Reveal>
          <RegistroMidia itens={projeto.registro} />
        </Reveal>
      </Bloco>

      {/* --- Números --- */}
      {projeto.numeros && (
        <Bloco
          titulo="Em números"
          aside={
            <Pendente titulo="src/content/instituto.ts">
              Dados pendentes
            </Pendente>
          }
        >
          <Reveal>
            <Numeros itens={projeto.numeros} />
          </Reveal>
        </Bloco>
      )}

      {/* --- Como apoiar ESTE projeto --- */}
      <Bloco titulo={`Como apoiar ${projeto.artigo ?? "o"} ${projeto.nome}`}>
        <Reveal as="ul" className="grid gap-px bg-line sm:grid-cols-2">
          {projeto.apoio.map((forma) => (
            <li key={forma.titulo} className="bg-surface p-6 sm:p-8">
              <h3 className="t-display-tight fs-card text-ink">
                {forma.titulo}
              </h3>
              <p className="t-body mt-3 text-muted">{forma.texto}</p>

              {forma.pendencia && (
                <p className="mt-4">
                  <Pendente titulo={forma.pendencia}>{forma.pendencia}</Pendente>
                </p>
              )}

              <a
                href={whatsappLink(forma.mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label group mt-6 inline-flex items-center gap-3 text-ink transition-colors duration-200 hover:text-accent-texto"
              >
                {forma.acao}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </Bloco>
    </>
  );
}

/* Cada etapa do projeto, sempre com a mesma cara: fio, rótulo, conteúdo.
   É o que deixa ver, rolando, onde um assunto acaba e o outro começa. */
export function Bloco({
  titulo,
  aside,
  children,
  className = "",
}: {
  titulo: string;
  /** Canto direito do cabeçalho — hoje, o selo de pendência. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-line pt-8 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="t-label text-accent-texto">{titulo}</h2>
        {aside}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
