import type { Metadata } from "next";

import { Atualizacoes } from "@/components/Atualizacoes";
import { CardProjeto } from "@/components/CardProjeto";
import { CarrosselCapa } from "@/components/CarrosselCapa";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import {
  atualizacoes,
  destaques,
  instituto,
  projetos,
} from "@/content/instituto";
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
          O carrossel é a capa, como nas outras duas frentes: o que está
          acontecendo agora passa atrás da chamada, e a legenda embaixo leva à
          seção do projeto que está na tela. */}
      <CarrosselCapa
        rotulo="Destaques do Instituto"
        itens={destaques.map((item) => ({
          chave: item.chave,
          imagem: item.midia.pendente ? null : (item.midia.src ?? null),
          posicao: item.midia.posicao,
          provisoria: item.midia.provisoria,
          descricaoPendente: item.midia.descricao,
          titulo: item.titulo,
          etiqueta: item.eyebrow,
          href: item.acao.href,
          externo: item.acao.externo,
          acao: item.acao.rotulo,
        }))}
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          <Rotulo>{instituto.hero.eyebrow}</Rotulo>
        </div>

        <h1 className="t-display mt-7 max-w-[14ch] fs-hero text-ink">
          {instituto.hero.titulo.map((linha, i) => (
            <span
              key={linha}
              className={`block ${i === 2 ? "text-accent-texto" : ""}`}
            >
              {linha}
            </span>
          ))}
        </h1>

        <div className="mt-9">
          <Botao
            href={whatsappLink(mensagensWhatsapp.instituto)}
            externo
            ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
          >
            Quero ajudar
          </Botao>
        </div>
      </CarrosselCapa>

      {/* ================= OS PROJETOS =================
          Primeira coisa depois da capa: os projetos. A missão e o texto de
          apresentação ficavam aqui e saíram — a capa já diz a que o Instituto
          veio, e quem rola quer ver o que existe.

          Índice, não conteúdo. Cada projeto tem a própria página: a história
          inteira de um não cabe junto com a dos outros sem virar rolagem sem
          fim — eram treze telas antes de a capoeira começar. */}
      <section className="py-20 md:py-28">
        <div className="wrap">
          <Reveal>
            <TituloSecao
              rotulo={instituto.projetosIntro.rotulo}
              titulo={instituto.projetosIntro.titulo}
              texto={instituto.projetosIntro.texto}
            />
          </Reveal>

          <Reveal
            as="ul"
            stagger
            className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8"
          >
            {projetos.map((projeto, i) => (
              <li key={projeto.chave} className="h-full">
                <CardProjeto projeto={projeto} prioridade={i < 2} />
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ================= ATUALIZAÇÕES ================= */}
      <Atualizacoes
        itens={atualizacoes}
        titulo={instituto.atualizacoesIntro.titulo}
        texto={instituto.atualizacoesIntro.texto}
      />

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
