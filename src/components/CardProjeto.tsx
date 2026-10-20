/* =============================================================================
   CARTÃO DE PROJETO — o índice do Instituto
   -----------------------------------------------------------------------------
   Foto, nome, uma linha e os números. É o que a pessoa precisa para escolher
   em qual projeto entrar; a história inteira está do outro lado do clique.

   Os números vêm do próprio projeto, cortados em dois: no cartão eles servem
   de prova rápida, não de relatório.
   ============================================================================= */

import Image from "next/image";
import Link from "next/link";
import { capaDoProjeto, type Projeto } from "@/content/instituto";
import { FotoPendente } from "./FotoPendente";

export function CardProjeto({
  projeto,
  prioridade = false,
}: {
  projeto: Projeto;
  prioridade?: boolean;
}) {
  const capa = capaDoProjeto(projeto);
  const numeros = projeto.numeros?.slice(0, 2) ?? [];

  return (
    <article className="group h-full border border-line bg-surface transition-colors duration-200 hover:border-accent">
      <Link
        href={`/instituto/${projeto.chave}`}
        className="flex h-full flex-col no-underline"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-inset">
          {capa?.src ? (
            <>
              <Image
                src={capa.src}
                alt=""
                fill
                priority={prioridade}
                sizes="(min-width: 768px) 45vw, 100vw"
                style={{ objectPosition: capa.posicao ?? "center" }}
                className="object-cover"
              />
              {capa.provisoria && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                  ◇ Foto provisória
                </span>
              )}
            </>
          ) : (
            <FotoPendente
              descricao={`Foto de abertura do ${projeto.nome}`}
              className="absolute inset-0"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3 className="t-display-tight fs-bloco text-ink transition-colors duration-200 group-hover:text-accent-texto">
            {projeto.nome}
          </h3>

          <p className="t-body mt-4 max-w-[42ch] text-muted">
            {projeto.resumo}
          </p>

          {numeros.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
              {numeros.map((n) => (
                <div key={n.rotulo}>
                  <dt className="sr-only">{n.rotulo}</dt>
                  <dd>
                    <span className="t-display-tight block fs-card text-accent-texto">
                      {n.valor}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted">
                      {n.rotulo}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <span className="t-label mt-auto inline-flex items-center gap-3 pt-8 text-accent-texto">
            Ver o projeto
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
