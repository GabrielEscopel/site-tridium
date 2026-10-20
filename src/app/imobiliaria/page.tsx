import type { Metadata } from "next";

import { CarrosselCapa } from "@/components/CarrosselCapa";
import { JsonLd } from "@/components/JsonLd";
import { ListaImoveis } from "@/components/ListaImoveis";
import { Reveal } from "@/components/Reveal";
import { Botao, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import {
  formatarPreco,
  imobiliaria,
  imoveis,
  imoveisDestaque,
} from "@/content/imobiliaria";
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
          O carrossel é a capa, como na engenharia: os imóveis em destaque
          passam atrás da chamada, e a legenda embaixo leva ao imóvel que está
          na tela. Sai da própria carteira — `destaque: true` no imóvel. */}
      <CarrosselCapa
        rotulo="Imóveis em destaque"
        itens={imoveisDestaque.map((imovel) => ({
          chave: imovel.chave,
          imagem: imovel.fotos[0]?.src ?? null,
          provisoria: imovel.fotos[0]?.provisoria,
          descricaoPendente: `Foto do ${imovel.tipo.toLowerCase()} no ${imovel.bairro}`,
          titulo: imovel.bairro,
          /* Só o que decide um clique: código, tamanho e preço. A ficha
             completa está a um toque daqui, na página do imóvel. */
          etiqueta: `${imovel.codigo} · ${imovel.area} m² · ${formatarPreco(imovel.preco)}`,
          href: `/imobiliaria/${imovel.chave}`,
          acao: "Ver o imóvel",
        }))}
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <Rotulo>{imobiliaria.hero.eyebrow}</Rotulo>
        </div>

        <h1 className="t-display mt-7 max-w-[16ch] fs-hero text-ink">
          {imobiliaria.hero.titulo.map((linha, i) => (
            <span
              key={linha}
              className={`block ${i === 1 ? "text-accent-texto" : ""}`}
            >
              {linha}
            </span>
          ))}
        </h1>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
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
      </CarrosselCapa>

      {/* ================= CARTEIRA =================
          Logo abaixo da capa, sem nada no meio: quem chega aqui quer ver
          imóvel. O "por que o grupo" fica abaixo, para quem gostou de algum e
          quer saber com quem está falando.

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
