"use client";

/* =============================================================================
   CTA FLUTUANTE DE WHATSAPP
   -----------------------------------------------------------------------------
   Presente em todas as rotas, sempre visível. A mensagem pré-preenchida muda
   conforme a frente que o usuário está lendo — quem chega pelo Lar Digno não
   deve abrir o WhatsApp pedindo orçamento de obra.

   Mantém-se verde da marca em todas as páginas de propósito: é a cor que o
   usuário reconhece como "falar com a Tridium", e não um elemento de tema.
   ============================================================================= */

import { usePathname } from "next/navigation";
import { contato, mensagensWhatsapp, whatsappLink } from "@/content/site";

function mensagemPorRota(pathname: string): string {
  if (pathname.startsWith("/engenharia")) return mensagensWhatsapp.engenharia;
  if (pathname.startsWith("/imobiliaria")) return mensagensWhatsapp.imobiliaria;
  if (pathname.startsWith("/lar-digno")) return mensagensWhatsapp.larDigno;
  return mensagensWhatsapp.padrao;
}

export function WhatsappFab() {
  const pathname = usePathname();

  return (
    <a
      href={whatsappLink(mensagemPorRota(pathname))}
      target="_blank"
      rel="noopener noreferrer"
      data-fab-whatsapp
      aria-label={`Falar com a Tridium no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#02b030] pl-4 pr-4 text-[#0b170c] shadow-[0_6px_28px_-6px_rgba(0,0,0,0.55)] transition-[padding,transform] duration-300 ease-out hover:scale-[1.03] focus-visible:scale-[1.03] md:bottom-8 md:right-8 md:hover:pr-6 md:focus-visible:pr-6"
      style={{
        paddingBottom: "0.9rem",
        paddingTop: "0.9rem",
        marginBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="h-6 w-6 shrink-0 fill-current"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.57c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>

      {/* O rótulo só aparece onde há espaço; no mobile o ícone basta. */}
      <span className="t-label ml-0 hidden max-w-0 whitespace-nowrap opacity-0 transition-all duration-300 ease-out group-hover:ml-3 group-hover:max-w-[16rem] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[16rem] group-focus-visible:opacity-100 md:inline-block">
        Fazer orçamento
      </span>
    </a>
  );
}
