"use client";

/* =============================================================================
   CARROSSEL DE FOTOS — dentro do card do imóvel
   -----------------------------------------------------------------------------
   Deixa folhear as fotos sem sair da lista, como na referência. É proposital
   que seja pequeno e discreto: aqui a foto é apoio da decisão, não espetáculo.

   Diferenças em relação ao CarrosselDestaques, que abre o Instituto:
   - não avança sozinho. Numa lista com vários cards, movimento simultâneo em
     todos vira ruído e atrapalha a leitura
   - as setas só aparecem no hover ou no foco, para não poluir a grade
   - o clique nas setas não navega para o imóvel, mesmo o card inteiro sendo
     um link
   ============================================================================= */

import { useState } from "react";
import Image from "next/image";
import type { FotoImovel } from "@/content/imobiliaria";

export function CarrosselFotos({
  fotos,
  prioridade = false,
  className = "",
}: {
  fotos: readonly FotoImovel[];
  /** true na primeira linha da grade: carrega sem esperar o scroll. */
  prioridade?: boolean;
  className?: string;
}) {
  const [atual, setAtual] = useState(0);
  const total = fotos.length;

  if (!total) return null;

  const mover = (passo: number) => (e: React.MouseEvent) => {
    /* O card inteiro é um link: sem isto, folhear a foto abriria o imóvel. */
    e.preventDefault();
    e.stopPropagation();
    setAtual((i) => (i + passo + total) % total);
  };

  return (
    <div className={`group/foto relative overflow-hidden bg-inset ${className}`}>
      {fotos.map((foto, i) => (
        <Image
          key={foto.src}
          src={foto.src}
          alt={i === 0 ? foto.alt : ""}
          fill
          priority={prioridade && i === 0}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          aria-hidden={i !== atual}
          className={`object-cover transition-opacity duration-500 ${
            i === atual ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {fotos[atual]?.provisoria && (
        <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-2 border border-dashed border-white/70 bg-black/60 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white">
          ◇ Foto provisória
        </span>
      )}

      {total > 1 && (
        <>
          <Seta lado="esquerda" aoClicar={mover(-1)} />
          <Seta lado="direita" aoClicar={mover(1)} />

          <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[0.5625rem] text-white">
            {atual + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}

function Seta({
  lado,
  aoClicar,
}: {
  lado: "esquerda" | "direita";
  aoClicar: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className={`absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center bg-black/45 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 focus-visible:opacity-100 group-hover/foto:opacity-100 ${
        lado === "esquerda" ? "left-2" : "right-2"
      }`}
    >
      <span aria-hidden="true">{lado === "esquerda" ? "←" : "→"}</span>
      <span className="sr-only">
        {lado === "esquerda" ? "Foto anterior" : "Próxima foto"}
      </span>
    </button>
  );
}
