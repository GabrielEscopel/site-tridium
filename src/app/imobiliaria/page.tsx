import type { Metadata } from "next";

import { CarrosselImoveis } from "@/components/CarrosselImoveis";
import { JsonLd } from "@/components/JsonLd";
import { ListaImoveis } from "@/components/ListaImoveis";
import { Reveal } from "@/components/Reveal";
import { Botao, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { imobiliaria, imoveis, imoveisDestaque } from "@/content/imobiliaria";
import { contato, mensagensWhatsapp, whatsappLink } from "@/content/site";
import { metadadosRota, schemaImobiliaria, schemaMigalhas } from "@/lib/seo";

export const metadata: Metadata = metadadosRota({
  titulo: "Tridium Imóveis — Imóveis em Florianópolis avaliados por engenheiros",
  descricao:
    "Imóveis e empreendimentos em Florianópolis com laudo técnico da engenharia do Grupo Tridium antes do anúncio. Compra, venda e regularização com um só interlocutor.",
  caminho: "/imobiliaria",
  imagem: "/og/imobiliaria.png",
});

export default function ImobiliariaPage() {

  return (
    <div data-front="imobiliaria" className="bg-surface">
      <JsonLd
        dados={[
          schemaImobiliaria,
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Imóveis", caminho: "/imobiliaria" },
          ]),
        ]}
      />

      {/* ================= HERO =================
          Abertura curta, de texto, como a do Instituto. A foto decorativa de
          antes ocupava uma tela inteira e não levava a lugar nenhum; o espaço
          passou para o carrossel logo abaixo, que mostra imóveis de verdade. */}
      <section className="pt-24 md:pt-28">
        <div className="wrap">
          <div className="py-10 md:py-14">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <Rotulo>{imobiliaria.hero.eyebrow}</Rotulo>
            </div>

            <h1 className="t-display mt-7 max-w-[16ch] fs-secao text-ink">
              {imobiliaria.hero.titulo.map((linha, i) => (
                <span
                  key={linha}
                  className={`block ${i === 1 ? "text-accent-texto" : ""}`}
                >
                  {linha}
                </span>
              ))}
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <p className="t-lead max-w-[52ch] text-muted">
                {imobiliaria.hero.lead}
              </p>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Botao
                  href={whatsappLink(mensagensWhatsapp.imobiliaria)}
                  externo
                  ariaLabel={`Falar com a imobiliária no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                >
                  Agendar visita
                </Botao>
                <Botao href="#carteira" variante="texto">
                  Ver a carteira
                </Botao>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DESTAQUES =================
          O que interessa hoje, um imóvel por slide. Sai da própria carteira:
          `destaque: true` no imóvel e ele aparece aqui. */}
      <CarrosselImoveis itens={imoveisDestaque} />

      {/* ================= AVISO DE ESTRUTURAÇÃO ================= */}
      <section className="pb-4">
        <div className="wrap">
          <div className="border border-dashed border-line-strong px-6 py-6 md:px-10 md:py-8">
            <p className="t-label text-accent-texto">Frente em estruturação</p>
            <p className="t-body mt-4 max-w-[70ch] text-muted">
              Esta página está com a estrutura pronta e o conteúdo provisório. A
              carteira de imóveis, os textos institucionais, o CRECI e a
              fotografia própria serão enviados pelo cliente e substituídos nos
              arquivos de conteúdo — o layout não precisa mudar.
            </p>
            <p className="mt-5 flex flex-wrap gap-3">
              <Pendente titulo="src/content/imobiliaria.ts">Carteira de imóveis</Pendente>
              <Pendente titulo="src/content/imobiliaria.ts">CRECI</Pendente>
              <Pendente titulo="src/content/imobiliaria.ts">Fotografia própria</Pendente>
            </p>
          </div>
        </div>
      </section>

      {/* ================= CARTEIRA =================
          Vem antes do discurso institucional de propósito: quem chega aqui
          quer ver imóvel. O "por que o grupo" fica abaixo, para quem gostou
          de algum e quer saber com quem está falando.

          Filtros em cima, contagem ao lado, grade embaixo. Cada card folheia
          as próprias fotos sem sair da lista, e leva à página do imóvel, onde
          a foto fica ao lado do mapa. */}
      <section id="carteira" className="bg-inset py-16 md:py-24">
        <div className="wrap">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <TituloSecao
                rotulo="Carteira"
                titulo="Imóveis à venda em Florianópolis"
              />
              <Pendente titulo="Substituir pela carteira real em src/content/imobiliaria.ts">
                Dados de exemplo
              </Pendente>
            </div>
          </Reveal>

          <div className="mt-12">
            <ListaImoveis imoveis={imoveis} />
          </div>
        </div>
      </section>

      {/* ================= DIFERENCIAIS ================= */}
      <section className="py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <TituloSecao
              rotulo="Por que o grupo"
              titulo={
                <>
                  A engenharia entra
                  <br />
                  <span className="text-accent-texto">antes do anúncio.</span>
                </>
              }
              texto="A imobiliária divide o time técnico com a construtora. Isso muda o que conseguimos te dizer sobre um imóvel."
            />
          </Reveal>

          <Reveal className="mt-14 grid gap-px bg-line md:mt-20 md:grid-cols-2" stagger>
            {imobiliaria.diferenciais.map((item) => (
              <article key={item.titulo} className="bg-surface p-8 md:p-12">
                <h3 className="t-display-tight fs-card text-ink">
                  {item.titulo}
                </h3>
                <p className="t-body mt-5 max-w-[46ch] text-muted">{item.texto}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= SERVIÇOS ================= */}
      <section className="py-20 md:py-32">
        <div className="wrap">
          <Reveal>
            <TituloSecao rotulo="Serviços" titulo="Como podemos ajudar" />
          </Reveal>

          <Reveal as="ul" className="mt-12 border-t border-line md:mt-16" stagger>
            {imobiliaria.servicos.map((s) => (
              <li
                key={s.titulo}
                className="grid gap-3 border-b border-line py-7 md:grid-cols-[16rem_1fr] md:gap-10"
              >
                <h3 className="t-display-tight text-[1.375rem] text-ink">
                  {s.titulo}
                </h3>
                <p className="t-body max-w-[58ch] text-muted">{s.texto}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-inset py-20 md:py-28">
        <div className="wrap">
          <Reveal className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <Rotulo>Contato</Rotulo>
              <h2 className="t-display-tight mt-6 max-w-[16ch] fs-secao text-ink">
                {imobiliaria.cta.titulo}
              </h2>
              <p className="t-lead mt-6 max-w-[46ch] text-muted">
                {imobiliaria.cta.texto}
              </p>
            </div>
            <Botao
              href={whatsappLink(mensagensWhatsapp.imobiliaria)}
              externo
              className="shrink-0"
              ariaLabel={`Falar com a imobiliária no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
            >
              WhatsApp {contato.whatsappExibicao}
            </Botao>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
