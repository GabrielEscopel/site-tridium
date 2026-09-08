/* =============================================================================
   PEÇAS COMPARTILHADAS
   -----------------------------------------------------------------------------
   As três frentes usam exatamente estes componentes. O que muda entre elas é
   apenas o valor de --accent / --surface herdado de [data-front] — nunca a
   estrutura. É o que mantém as identidades distintas e a base coesa.
   ============================================================================= */

import Link from "next/link";
import type { ReactNode } from "react";

/* --- Rótulo mono ------------------------------------------------------------
   Ecoa o "ENGENHARIA E CONSTRUÇÃO" travado sob o wordmark oficial. */
export function Rotulo({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`t-label text-accent-texto ${className}`}>{children}</span>
  );
}

/* --- Rótulo de seção com fio ------------------------------------------------ */
export function TituloSecao({
  rotulo,
  titulo,
  texto,
  className = "",
}: {
  rotulo: string;
  titulo: ReactNode;
  texto?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
        <Rotulo>{rotulo}</Rotulo>
      </div>
      <h2 className="t-display-tight mt-6 text-[clamp(2rem,1.3rem+3.4vw,4rem)] text-ink">
        {titulo}
      </h2>
      {texto && (
        <p className="t-lead mt-6 max-w-[46ch] text-muted">{texto}</p>
      )}
    </div>
  );
}

/* --- Botões ----------------------------------------------------------------- */

type BotaoProps = {
  href: string;
  children: ReactNode;
  variante?: "solido" | "contorno" | "texto";
  externo?: boolean;
  className?: string;
  ariaLabel?: string;
};

const BASE_BOTAO =
  "group inline-flex items-center justify-center gap-3 px-7 py-4 t-label transition-colors duration-200 no-underline";

export function Botao({
  href,
  children,
  variante = "solido",
  externo = false,
  className = "",
  ariaLabel,
}: BotaoProps) {
  const estilos = {
    solido: "bg-accent text-accent-ink hover:brightness-110",
    contorno:
      "border border-line-strong text-ink hover:border-accent hover:text-accent-texto",
    texto: "px-0 py-2 text-ink hover:text-accent-texto",
  }[variante];

  const conteudo = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  if (externo) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`${BASE_BOTAO} ${estilos} ${className}`}
      >
        {conteudo}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${BASE_BOTAO} ${estilos} ${className}`}
    >
      {conteudo}
    </Link>
  );
}

/* --- Marcador de conteúdo pendente ------------------------------------------
   Existe para ser visto. Enquanto houver um destes na tela, a página não está
   pronta para ir ao ar. Some sozinho quando o texto real substituir o
   placeholder no arquivo de conteúdo. */
export function Pendente({
  children = "Conteúdo pendente",
  titulo,
}: {
  children?: ReactNode;
  titulo?: string;
}) {
  return (
    <span
      title={titulo}
      className="inline-flex items-center gap-2 border border-dashed border-current px-2.5 py-1 align-middle font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-faint"
    >
      <span aria-hidden="true">◇</span>
      {children}
    </span>
  );
}

/* --- Régua de dados --------------------------------------------------------- */
export function Numeros({
  itens,
  className = "",
}: {
  itens: readonly { valor: string; rotulo: string }[];
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-2 gap-px overflow-hidden bg-line lg:grid-cols-4 ${className}`}
    >
      {itens.map((item) => (
        <div key={item.rotulo} className="bg-surface px-6 py-8 sm:px-8 sm:py-10">
          <dt className="sr-only">{item.rotulo}</dt>
          <dd>
            <span className="t-display-tight block text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] text-accent-texto">
              {item.valor}
            </span>
            <span className="mt-3 block text-sm leading-snug text-muted">
              {item.rotulo}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
