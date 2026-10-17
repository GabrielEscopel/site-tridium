import type { Metadata } from "next";

import { CarrosselObras } from "@/components/CarrosselObras";
import { GaleriaCases } from "@/components/GaleriaCases";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Numeros, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { engenharia } from "@/content/engenharia";
import { contato, grupo, mensagensWhatsapp, whatsappLink } from "@/content/site";
import { metadadosRota, schemaEngenharia, schemaMigalhas } from "@/lib/seo";

export const metadata: Metadata = metadadosRota({
  titulo: "Tridium Engenharia — Construção, reforma e arquitetura em Florianópolis",
  descricao:
    "Engenharia, construção, arquitetura e reforma em Florianópolis (SC). Obra nova, reforma estrutural, projetos executivos e projetos especiais. Faça seu orçamento sem compromisso.",
  caminho: "/engenharia",
  imagem: "/og/engenharia.png",
});

export default function EngenhariaPage() {
  return (
    <div data-front="engenharia" className="bg-surface">
      <JsonLd
        dados={[
          schemaEngenharia,
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Engenharia", caminho: "/engenharia" },
          ]),
        ]}
      />

      {/* ================= HERO =================
          Abertura curta, de texto, igual à do Instituto e à dos Imóveis. A
          capa de tela inteira saiu: era uma foto de prancheta e compasso, que
          fala de escritório. Quem procura construtora quer ver obra — e obra
          é o que vem logo abaixo, no carrossel.

          A textura de blueprint fica, bem fraca: é o que distingue o registro
          da engenharia das outras duas frentes. */}
      <section className="relative overflow-hidden pt-24 md:pt-28">
        <div
          aria-hidden="true"
          className="blueprint pointer-events-none absolute inset-0 opacity-30"
        />

        <div className="wrap relative">
          <div className="py-10 md:py-14">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <Rotulo>{engenharia.hero.eyebrow}</Rotulo>
            </div>

            <h1 className="t-display mt-7 max-w-[16ch] fs-secao text-ink">
              {engenharia.hero.titulo.map((linha, i) => (
                <span key={linha} className={`block ${i === 1 ? "text-accent-texto" : ""}`}>
                  {linha}
                </span>
              ))}
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <p className="t-lead max-w-[52ch] text-muted">
                {engenharia.hero.lead}
              </p>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Botao
                  href={whatsappLink(mensagensWhatsapp.orcamento)}
                  externo
                  ariaLabel={`Fazer orçamento no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                >
                  Fazer orçamento
                </Botao>
                <Botao href="#portfolio" variante="texto">
                  Ver o portfólio
                </Botao>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OBRAS EM DESTAQUE =================
          As principais obras, uma por slide. Saem do mesmo `cases` que
          alimenta o portfólio logo abaixo — nada para manter em paralelo. */}
      <CarrosselObras itens={engenharia.cases} />

      {/* ================= SERVIÇOS ================= */}
      <section id="servicos" className="py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <TituloSecao
              rotulo="Serviços"
              titulo={
                <>
                  Quatro frentes de obra,
                  <br />
                  <span className="text-accent-texto">uma responsabilidade.</span>
                </>
              }
              texto={engenharia.posicionamento}
            />
          </Reveal>

          <Reveal className="mt-14 grid gap-px bg-line md:mt-20 md:grid-cols-2" stagger>
            {engenharia.servicos.map((servico) => (
              <article
                key={servico.chave}
                className="group bg-surface p-8 transition-colors duration-300 hover:bg-raised md:p-12"
              >
                <h3 className="t-display-tight fs-bloco text-ink">
                  {servico.titulo}
                </h3>
                <p className="t-label mt-3 text-accent-texto">{servico.resumo}</p>
                <p className="t-body mt-6 max-w-[46ch] text-muted">
                  {servico.descricao}
                </p>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {servico.itens.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted">
                      <span aria-hidden="true" className="text-accent-texto">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= PORTFÓLIO ================= */}
      <section id="portfolio" className="bg-inset" aria-labelledby="portfolio-titulo">
        <h2 id="portfolio-titulo" className="sr-only">
          Portfólio de obras
        </h2>
        <GaleriaCases cases={engenharia.cases} />
      </section>

      {/* ================= PROCESSO ================= */}
      <section className="py-20 md:py-32">
        <div className="wrap">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
            <Reveal>
              <TituloSecao
                rotulo="Como funciona"
                titulo={
                  <>
                    Da conversa
                    <br />
                    <span className="text-accent-texto">à chave.</span>
                  </>
                }
                texto="Cinco etapas, na ordem. A ordem importa: é ela que impede surpresa de orçamento no meio da obra."
              />
            </Reveal>

            {/* A numeração é legítima aqui — é uma sequência real e a ordem
                carrega informação que o cliente precisa. */}
            <Reveal as="ol" className="border-t border-line" stagger>
              {engenharia.processo.map((etapa) => (
                <li
                  key={etapa.passo}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-b border-line py-7 md:gap-x-10"
                >
                  <span className="t-label pt-1.5 text-accent-texto">{etapa.passo}</span>
                  <div>
                    <h3 className="t-display-tight text-[1.375rem] text-ink md:text-[1.625rem]">
                      {etapa.titulo}
                    </h3>
                    <p className="t-body mt-3 max-w-[52ch] text-muted">
                      {etapa.texto}
                    </p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= NÚMEROS ================= */}
      <section className="pb-20 md:pb-32" aria-labelledby="numeros-eng">
        <div className="wrap">
          <div className="border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="numeros-eng" className="t-label text-faint">
                A engenharia em números
              </h2>
              <Pendente titulo="Números reais a confirmar com o cliente antes de publicar">
                Dados pendentes
              </Pendente>
            </div>
            <Reveal className="mt-10">
              <Numeros itens={engenharia.numeros} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= CTA / CONTATO ================= */}
      <section id="contato" className="bg-inset py-20 md:py-32">
        <div className="wrap">
          <Reveal className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            <div>
              <Rotulo>Contato</Rotulo>
              <h2 className="t-display-tight mt-6 max-w-[14ch] fs-secao text-ink">
                {engenharia.cta.titulo}
              </h2>
              <p className="t-lead mt-8 max-w-[44ch] text-muted">
                {engenharia.cta.texto}
              </p>
            </div>

            <div className="flex flex-col justify-end gap-8">
              <dl className="space-y-6 border-t border-line pt-8">
                <div>
                  <dt className="t-label text-faint">WhatsApp</dt>
                  <dd className="mt-2">
                    <a
                      href={whatsappLink(mensagensWhatsapp.orcamento)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-display-tight text-[1.5rem] text-ink transition-colors duration-200 hover:text-accent-texto md:text-[2rem]"
                    >
                      {contato.whatsappExibicao}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="t-label text-faint">Instagram</dt>
                  <dd className="mt-2">
                    <a
                      href={contato.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink transition-colors duration-200 hover:text-accent-texto"
                    >
                      {contato.instagramHandle}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="t-label text-faint">Atendimento</dt>
                  <dd className="mt-2 text-muted">
                    {grupo.cidade} e Grande Florianópolis
                  </dd>
                </div>
              </dl>

              <Botao
                href={whatsappLink(mensagensWhatsapp.orcamento)}
                externo
                ariaLabel={`Fazer orçamento no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
              >
                {engenharia.cta.botao}
              </Botao>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
