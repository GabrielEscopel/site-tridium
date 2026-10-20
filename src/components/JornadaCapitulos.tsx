"use client";

/* =============================================================================
   JORNADA EM CAPÍTULOS — scrollytelling do Instituto
   -----------------------------------------------------------------------------
   Uma casa não é reformada de uma vez: é diagnóstico, projeto, mutirão e
   entrega, nessa ordem. A página conta isso na ordem em que acontece — a
   imagem fica presa enquanto o texto avança, e troca a cada capítulo.

   Desktop: coluna de imagem em sticky + troca por ScrollTrigger.
   Mobile e movimento reduzido: capítulos empilhados, imagem acima do texto.
   Sem pin, sem custo — a narrativa continua legível na ordem certa.

   O estado muda só na virada de capítulo (onEnter/onEnterBack), nunca a cada
   frame: o React não re-renderiza durante o scroll.
   ============================================================================= */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pendente } from "./ui";
import { FotoPendente } from "./FotoPendente";

export interface Capitulo {
  chave: string;
  indice: string;
  titulo: string;
  texto: string;
  nota: string;
  /** null enquanto não houver foto real do capítulo. */
  imagem: string | null;
  imagemAlt?: string;
  imagemProvisoria?: boolean;
  descricaoFoto?: string;
}

export function JornadaCapitulos({
  capitulos,
}: {
  capitulos: readonly Capitulo[];
}) {
  const raizRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;

    const mm = gsap.matchMedia();

    mm.add(
      { comPin: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)" },
      (contexto) => {
        if (!contexto.conditions?.comPin) return;
        gsap.registerPlugin(ScrollTrigger);

        const blocos =
          raiz.querySelectorAll<HTMLElement>("[data-capitulo]");

        blocos.forEach((bloco, i) => {
          ScrollTrigger.create({
            trigger: bloco,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setAtivo(i),
            onEnterBack: () => setAtivo(i),
          });
        });
      }
    );

    return () => mm.revert();
  }, [capitulos.length]);

  return (
    <div ref={raizRef} className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16">
      {/* Coluna de imagem — presa no desktop, oculta no mobile */}
      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-[100svh] items-center py-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-inset">
            {capitulos.map((cap, i) => (
              <div
                key={cap.chave}
                aria-hidden="true"
                className="absolute inset-0 transition-opacity duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ opacity: i === ativo ? 1 : 0 }}
              >
                {cap.imagem ? (
                  <Image
                    src={cap.imagem}
                    alt=""
                    fill
                    sizes="46vw"
                    loading={i === 0 ? undefined : "lazy"}
                    priority={i === 0}
                    className="object-cover"
                  />
                ) : (
                  <FotoPendente
                    className="absolute inset-0"
                    descricao={cap.descricaoFoto ?? "Registro fotográfico pendente"}
                  />
                )}
              </div>
            ))}

            {/* Trilho de progresso: quantos capítulos existem e onde estamos */}
            <ol className="absolute bottom-5 left-5 flex gap-2">
              {capitulos.map((cap, i) => (
                <li key={cap.chave}>
                  <span className="sr-only">
                    {cap.indice}
                    {i === ativo ? " (atual)" : ""}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-1 w-10 transition-colors duration-500"
                    style={{
                      backgroundColor:
                        i === ativo
                          ? "var(--accent)"
                          : "rgba(255,255,255,0.45)",
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Coluna de texto */}
      <ol>
        {capitulos.map((cap, i) => (
          <li
            key={cap.chave}
            data-capitulo
            className="grid gap-6 border-t border-line py-10 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:items-center sm:gap-10 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:border-0 lg:py-24"
          >
            {/* Fora do desktop a imagem acompanha o próprio capítulo — ao lado
                do texto, não acima: empilhada, a jornada sozinha passava de
                três mil pixels. */}
            <figure className="lg:hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-inset">
                {cap.imagem ? (
                  <Image
                    src={cap.imagem}
                    alt={cap.imagemAlt ?? ""}
                    fill
                    sizes="(min-width: 640px) 40vw, 100vw"
                    loading={i === 0 ? undefined : "lazy"}
                    className="object-cover"
                  />
                ) : (
                  <FotoPendente
                    className="absolute inset-0"
                    descricao={cap.descricaoFoto ?? "Registro fotográfico pendente"}
                  />
                )}
              </div>
            </figure>

            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                <span className="t-label text-accent-texto">{cap.indice}</span>
              </div>

              <h3 className="t-display-tight mt-6 fs-bloco text-ink">
                {cap.titulo}
              </h3>

              <p className="t-lead mt-6 max-w-[46ch] text-muted">{cap.texto}</p>

              {cap.nota.startsWith("[") && (
                <p className="mt-6">
                  <Pendente titulo={cap.nota}>Relato real pendente</Pendente>
                </p>
              )}
              {cap.imagemProvisoria && (
                <p className="mt-3">
                  <Pendente titulo="Substituir por fotografia real do projeto">
                    Foto provisória
                  </Pendente>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
