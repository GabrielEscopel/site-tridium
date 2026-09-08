/* =============================================================================
   FOTO PENDENTE — placeholder desenhado
   -----------------------------------------------------------------------------
   Onde não existe registro fotográfico real da Tridium, o site mostra ISTO, e
   não uma foto de banco de imagens.

   O motivo é prático: uma foto genérica de obra publicada sob a legenda
   "Rhinno Skatepark" passa despercebida na revisão e acaba no ar como se fosse
   o projeto. Um painel vazio, não. Ele também informa exatamente qual foto
   está faltando, para quem for produzir o material.
   ============================================================================= */

import { MarcaTridium } from "./MarcaTridium";

export function FotoPendente({
  descricao,
  className = "",
}: {
  /** O que precisa ser fotografado. Aparece na tela, não só no código. */
  descricao: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden border border-dashed border-line-strong bg-inset px-6 py-10 text-center ${className}`}
    >
      <div
        aria-hidden="true"
        className="blueprint pointer-events-none absolute inset-0 opacity-70"
      />

      <MarcaTridium
        className="relative h-12 w-12 opacity-25"
        titulo=""
        galoes={["currentColor", "currentColor", "currentColor"]}
        base="currentColor"
      />

      <p className="t-label relative mt-6 text-accent-texto">◇ Foto pendente</p>

      <p className="relative mt-3 max-w-[32ch] font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-faint">
        {descricao}
      </p>
    </div>
  );
}
