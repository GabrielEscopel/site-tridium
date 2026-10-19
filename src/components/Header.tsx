"use client";

/* =============================================================================
   CABEÇALHO GLOBAL
   -----------------------------------------------------------------------------
   Fica transparente sobre o topo e ganha fundo ao descolar. O menu mobile é um
   painel inteiro com foco preso — não um dropdown que fecha por acidente.
   ============================================================================= */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  contato,
  ctaPorRota,
  grupo,
  logos,
  mensagemPorRota,
  navegacao,
  whatsappLink,
} from "@/content/site";

export function Header() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [descolado, setDescolado] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  /* O cabeçalho adota o tema da rota em que está. Sem isso ele herda o tema
     escuro da :root e some por cima das páginas claras (Imóveis e
     Digno): links, botão de orçamento e o ícone do menu ficam osso sobre
     osso. */
  const frenteDaRota: "engenharia" | "imobiliaria" | "instituto" =
    pathname.startsWith("/imobiliaria")
      ? "imobiliaria"
      : pathname.startsWith("/instituto")
        ? "instituto"
        : "engenharia";

  /* Enquanto está por cima da capa — carrossel de fotografia escurecida nas
     três frentes — o cabeçalho usa a paleta clara, qualquer que seja a rota.
     Com o tema da frente clara, o logo e os links caíam escuros sobre a foto
     e sumiam. Ao descolar, ele ganha fundo e volta ao tema da rota.
     Com o menu aberto não vale: ali o painel traz o próprio fundo claro. */
  const sobreCapa = !descolado && !aberto;
  const temaEscuro = sobreCapa || frenteDaRota === "engenharia";

  useEffect(() => {
    const aoRolar = () => setDescolado(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => setAberto(false), [pathname]);

  // Trava o corpo e prende o foco enquanto o painel estiver aberto
  useEffect(() => {
    if (!aberto) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // O painel já traz o seu próprio botão de WhatsApp; o flutuante viraria
    // um segundo botão por cima do rodapé do menu.
    document.documentElement.dataset.menuAberto = "true";

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        gatilhoRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focaveis = painelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focaveis?.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      delete document.documentElement.dataset.menuAberto;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const logo = temaEscuro ? logos.horizSobreEscuro : logos.horizSobreClaro;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-5 focus:py-3 focus:text-accent-ink focus:t-label"
      >
        Pular para o conteúdo
      </a>

      <header
        data-front={frenteDaRota}
        // text-ink reavalia --ink AQUI. Sem a classe, os filhos herdam a cor
        // ja calculada no <body> e o icone do menu fica osso sobre osso.
        className={`fixed inset-x-0 top-0 z-50 text-ink transition-colors duration-300 ${
          sobreCapa ? "sobre-foto" : ""
        } ${
          descolado && !aberto
            ? "bg-surface/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div
          className={`wrap flex items-center justify-between py-4 md:py-5 ${
            descolado && !aberto ? "border-b border-line" : ""
          }`}
        >
          <Link
            href="/"
            className="relative z-10 block shrink-0"
            aria-label={`${grupo.nome} — página inicial`}
          >
            <Image
              src={aberto ? logos.horizSobreEscuro : logo}
              alt={grupo.nome}
              width={567}
              height={128}
              priority
              className="h-7 w-auto md:h-8"
            />
          </Link>

          {/* Navegação — desktop */}
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navegacao.map((item) => {
                const ativo =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={ativo ? "page" : undefined}
                      className={`t-label relative py-2 transition-colors duration-200 ${
                        ativo ? "text-accent-texto" : "text-ink hover:text-accent-texto"
                      }`}
                    >
                      {item.rotulo}
                      {ativo && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {/* Rótulo e mensagem seguem a rota: em Imóveis o botão chama
                um corretor, e a conversa no WhatsApp precisa abrir falando de
                imóvel — não de orçamento de obra. */}
            <a
              href={whatsappLink(mensagemPorRota(pathname))}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label hidden bg-accent px-5 py-3 text-accent-ink transition-[filter] duration-200 hover:brightness-110 lg:inline-block"
            >
              {ctaPorRota(pathname).curto}
            </a>

            <button
              ref={gatilhoRef}
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="sr-only">
                {aberto ? "Fechar menu" : "Abrir menu"}
              </span>
              <span aria-hidden="true" className="relative block h-3.5 w-6">
                <span
                  className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                    aberto ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-full bg-current transition-all duration-300 ${
                    aberto ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        ref={painelRef}
        data-front="engenharia"
        hidden={!aberto}
        className="fixed inset-0 z-40 bg-surface md:hidden"
      >
        <nav
          aria-label="Principal (mobile)"
          className="wrap flex h-full flex-col justify-between pb-10 pt-28"
        >
          <ul>
            {navegacao.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link href={item.href} className="block py-5 no-underline">
                  <span className="t-label block text-faint">{item.verbo}</span>
                  <span className="t-display-tight mt-2.5 block text-[2rem] text-ink">
                    {item.rotulo}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-6">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label flex w-full items-center justify-center bg-accent px-6 py-5 text-accent-ink"
            >
              WhatsApp {contato.whatsappExibicao}
            </a>
            <a
              href={contato.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label block text-muted"
            >
              {contato.instagramHandle}
            </a>
            <p className="t-label text-faint">{grupo.endereco.completo}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
