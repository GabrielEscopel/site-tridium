import type { Metadata } from "next";

import { CarrosselCapa } from "@/components/CarrosselCapa";
import { GaleriaCases } from "@/components/GaleriaCases";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Numeros, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { cases, engenharia } from "@/content/engenharia";
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
          O carrossel é a capa: ocupa a primeira dobra e as obras passam atrás
          da chamada. Quem procura construtora quer ver obra, e vê obra antes
          de ler qualquer coisa.

          As fotos saem do mesmo `cases` que alimenta o portfólio mais abaixo —
          nada para manter em paralelo. */}
      <CarrosselCapa
        rotulo="Obras da Tridium"
        /* A capa usa a foto 1 de cada obra — a mesma que abre o card dela no
           portfólio. As outras duas só existem lá, folheadas pelas setas. */
        itens={cases.map((obra) => ({
          chave: obra.chave,
          imagem: obra.fotos[0]?.src ?? null,
          posicao: obra.fotos[0]?.posicao,
          provisoria: obra.fotos[0]?.provisoria,
          descricaoPendente: obra.descricaoFoto,
          titulo: obra.nome,
          etiqueta: obra.categoria,
          href: "#portfolio",
          acao: "Ver no portfólio",
        }))}
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <Rotulo>{engenharia.hero.eyebrow}</Rotulo>
        </div>

        <h1 className="t-display mt-7 max-w-[16ch] fs-hero text-ink">
          {engenharia.hero.titulo.map((linha, i) => (
            <span key={linha} className={`block ${i === 1 ? "text-accent-texto" : ""}`}>
              {linha}
            </span>
          ))}
        </h1>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Botao
            href={whatsappLink(mensagensWhatsapp.orcamento)}
            externo
            ariaLabel={`Fazer orçamento no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
          >
            Fazer orçamento
          </Botao>
          {/* Sem cor própria: nesta frente o --ink já é claro, e duas classes
              de cor no mesmo elemento brigam pela ordem do CSS. */}
          <Botao href="#portfolio" variante="texto">
            Ver o portfólio
          </Botao>
        </div>
      </CarrosselCapa>

      {/* ================= POSICIONAMENTO =================
          A frase que estava no hero desceu para cá. Sobre a foto ela disputava
          espaço com o título; sozinha, numa faixa só dela, ela é lida. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="blueprint pointer-events-none absolute inset-0 opacity-30"
        />
        <div className="wrap relative">
          <p className="t-lead max-w-[62ch] py-14 text-muted md:py-20">
            {engenharia.hero.lead}
          </p>
        </div>
      </section>

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
        <GaleriaCases cases={cases} />
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
