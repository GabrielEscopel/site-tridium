"use client";

/* =============================================================================
   PROCEDIMENTOS — o manual da casa
   -----------------------------------------------------------------------------
   Nove etapas na lateral, os tópicos de cada uma no corpo. Cada tópico abre
   e fecha: o corretor que já sabe o passo a passo não precisa rolar por ele
   para chegar no próximo.

   Três marcações aparecem dentro dos tópicos, e cada uma tem um peso:
     EXIGÊNCIA  o que a lei ou o conselho obriga, com a fonte
     ATENÇÃO    o erro comum que custa caro
     CARDS      os materiais de apoio, que ainda estão sendo produzidos

   O conteúdo vem de content/corretor.ts. Etapa, tópico ou card novo entra lá
   e aparece aqui sozinho.
   ============================================================================= */

import { useState } from "react";
import { procedimentos, type CardProcedimento } from "@/content/corretor";
import { iconeDaCategoria } from "./IconesImovel";

export function PainelProcedimentos() {
  const [etapaAberta, setEtapaAberta] = useState(procedimentos[0].chave);
  const [topicosAbertos, setTopicosAbertos] = useState<string[]>([]);

  const etapa =
    procedimentos.find((e) => e.chave === etapaAberta) ?? procedimentos[0];

  const alternarTopico = (chave: string) =>
    setTopicosAbertos((abertos) =>
      abertos.includes(chave)
        ? abertos.filter((c) => c !== chave)
        : [...abertos, chave]
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-8">
      {/* ---------- As etapas ----------
          No desktop é uma coluna que acompanha a rolagem; no celular vira uma
          fileira que desliza, para não empurrar o conteúdo uma tela abaixo. */}
      <nav aria-label="Etapas do processo" className="lg:sticky lg:top-24 lg:self-start">
        <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
          {procedimentos.map((e) => {
            const ativa = e.chave === etapa.chave;
            const Icone = iconeDaCategoria(e.icone);
            return (
              <li key={e.chave} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => setEtapaAberta(e.chave)}
                  aria-current={ativa ? "true" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200 ${
                    ativa
                      ? "border-[color:var(--cart-pilula)] bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
                      : "border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] text-[color:var(--cart-preco)] hover:border-[color:var(--cart-linha-ativa)]"
                  }`}
                >
                  <Icone
                    className={`h-5 w-5 shrink-0 ${
                      ativa ? "" : "text-[color:var(--cart-titulo)]"
                    }`}
                  />
                  <span className="min-w-0">
                    <span
                      className={`block font-mono text-[0.625rem] font-bold tracking-[0.12em] ${
                        ativa ? "opacity-75" : "text-[color:var(--ink-faint)]"
                      }`}
                    >
                      {e.numero}
                    </span>
                    <span className="block whitespace-nowrap text-sm font-semibold lg:whitespace-normal">
                      {e.titulo}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---------- Os tópicos da etapa ---------- */}
      <div>
        <div className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-6 shadow-[var(--cart-sombra)] md:p-8">
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-[color:var(--cart-titulo)]">
            ETAPA {etapa.numero}
          </p>
          <h2 className="t-display-tight fs-bloco mt-2 text-[color:var(--ink)]">
            {etapa.titulo}
          </h2>
          <p className="t-body mt-3 max-w-[60ch] text-[color:var(--ink-muted)]">
            {etapa.resumo}
          </p>
        </div>

        <ul className="mt-4 space-y-3">
          {etapa.topicos.map((t) => {
            const aberto = topicosAbertos.includes(t.chave);
            return (
              <li
                key={t.chave}
                className="overflow-hidden rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)]"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => alternarTopico(t.chave)}
                    aria-expanded={aberto}
                    aria-controls={`topico-${t.chave}`}
                    className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.0625rem] font-semibold text-[color:var(--cart-titulo)]">
                        {t.titulo}
                      </span>
                      <span className="mt-1.5 block text-sm leading-snug text-[color:var(--ink-muted)]">
                        {t.resumo}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`mt-1 shrink-0 text-[color:var(--cart-titulo)] transition-transform duration-300 ease-[var(--cart-curva)] ${
                        aberto ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                </h3>

                {aberto && (
                  <div
                    id={`topico-${t.chave}`}
                    className="border-t border-[color:var(--cart-card-linha)] px-6 pb-6 pt-5"
                  >
                    {/* A numeração é legítima: é uma sequência real, e a ordem
                        carrega informação que o corretor precisa. */}
                    <ol className="space-y-2.5">
                      {t.passos.map((passo, i) => (
                        <li key={passo} className="flex gap-3.5 text-sm">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--cart-caixa)] font-mono text-[0.625rem] font-bold text-[color:var(--cart-titulo)]">
                            {i + 1}
                          </span>
                          <span className="text-[color:var(--ink)]">{passo}</span>
                        </li>
                      ))}
                    </ol>

                    {t.exigencia && (
                      <Marca tom="lei" rotulo="Exigência legal">
                        {t.exigencia}
                      </Marca>
                    )}

                    {t.atencao && (
                      <Marca tom="atencao" rotulo="Atenção">
                        {t.atencao}
                      </Marca>
                    )}

                    {t.cards && t.cards.length > 0 && (
                      <div className="mt-5 border-t border-[color:var(--cart-card-linha)] pt-5">
                        <p className="t-label text-[color:var(--ink-faint)]">
                          Material de apoio
                        </p>
                        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                          {t.cards.map((c) => (
                            <li key={c.chave}>
                              <CardApoio card={c} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Marca({
  tom,
  rotulo,
  children,
}: {
  tom: "lei" | "atencao";
  rotulo: string;
  children: React.ReactNode;
}) {
  const lei = tom === "lei";
  return (
    <div
      className={`mt-5 rounded-xl border-l-[3px] px-4 py-3.5 ${
        lei
          ? "border-l-[color:var(--cart-titulo)] bg-[color:var(--cart-caixa)]"
          : "border-l-[color:var(--cart-acao)] bg-[color:var(--cart-caixa)]"
      }`}
    >
      <p
        className={`font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] ${
          lei
            ? "text-[color:var(--cart-titulo)]"
            : "text-[color:var(--cart-acao-ink)]"
        }`}
      >
        {rotulo}
      </p>
      <p className="mt-1.5 text-sm leading-snug text-[color:var(--ink)]">
        {children}
      </p>
    </div>
  );
}

/* Card com arquivo vira link; sem arquivo, fica como a produzir — a mesma
   regra das fotos pendentes do resto do site: nunca fingir que existe. */
function CardApoio({ card }: { card: CardProcedimento }) {
  const TIPOS = { modelo: "Modelo", guia: "Guia", ferramenta: "Ferramenta" };

  const miolo = (
    <>
      <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
        {TIPOS[card.tipo]}
      </span>
      <span className="mt-1.5 block text-sm font-semibold text-[color:var(--cart-preco)]">
        {card.titulo}
      </span>
      <span className="mt-1 block text-xs leading-snug text-[color:var(--ink-muted)]">
        {card.descricao}
      </span>
    </>
  );

  if (card.href) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-4 no-underline transition-[translate,box-shadow,border-color] duration-[220ms] ease-[var(--cart-curva)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] hover:shadow-[var(--cart-sombra-alta)] motion-reduce:hover:translate-y-0"
      >
        {miolo}
      </a>
    );
  }

  return (
    <div className="h-full rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-caixa)]/60 p-4">
      {miolo}
      <span className="mt-2.5 inline-block font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">
        ◇ A produzir
      </span>
    </div>
  );
}
