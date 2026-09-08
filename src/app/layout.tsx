import type { Metadata, Viewport } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsappFab } from "@/components/WhatsappFab";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd } from "@/components/JsonLd";
import { schemaOrganizacao } from "@/lib/seo";
import { SITE_URL, grupo } from "@/content/site";

/* =============================================================================
   TIPOGRAFIA
   -----------------------------------------------------------------------------
   Archivo (variável, com eixo de largura) para os títulos: em largura expandida
   ela reproduz a proporção larga e as terminações retas do wordmark Tridium.
   Inter para leitura corrida.
   IBM Plex Mono para rótulos e dados — é o eco direto do "ENGENHARIA E
   CONSTRUÇÃO" travado sob o logo, e traz o vocabulário de prancha técnica.
   ============================================================================= */

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${grupo.nome} — Engenharia, imóveis e impacto social em Florianópolis`,
    template: `%s · ${grupo.nome}`,
  },
  description: grupo.descricao,
  applicationName: grupo.nome,
  authors: [{ name: grupo.nome }],
  creator: grupo.nome,
  keywords: [
    "engenharia Florianópolis",
    "construtora Florianópolis",
    "reforma Florianópolis",
    "arquitetura Florianópolis",
    "imobiliária Florianópolis",
    "projeto social moradia",
    "Grupo Tridium",
    "Tridium Engenharia",
  ],
  icons: {
    icon: [{ url: "/logos/ICONE-FUNDO-ESCURO.png", type: "image/png" }],
    apple: [{ url: "/logos/ICONE-FUNDO-ESCURO.png" }],
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: grupo.nome,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#101f11",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <JsonLd dados={schemaOrganizacao} />
        <SmoothScroll />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsappFab />
      </body>
    </html>
  );
}
