import type { Metadata } from "next";
import { CenaMarca } from "@/components/CenaMarca";
import { PortaisFrentes } from "@/components/PortaisFrentes";
import { Reveal } from "@/components/Reveal";
import { Botao, Numeros, Pendente, Rotulo, TituloSecao } from "@/components/ui";
import { CTA_PRINCIPAL, contato, grupo, whatsappLink } from "@/content/site";
import { metadadosRota } from "@/lib/seo";

export const metadata: Metadata = metadadosRota({
  titulo: `${grupo.nome} — Engenharia, imóveis e impacto social em Florianópolis`,
  descricao:
    "Grupo de Florianópolis com três frentes: engenharia e arquitetura, mercado imobiliário e o Instituto Tridium. Construção, reforma e projetos especiais com responsabilidade técnica única.",
  caminho: "/",
});

export default function Home() {
  return (
    <div data-front="engenharia">
      {/* ================= HERO ================= */}
      <section
        data-cena-alcance
        className="relative overflow-hidden bg-surface"
      >
        {/* Grade técnica: vocabulário de prancha, não decoração */}
        <div
          aria-hidden="true"
          className="blueprint pointer-events-none absolute inset-0 opacity-60"
        />

        <div className="wrap relative flex min-h-[100svh] flex-col justify-center gap-5 pb-14 pt-20 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-8 md:pb-24 md:pt-28 lg:gap-14">
          {/* O símbolo em volume — momento 3D da home.
              No mobile ele abre a página; no desktop ocupa a coluna direita. */}
          <CenaMarca className="pointer-events-none order-1 h-[24svh] w-full shrink-0 md:order-2 md:h-[70svh]" />

          <div className="order-2 md:order-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <Rotulo>
                {grupo.cidade} · {grupo.estado}
              </Rotulo>
            </div>

            {/* O tamanho é limitado pela linha mais larga ("fundação.") dentro
                da coluna de texto: acima disso ela invade o símbolo 3D. */}
            <h1 className="t-display mt-6 fs-hero text-ink md:mt-8">
              <span className="block">Três</span>
              <span className="block text-accent-texto">frentes.</span>
              <span className="block">Uma</span>
              <span className="block">fundação.</span>
            </h1>

            <p className="t-lead mt-6 max-w-[42ch] text-muted md:mt-8">
              {grupo.descricao}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-10">
              <Botao href="/engenharia">Ver a engenharia</Botao>
              <Botao
                href={whatsappLink()}
                variante="texto"
                externo
                ariaLabel={`Falar no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
              >
                Falar no WhatsApp
              </Botao>
            </div>
          </div>
        </div>

        {/* À esquerda: a direita pertence ao botão flutuante do WhatsApp.
            Sem o rótulo, a classe t-label sai junto: o espaçamento de 0.22em
            dela é entreletras, e numa seta sozinha viraria só um recuo à
            direita, tirando a seta do alinhamento da margem. */}
        <span
          aria-hidden="true"
          className="absolute bottom-7 left-[var(--gutter)] hidden font-mono text-base leading-none text-faint md:block"
        >
          ↓
        </span>
      </section>

      {/* ================= PORTAIS ================= */}
      <PortaisFrentes />

      {/* ================= INSTITUCIONAL ================= */}
      <section className="bg-surface py-20 md:py-32">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
            <Reveal>
              <TituloSecao
                rotulo="O grupo"
                titulo={
                  <>
                    Um prédio tem
                    <br />
                    três relações
                    <br />
                    <span className="text-accent-texto">com a vida.</span>
                  </>
                }
              />
            </Reveal>

            <Reveal className="space-y-8" stagger>
              <p className="t-lead text-ink">
                Alguém constrói. Alguém mora. E alguém precisa de um lugar
                seguro para chamar de casa. A Tridium organizou o grupo em
                torno dessas três relações porque elas exigem a mesma coisa:
                responsabilidade técnica sobre a estrutura.
              </p>
              <p className="t-body text-muted">
                A engenharia é a frente ativa e mais antiga do grupo — é dela
                que vem o time técnico que avalia a carteira da Tridium Imóveis
                e que assina os projetos das casas atendidas pelo Instituto. Não
                são três empresas que dividem uma marca. São três aplicações da
                mesma competência.
              </p>
              <p className="t-body text-muted">
                Atuamos em Florianópolis e na Grande Florianópolis, com obras
                que vão de reforma residencial a estruturas que quase ninguém
                aceita executar — pista de skate, marquise de grande vão,
                playground sob norma de segurança infantil.
              </p>

              <div className="pt-2">
                <Botao href="/engenharia" variante="contorno">
                  Conhecer os projetos
                </Botao>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= NÚMEROS ================= */}
      <section className="bg-surface pb-20 md:pb-32" aria-labelledby="numeros-grupo">
        <div className="wrap">
          <div className="hairline border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="numeros-grupo" className="t-label text-faint">
                O grupo em números
              </h2>
              <Pendente titulo="Números precisam ser confirmados pelo cliente antes de publicar">
                Dados pendentes
              </Pendente>
            </div>
            <Reveal className="mt-10">
              <Numeros
                itens={[
                  { valor: "3", rotulo: "frentes de atuação" },
                  { valor: "[N]", rotulo: "obras entregues" },
                  { valor: "10", rotulo: "anos de mercado" },
                  { valor: "1", rotulo: "responsabilidade técnica" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-inset py-20 md:py-28">
        <div className="wrap">
          <Reveal className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <Rotulo>Orçamento</Rotulo>
              <p className="t-display-tight mt-6 max-w-[18ch] fs-secao text-ink">
                {CTA_PRINCIPAL}
              </p>
            </div>
            <Botao
              href={whatsappLink()}
              externo
              className="shrink-0"
              ariaLabel={`Falar no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
            >
              WhatsApp {contato.whatsappExibicao}
            </Botao>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
