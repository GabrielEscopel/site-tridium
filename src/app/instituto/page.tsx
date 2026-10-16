import type { Metadata } from "next";
import Image from "next/image";

import { JornadaCapitulos } from "@/components/JornadaCapitulos";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Numeros, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { instituto } from "@/content/instituto";
import { contato, mensagensWhatsapp, whatsappLink } from "@/content/site";
import { metadadosRota, schemaInstituto, schemaMigalhas } from "@/lib/seo";

export const metadata: Metadata = metadadosRota({
  titulo: "Instituto Tridium — Projetos sociais em Florianópolis",
  descricao:
    "O braço social do Grupo Tridium em Florianópolis: moradia digna, capoeira, esporte, lazer, cultura e formação técnica em ofícios da construção. Doe, seja voluntário ou torne-se parceiro.",
  caminho: "/instituto",
  imagem: "/og/instituto.png",
});

export default function LarDignoPage() {
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
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Botao
                  href={whatsappLink(mensagensWhatsapp.instituto)}
                  externo
                  ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                >
                  Quero ajudar
                </Botao>
                <Botao href="#como-ajudar" variante="texto">
                  Ver as formas de apoio
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

      {/* ================= AVISO DE ESTRUTURAÇÃO ================= */}
      <section className="pt-14 md:pt-20">
        <div className="wrap">
          <div className="border border-dashed border-line-strong px-6 py-6 md:px-10 md:py-8">
            <p className="t-label text-accent-texto">Frente em estruturação</p>
            <p className="t-body mt-4 max-w-[70ch] text-muted">
              Estrutura pronta, conteúdo provisório. Histórias reais, fotografia
              do projeto, números de impacto auditados e os dados para doação
              ainda serão enviados. Números de impacto não devem ir ao ar
              estimados — em projeto social, número errado custa confiança.
            </p>
            <p className="mt-5 flex flex-wrap gap-3">
              <Pendente titulo="src/content/instituto.ts">Histórias reais</Pendente>
              <Pendente titulo="src/content/instituto.ts">Números de impacto</Pendente>
              <Pendente titulo="src/content/instituto.ts">Dados de doação e Pix</Pendente>
            </p>
          </div>
        </div>
      </section>

      {/* ================= MISSÃO ================= */}
      <section className="py-20 md:py-28">
        <div className="wrap">
          <Reveal>
            <p className="t-display-tight mx-auto max-w-[24ch] text-center fs-secao text-ink">
              {instituto.missao}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= JORNADA ================= */}
      <section
        className="border-t border-line bg-inset"
        aria-labelledby="jornada-titulo"
      >
        <div className="wrap py-16 md:py-20">
          <TituloSecao
            rotulo="A jornada"
            titulo={
              <span id="jornada-titulo">
                De uma casa
                <br />
                <span className="text-accent-texto">a um lar.</span>
              </span>
            }
            texto="Quatro etapas, na ordem em que acontecem. Nenhuma pode ser pulada."
          />
        </div>

        <div className="wrap pb-16 md:pb-20">
          <JornadaCapitulos capitulos={instituto.capitulos} />
        </div>
      </section>

      {/* ================= IMPACTO ================= */}
      <section className="py-20 md:py-28" aria-labelledby="impacto-titulo">
        <div className="wrap">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="impacto-titulo" className="t-label text-faint">
              Impacto até hoje
            </h2>
            <Pendente titulo="Números precisam ser auditados antes de publicar">
              Dados pendentes
            </Pendente>
          </div>
          <Reveal className="mt-10">
            <Numeros itens={instituto.impacto} />
          </Reveal>
        </div>
      </section>

      {/* ================= COMO AJUDAR ================= */}
      <section id="como-ajudar" className="bg-inset py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <TituloSecao
              rotulo="Como ajudar"
              titulo={
                <>
                  Existem quatro
                  <br />
                  <span className="text-accent-texto">formas de entrar.</span>
                </>
              }
              texto="Cada uma cabe num tempo diferente. Escolha a que cabe no seu."
            />
          </Reveal>

          <Reveal as="ul" className="mt-14 grid gap-px bg-line md:mt-20 md:grid-cols-2" stagger>
            {instituto.comoAjudar.map((forma) => (
              <li key={forma.chave} className="flex flex-col bg-surface p-8 md:p-12">
                <h3 className="t-display-tight fs-bloco text-ink">
                  {forma.titulo}
                </h3>
                <p className="t-label mt-3 text-accent-texto">{forma.resumo}</p>
                <p className="t-body mt-6 max-w-[44ch] flex-1 text-muted">
                  {forma.texto}
                </p>

                <p className="mt-6">
                  <Pendente titulo={forma.detalhe}>Detalhes pendentes</Pendente>
                </p>

                <div className="mt-8 border-t border-line pt-6">
                  <Botao
                    href={whatsappLink(
                      `Olá! Vim pelo site do Grupo Tridium e ${forma.acao.toLowerCase()} apoiar o projeto ${instituto.nome}.`
                    )}
                    externo
                    variante="contorno"
                    ariaLabel={`${forma.acao} — falar no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                  >
                    {forma.acao}
                  </Botao>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= TRANSPARÊNCIA ================= */}
      <section className="py-20 md:py-28">
        <div className="wrap">
          <Reveal className="border-t border-line pt-10">
            <h2 className="t-display-tight max-w-[16ch] fs-bloco text-ink">
              {instituto.transparencia.titulo}
            </h2>
            <p className="t-body mt-6 max-w-[62ch] text-muted">
              {instituto.transparencia.texto}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-inset py-20 md:py-28">
        <div className="wrap">
          <Reveal className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <Rotulo>Contato</Rotulo>
              <h2 className="t-display-tight mt-6 max-w-[18ch] fs-secao text-ink">
                {instituto.cta.titulo}
              </h2>
              <p className="t-lead mt-6 max-w-[46ch] text-muted">
                {instituto.cta.texto}
              </p>
            </div>
            <Botao
              href={whatsappLink(mensagensWhatsapp.instituto)}
              externo
              className="shrink-0"
              ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
            >
              WhatsApp {contato.whatsappExibicao}
            </Botao>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
