/* =============================================================================
   ÍCONES DA CARTEIRA
   -----------------------------------------------------------------------------
   Um arquivo só, para o card e a barra de busca puxarem do mesmo lugar. São
   traços de 1,6 em `currentColor`, então herdam a cor de quem os usa e não
   precisam de variante clara e escura.

   Todos `aria-hidden`: o que eles significam já está escrito ao lado, em texto.
   Ícone anunciado junto com o rótulo faz o leitor de tela ler duas vezes.
   ============================================================================= */

type Props = { className?: string };

function Svg({ children, className = "h-4 w-4" }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconeLupa(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export function IconePino(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

export function IconeCama(p: Props) {
  return (
    <Svg {...p}>
      <path d="M3 18v-8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3" />
      <circle cx="7" cy="11" r="2" />
    </Svg>
  );
}

export function IconeBanho(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" />
      <path d="M7 12V5.5A1.5 1.5 0 0 1 8.5 4h0A1.5 1.5 0 0 1 10 5.5" />
      <path d="M7 19l-1 2M17 19l1 2" />
    </Svg>
  );
}

export function IconeCarro(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 16v2M20 16v2" />
      <path d="M3 16v-3.2L5 8h14l2 4.8V16H3Z" />
      <circle cx="7.5" cy="16" r="1.2" />
      <circle cx="16.5" cy="16" r="1.2" />
    </Svg>
  );
}

export function IconeSeta({ className = "h-4 w-4" }: Props) {
  return (
    <Svg className={className}>
      <path d="m9 5 7 7-7 7" />
    </Svg>
  );
}

export function IconeCompartilhar(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
    </Svg>
  );
}

/* O WhatsApp é o único preenchido: a silhueta é a marca, e um contorno dela
   não é reconhecido como tal. */
export function IconeWhatsapp({ className = "h-4 w-4" }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24Zm-2.6 4.1c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.79-.2-.47-.4-.4-.54-.41h-.47Z" />
    </svg>
  );
}

export function IconeEstrela({
  className = "h-4 w-4",
  cheia = false,
}: Props & { cheia?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={cheia ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m12 3.6 2.6 5.3 5.8.85-4.2 4.1 1 5.78L12 16.9l-5.2 2.73 1-5.78-4.2-4.1 5.8-.85L12 3.6Z" />
    </svg>
  );
}

/* --- Ícones das caixas de categoria ------------------------------------
   Um por tipo de imóvel da carteira. `iconeDoTipo` casa pelo nome e, no que
   não reconhecer, devolve a casa genérica — tipo novo no conteúdo entra na
   grade sem quebrar, mesmo antes de alguém desenhar um ícone para ele. */

export function IconePredio(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16M13 21V10h6a1 1 0 0 1 1 1v10M3 21h18" />
      <path d="M7 8h2M7 12h2M7 16h2M16 14h1M16 17h1" />
    </Svg>
  );
}

export function IconeCasa(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5Z" />
      <path d="M9.5 21v-6h5v6" />
    </Svg>
  );
}

export function IconeTerreno(p: Props) {
  return (
    <Svg {...p}>
      <path d="M3 19.5 12 15l9 4.5-9 2.5-9-2.5Z" />
      <path d="M12 15V4M12 4l5 1.8L12 7.6" />
    </Svg>
  );
}

export function IconeCobertura(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 21V9l5-3.5V21M9 21V12h6a1 1 0 0 1 1 1v8M3 21h18" />
      <path d="M16 9h4v12M18 5.5V9" />
    </Svg>
  );
}

export function IconeComercial(p: Props) {
  return (
    <Svg {...p}>
      <path d="M3.5 8.5 5 4h14l1.5 4.5a2.5 2.5 0 0 1-4.6 1.4 2.5 2.5 0 0 1-4.9 0 2.5 2.5 0 0 1-4.9 0A2.5 2.5 0 0 1 3.5 8.5Z" />
      <path d="M5 11v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9M10 21v-5h4v5" />
    </Svg>
  );
}

export function IconeChave(p: Props) {
  return (
    <Svg {...p}>
      <circle cx="7.5" cy="8" r="3.5" />
      <path d="m10 10.5 9 9M16.5 17l2-2M14 14.5l2-2" />
    </Svg>
  );
}


/* --- Os ícones restantes das caixas de categoria --- */

export function IconeArvore(p: Props) {
  return (
    <Svg {...p}>
      <path d="M12 3.5 7 10h3l-4 5.5h5V21h2v-5.5h5L14 10h3L12 3.5Z" />
    </Svg>
  );
}

export function IconeEsquina(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 4v12a1 1 0 0 0 1 1h12" />
      <path d="M8 8h8v8" strokeDasharray="2.5 2.5" />
      <path d="M17 17 21 21M17 21h4v-4" />
    </Svg>
  );
}

export function IconeCondominio(p: Props) {
  return (
    <Svg {...p}>
      <path d="M2 12l4-3.5L10 12M14 12l4-3.5L22 12" />
      <path d="M4 12v8h4v-8M16 12v8h4v-8M10 20h4" />
    </Svg>
  );
}

export function IconeFoguete(p: Props) {
  return (
    <Svg {...p}>
      <path d="M13.5 4.5c3 1.5 5 4.5 5.5 8.5l-4 3.5-5-5 3.5-7Z" />
      <path d="M10 12.5 5.5 11l2-3.5 3.5-.5" />
      <path d="M14 16.5 15.5 21l3.5-2 .5-3.5" />
      <path d="m8 16-3 3M6.5 13.5 4 16M10.5 17.5 8 20" />
    </Svg>
  );
}

export function IconeGalpao(p: Props) {
  return (
    <Svg {...p}>
      <path d="M3 20V10l9-5 9 5v10" />
      <path d="M3 20h18M7 20v-6h10v6" />
      <path d="M7 17h10" />
    </Svg>
  );
}

export function IconeTroca(p: Props) {
  return (
    <Svg {...p}>
      <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />
    </Svg>
  );
}

/* O nome que o conteúdo declara em `categorias`, e o desenho que ele vira.
   Nome desconhecido cai na casa genérica: categoria nova entra na grade sem
   ninguém precisar desenhar nada antes. */
export const ICONES_CATEGORIA = {
  aluguel: IconeChave,
  sitio: IconeArvore,
  casa: IconeCasa,
  terreno: IconeTerreno,
  esquina: IconeEsquina,
  apartamento: IconePredio,
  cobertura: IconeCobertura,
  condominio: IconeCondominio,
  lancamento: IconeFoguete,
  comercial: IconeComercial,
  galpao: IconeGalpao,
  permuta: IconeTroca,
} as const;

export type NomeIconeCategoria = keyof typeof ICONES_CATEGORIA;

export function iconeDaCategoria(nome: string) {
  return (
    ICONES_CATEGORIA[nome as NomeIconeCategoria] ?? IconeCasa
  );
}
