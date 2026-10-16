import type { Metadata } from "next";
import Image from "next/image";

import { JornadaCapitulos } from "@/components/JornadaCapitulos";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SecaoProjeto } from "@/components/SecaoProjeto";
import { Botao, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { instituto, projetos } from "@/content/instituto";
import { contato, mensagensWhatsapp, whatsappLink } from "@/content/site";
import { metadadosRota, schemaInstituto, schemaMigalhas } from "@/lib/seo";

export const metadata: Metadata = metadadosRota({
  titulo: "Instituto Tridium — Projetos sociais em Florianópolis",
  descricao:
    "O braço social do Grupo Tridium em Florianópolis: moradia digna, capoeira, esporte, lazer, cultura e formação técnica em ofícios da construção. Doe, seja voluntário ou torne-se parceiro.",
  caminho: "/instituto",
  imagem: "/og/instituto.png",
});

export default function InstitutoPage() {
  return (
    <div data-front="instituto" className="bg-surface">
      <JsonLd
        dados={[
          schemaInstituto,
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Instituto", caminho: "/instituto" },
          ]),
        ]}
      />

      {/* ================= HERO =================
          O registro mais claro e quente das três frentes. A foto vem depois do
          texto de propósito: a missão fala primeiro, a imagem confirma. */}
      <section className="pt-24 md:pt-28">
        <div className="wrap">
          <div className="py-12 md:py-20">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <Rotulo>{instituto.hero.eyebrow}</Rotulo>
            </div>

            <h1 className="t-display mt-8 max-w-[14ch] fs-hero text-ink">
              {instituto.hero.titulo.map((linha, i) => (
                <span
                  key={linha}
                  className={`block ${i === 2 ? "text-accent-texto" : ""}`}
                >
                  {linha}
                </span>
              ))}
            </h1>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
              <p className="t-lead max-w-[52ch] text-muted">
                {instituto.hero.lead}
              </p>
              <div>
                <Botao
                  href={whatsappLink(mensagensWhatsapp.instituto)}
                  externo
                  ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                >
                  Quero ajudar
                </Botao>
              </div>
            </div>
          </div>
        </div>

        <figure className="relative mt-4 aspect-[16/9] w-full overflow-hidden bg-inset md:aspect-[21/9]">
          <Image
            src={instituto.hero.imagem}
            alt={instituto.hero.imagemAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {instituto.hero.imagemProvisoria && (
            <figcaption className="absolute bottom-4 left-[var(--gutter)]">
              <span className="inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/55 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                ◇ Foto provisória
              </span>
            </figcaption>
          )}
        </figure>
      </section>

      {/* ================= MISSÃO ================= */}
      <section className="py-20 md:py-28">
        <div className="wrap-narrow">
          <Reveal>
            <p className="t-display-tight fs-secao mx-auto max-w-[24ch] text-center text-ink">
              {instituto.missao}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= ÍNDICE DOS PROJETOS =================
          Com dois projetos já ajuda; com cinco, é o que torna a página
          navegável. Cada item leva à âncora da sua seção. */}
      <section className="pb-4">
        <div className="wrap">
          <Reveal>
            <TituloSecao
              rotulo={instituto.projetosIntro.rotulo}
              titulo={instituto.projetosIntro.titulo}
              texto={instituto.projetosIntro.texto}
            />
          </Reveal>

          <Reveal as="ul" stagger className="mt-12 grid gap-px bg-line sm:grid-cols-2">
            {projetos.map((projeto) => (
              <li key={projeto.chave} className="bg-surface">
                <a
                  href={`#${projeto.chave}`}
                  className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors duration-200 hover:bg-raised sm:p-8"
                >
                  <div>
                    <h3 className="t-display-tight fs-bloco text-ink">
                      {projeto.nome}
                    </h3>
                    <p className="t-body mt-3 max-w-[38ch] text-muted">
                      {projeto.resumo}
                    </p>
                  </div>
                  <span className="t-label inline-flex items-center gap-3 text-accent-texto">
                    Ver o projeto
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      ↓
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= PROJETOS =================
          Um bloco por projeto, todos pelo mesmo componente. Adicionar um
          projeto novo é acrescentar um item em content/instituto.ts. */}
      {projetos.map((projeto) => (
        <SecaoProjeto key={projeto.chave} projeto={projeto}>
          {projeto.temJornada && (
            <div className="mt-16 md:mt-24">
              <div className="wrap">
                <Reveal>
                  <TituloSecao
                    rotulo={instituto.jornada.rotulo}
                    titulo={instituto.jornada.titulo}
                    texto={instituto.jornada.texto}
                  />
                </Reveal>
              </div>
              <JornadaCapitulos capitulos={instituto.capitulos} />
            </div>
          )}
        </SecaoProjeto>
      ))}

      {/* ================= TRANSPARÊNCIA ================= */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="wrap-narrow">
          <Reveal>
            <h2 className="t-display-tight fs-bloco text-ink">
              {instituto.transparencia.titulo}
            </h2>
            <p className="t-body mt-5 max-w-[60ch] text-muted">
              {instituto.transparencia.texto}
            </p>
            <p className="mt-6">
              <Pendente titulo="src/content/instituto.ts">
                Relatório e CNPJ pendentes
              </Pendente>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section data-invert="true" className="bg-surface py-20 md:py-28">
        <div className="wrap">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <Rotulo>Apoiar</Rotulo>
            </div>
            <h2 className="t-display-tight fs-secao mt-6 max-w-[18ch] text-ink">
              {instituto.cta.titulo}
            </h2>
            <p className="t-lead mt-6 max-w-[52ch] text-muted">
              {instituto.cta.texto}
            </p>
            <div className="mt-10">
              <Botao
                href={whatsappLink(mensagensWhatsapp.instituto)}
                externo
                ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
              >
                {instituto.cta.botao}
              </Botao>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
