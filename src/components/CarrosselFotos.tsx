"use client";

/* =============================================================================
   CARROSSEL DE FOTOS — dentro de um card
   -----------------------------------------------------------------------------
   Deixa folhear as fotos sem sair da lista. Serve ao card de imóvel e ao card
   de obra do portfólio, onde as fotos mostram a evolução da obra.

   É proposital que seja pequeno e discreto: aqui a foto é apoio da decisão,
   não espetáculo.

   Diferenças em relação ao carrossel de capa:
   - não avança sozinho. Numa grade com vários cards, movimento simultâneo em
     todos vira ruído e atrapalha a leitura
   - as setas só aparecem no hover ou no foco, para não poluir a grade
   - abre sempre na foto 1, que é a mesma que aparece na capa da página
   - o clique nas setas não navega, mesmo quando o card inteiro é um link
   ============================================================================= */

import { useState } from "react";
import Image from "next/image";

/** O mínimo que o carrossel precisa. `FotoImovel` e `FotoCase` se encaixam. */
export interface FotoCard {
  src: string;
  alt?: string;
  /** Imagem de banco no lugar da real. Mostra o selo na tela. */
  provisoria?: boolean;
  /** object-position, quando o enquadramento central corta o que importa. */
  posicao?: string;
}

export function CarrosselFotos({
  fotos,
  prioridade = false,
  className = "",
  tamanhos = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw",
}: {
  fotos: readonly FotoCard[];
  /** true na primeira linha da grade: carrega sem esperar o scroll. */
  prioridade?: boolean;
  className?: string;
  /** O `sizes` da imagem, que muda conforme a largura do card. */
  tamanhos?: string;
}) {
  const [atual, setAtual] = useState(0);
  const total = fotos.length;

  if (!total) return null;

  const mover = (passo: number) => (e: React.MouseEvent) => {
    /* O card pode ser um link inteiro: sem isto, folhear abriria a página. */
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
          alt={i === 0 ? (foto.alt ?? "") : ""}
          fill
          priority={prioridade && i === 0}
          loading={prioridade && i === 0 ? undefined : "lazy"}
          sizes={tamanhos}
          aria-hidden={i !== atual}
          style={{ objectPosition: foto.posicao ?? "center" }}
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
