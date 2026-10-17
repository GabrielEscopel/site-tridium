"use client";

/* =============================================================================
   MAPA DO IMÓVEL
   -----------------------------------------------------------------------------
   Google Maps pela busca de endereço — sem chave de API, como na referência.

   O mapa só carrega depois do clique, de propósito. Um iframe do Google
   embutido direto roda rastreadores em toda visita à página, inclusive de quem
   nunca olha o mapa. É a mesma regra já aplicada ao vídeo do Instituto.

   Enquanto não carrega, mostra o endereço e um aviso do que vai acontecer —
   o que também cumpre a transparência que a LGPD espera.
   ============================================================================= */

import { useState } from "react";

export function MapaImovel({
  endereco,
  className = "",
}: {
  endereco: string;
  className?: string;
}) {
  const [carregar, setCarregar] = useState(false);
  const busca = encodeURIComponent(endereco);

  return (
    <div className={`relative overflow-hidden bg-inset ${className}`}>
      {carregar ? (
        <iframe
          src={`https://maps.google.com/maps?q=${busca}&output=embed`}
          title={`Mapa da localização: ${endereco}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="blueprint absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
          <div>
            <p className="t-label text-accent-texto">Localização</p>
            <p className="t-body mt-3 text-ink">{endereco}</p>
          </div>

          <button
            type="button"
            onClick={() => setCarregar(true)}
            className="t-label bg-accent px-5 py-3 text-accent-ink transition-[filter] duration-200 hover:brightness-110"
          >
            Carregar o mapa
          </button>

          <p className="max-w-[34ch] text-xs leading-snug text-faint">
            O mapa é do Google e só é carregado quando você pede. Ao abrir, o
            Google recebe o seu acesso.
          </p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${busca}`}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label text-muted underline underline-offset-4 transition-colors duration-200 hover:text-accent-texto"
          >
            Abrir no Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
