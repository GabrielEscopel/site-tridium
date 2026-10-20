/* =============================================================================
   REGISTRO — fotos e vídeos de um projeto
   -----------------------------------------------------------------------------
   Uma grade que aceita foto e vídeo lado a lado. Enquanto não houver arquivo
   real, mostra um painel dizendo exatamente o que precisa ser produzido — a
   mesma regra do resto do site: nunca uma imagem de banco no lugar do registro
   verdadeiro.

   Vídeo aceita duas origens:
     fonte: "arquivo"  → <video> com o arquivo em /public
     fonte: "youtube"  → iframe, carregado só quando o usuário clica
   O YouTube só entra depois do clique de propósito: embutido direto, ele
   carrega rastreadores em toda visita à página, mesmo em quem nunca assiste.
   ============================================================================= */

"use client";

import { useState } from "react";
import Image from "next/image";
import type { Midia } from "@/content/instituto";
import { FotoPendente } from "./FotoPendente";

function Pendente({ item }: { item: Midia }) {
  return (
    <FotoPendente
      descricao={
        item.tipo === "video" ? `Vídeo — ${item.descricao}` : item.descricao
      }
      className="aspect-[4/3] h-full w-full"
    />
  );
}

function Video({ item }: { item: Midia }) {
  const [tocando, setTocando] = useState(false);

  if (item.fonte === "youtube") {
    if (tocando) {
      return (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-inset">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1`}
            title={item.descricao}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setTocando(true)}
        className="group/v relative block aspect-[4/3] w-full overflow-hidden bg-inset"
      >
        {item.poster && (
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover/v:scale-[1.03]"
          />
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/35">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover/v:scale-110">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        <span className="sr-only">Reproduzir vídeo: {item.descricao}</span>
      </button>
    );
  }

  return (
    <video
      controls
      preload="none"
      poster={item.poster}
      className="aspect-[4/3] w-full bg-inset object-cover"
    >
      <source src={item.src} />
      Seu navegador não reproduz este vídeo.
    </video>
  );
}

export function RegistroMidia({
  itens,
  titulo,
}: {
  itens: readonly Midia[];
  /** Sem título quando quem chama já põe um — é o caso do <Bloco>. */
  titulo?: string;
}) {
  if (!itens.length) return null;

  return (
    <div>
      {titulo && <h4 className="t-label text-accent-texto">{titulo}</h4>}

      <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 ${titulo ? "mt-6" : ""}`}>
        {itens.map((item, i) => (
          <li
            key={`${item.tipo}-${i}`}
            className={item.destaque ? "sm:col-span-2" : undefined}
          >
            <figure className="h-full">
              {item.pendente ? (
                <Pendente item={item} />
              ) : item.tipo === "video" ? (
                <Video item={item} />
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-inset">
                  <Image
                    src={item.src!}
                    alt={item.alt ?? item.descricao}
                    fill
                    sizes={
                      item.destaque
                        ? "(min-width: 1024px) 60vw, 100vw"
                        : "(min-width: 640px) 40vw, 100vw"
                    }
                    style={{ objectPosition: item.posicao ?? "center" }}
                    className="object-cover"
                  />
                  {item.provisoria && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-white">
                      ◇ Foto provisória
                    </span>
                  )}
                </div>
              )}

              {!item.pendente && (
                <figcaption className="mt-3 text-sm leading-snug text-muted">
                  {item.descricao}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
