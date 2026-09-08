/* =============================================================================
   MARCA TRIDIUM — reconstrução vetorial do símbolo
   -----------------------------------------------------------------------------
   Traçado a partir do arquivo oficial /Logos/ICONE-*.png, medido pixel a pixel.
   Existe como SVG (e não como <img>) porque cada estrato precisa ser animado e
   colorido separadamente: no hub da home, os três galões recebem o acento de
   cada frente de negócio.

   Leitura do símbolo: três galões descendo sobre uma base sólida.
   Três frentes, uma fundação.
   ============================================================================= */

export interface MarcaTridiumProps {
  /** Cores dos três galões, do topo para baixo. */
  galoes?: [string, string, string];
  /** Cor da base sólida. */
  base?: string;
  className?: string;
  /** Rótulo acessível. Use "" quando o símbolo for puramente decorativo. */
  titulo?: string;
  /** ids para GSAP alvejar cada estrato individualmente. */
  idPrefixo?: string;
}

export function MarcaTridium({
  galoes = ["currentColor", "currentColor", "currentColor"],
  base = "currentColor",
  className,
  titulo = "Símbolo do Grupo Tridium",
  idPrefixo,
}: MarcaTridiumProps) {
  const p = idPrefixo ? `${idPrefixo}-` : "";
  const decorativo = titulo === "";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={decorativo ? "presentation" : "img"}
      aria-hidden={decorativo || undefined}
      aria-label={decorativo ? undefined : titulo}
      focusable="false"
    >
      {!decorativo && <title>{titulo}</title>}

      {/* Galão 3 — o mais interno, cortado pela borda superior do símbolo */}
      <path
        id={`${p}galao-3`}
        d="M27.5 0 L72.5 0 L50 13.4 Z"
        fill={galoes[2]}
        stroke={galoes[2]}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Galão 1 — o mais largo, sangra nas duas laterais */}
      <path
        id={`${p}galao-1`}
        d="M0 0.2 L50 23 L100 0.2 L100 19.1 L50 40.7 L0 19.1 Z"
        fill={galoes[0]}
        stroke={galoes[0]}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Galão 2 */}
      <path
        id={`${p}galao-2`}
        d="M5.1 32 L50 50.2 L94.9 32 L94.9 51.2 L50 69.7 L5.1 51.2 Z"
        fill={galoes[1]}
        stroke={galoes[1]}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Base — a fundação sólida que recebe os três galões */}
      <path
        id={`${p}base`}
        d="M8.6 63.9 L50 79.2 L91.4 63.9 L91.4 99.9 L8.6 99.9 Z"
        fill={base}
        stroke={base}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
