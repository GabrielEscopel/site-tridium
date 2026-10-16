/* =============================================================================
   ATUALIZAÇÕES — o que está acontecendo no Instituto
   -----------------------------------------------------------------------------
   Equivalente ao "Últimas notícias" do Greenpeace: cada item traz categoria,
   título, resumo e data.

   É o que mantém a página viva entre uma obra e outra. Uma página institucional
   que nunca muda parece abandonada, por melhor que seja o texto — e em projeto
   social isso custa confiança.

   Some sozinha quando o array de atualizações estiver vazio: seção de notícias
   vazia comunica pior que seção nenhuma.
   ============================================================================= */

import type { Atualizacao } from "@/content/instituto";
import { Pendente, Rotulo } from "./ui";
import { Reveal } from "./Reveal";

/** Converte 2026-10-16 em "16 de outubro de 2026". Datas pendentes passam direto. */
function formatarData(iso: string): { exibicao: string; dateTime?: string } {
  const data = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(data.getTime())) return { exibicao: iso };

  return {
    exibicao: data.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dateTime: iso,
  };
}

export function Atualizacoes({
  itens,
  titulo,
  texto,
}: {
  itens: readonly Atualizacao[];
  titulo: string;
  texto: string;
}) {
  if (!itens.length) return null;

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4">
                <span
                  className="h-px w-8 shrink-0 bg-accent"
                  aria-hidden="true"
                />
                <Rotulo>Acontecendo</Rotulo>
              </div>
              <h2 className="t-display-tight fs-secao mt-6 max-w-[20ch] text-ink">
                {titulo}
              </h2>
            </div>
            <Pendente titulo="src/content/instituto.ts">
              Conteúdo de exemplo
            </Pendente>
          </div>

          <p className="t-body mt-6 max-w-[56ch] text-muted">{texto}</p>
        </Reveal>

        <Reveal as="ul" stagger className="mt-12 grid gap-px bg-line md:grid-cols-3">
          {itens.map((item) => {
            const { exibicao, dateTime } = formatarData(item.data);
            const Conteudo = (
              <>
                <div className="flex items-center justify-between gap-4">
                  <span className="t-label text-accent-texto">
                    {item.categoria}
                  </span>
                  {dateTime ? (
                    <time dateTime={dateTime} className="t-label text-faint">
                      {exibicao}
                    </time>
                  ) : (
                    <span className="t-label text-faint">{exibicao}</span>
                  )}
                </div>

                <h3 className="t-display-tight fs-card mt-5 text-ink">
                  {item.titulo}
                </h3>
                <p className="t-body mt-3 text-muted">{item.resumo}</p>

                {item.href && (
                  <span className="t-label mt-6 inline-flex items-center gap-3 text-ink transition-colors duration-200 group-hover:text-accent-texto">
                    Saiba mais
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                )}
              </>
            );

            return (
              <li key={item.chave} className="bg-surface">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex h-full flex-col p-6 transition-colors duration-200 hover:bg-raised sm:p-8"
                  >
                    {Conteudo}
                  </a>
                ) : (
                  <article className="flex h-full flex-col p-6 sm:p-8">
                    {Conteudo}
                  </article>
                )}
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
