/* =============================================================================
   SEÇÃO DE PROJETO — o padrão repetível do Instituto
   -----------------------------------------------------------------------------
   Todo projeto do Instituto é renderizado por este componente, sempre na mesma
   ordem:

       nome e resumo  →  sobre + ficha  →  como funciona (opcional)
       →  história em destaque  →  fotos e vídeos  →  números
       →  como apoiar ESTE projeto

   Projeto novo = um bloco a mais no array `projetos` em content/instituto.ts.
   Nada aqui precisa mudar.

   O apoio fica DENTRO de cada projeto, e não numa seção única no fim da
   página: quem se interessou pela capoeira quer ajudar a capoeira, e mandar
   essa pessoa para um bloco genérico de doação perde o impulso.
   ============================================================================= */

import Image from "next/image";
import type { Projeto } from "@/content/instituto";
import { whatsappLink } from "@/content/site";
import { FotoPendente } from "./FotoPendente";
import { Numeros, Pendente, Rotulo } from "./ui";
import { RegistroMidia } from "./RegistroMidia";
import { Reveal } from "./Reveal";

export function SecaoProjeto({
  projeto,
  children,
}: {
  projeto: Projeto;
  /** Conteúdo extra do projeto (a jornada em capítulos, no Moradia Digna). */
  children?: React.ReactNode;
}) {
  const { destaque } = projeto;

  return (
    <section
      id={projeto.chave}
      aria-labelledby={`${projeto.chave}-titulo`}
      className="scroll-mt-24 border-t border-line py-20 md:py-28"
    >
      <div className="wrap">
        {/* --- Nome e resumo --- */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
            <Rotulo>Projeto</Rotulo>
          </div>
          <h3
            id={`${projeto.chave}-titulo`}
            className="t-display fs-hero mt-6 text-ink"
          >
            {projeto.nome}
          </h3>
          <p className="t-lead mt-5 max-w-[46ch] text-muted">
            {projeto.resumo}
          </p>
        </Reveal>

        {/* --- Sobre + ficha --- */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
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
      </div>

      {/* --- Como funciona (jornada, só onde existir) --- */}
      {children}

      <div className="wrap">
        {/* --- História em destaque --- */}
        {destaque && (
          <Reveal className="mt-20 md:mt-28">
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
        )}

        {/* --- Fotos e vídeos --- */}
        <Reveal className="mt-20 md:mt-28">
          <RegistroMidia itens={projeto.registro} titulo="Registro" />
        </Reveal>

        {/* --- Números --- */}
        {projeto.numeros && (
          <Reveal className="mt-20 md:mt-28">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h4 className="t-label text-accent-texto">
                {projeto.nome} em números
              </h4>
              <Pendente titulo="src/content/instituto.ts">
                Dados pendentes
              </Pendente>
            </div>
            <Numeros itens={projeto.numeros} className="mt-6" />
          </Reveal>
        )}

        {/* --- Como apoiar ESTE projeto --- */}
        <Reveal className="mt-20 md:mt-28">
          <h4 className="t-label text-accent-texto">
            Como apoiar o {projeto.nome}
          </h4>

          <ul className="mt-8 grid gap-px bg-line sm:grid-cols-2">
            {projeto.apoio.map((forma) => (
              <li key={forma.titulo} className="bg-surface p-6 sm:p-8">
                <h5 className="t-display-tight fs-card text-ink">
                  {forma.titulo}
                </h5>
                <p className="t-body mt-3 text-muted">{forma.texto}</p>

                {forma.pendencia && (
                  <p className="mt-4">
                    <Pendente titulo={forma.pendencia}>
                      {forma.pendencia}
                    </Pendente>
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
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
