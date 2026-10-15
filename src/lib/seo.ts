/* =============================================================================
   SEO — metadados e dados estruturados
   -----------------------------------------------------------------------------
   Cada rota declara o seu schema.org: LocalBusiness (engenharia),
   RealEstateAgent (imobiliária) e NGO (Instituto). Os campos que dependem de
   dado ainda não confirmado são omitidos em vez de preenchidos com placeholder
   — publicar "[CNPJ PENDENTE]" dentro de um schema é pior do que não declarar.
   ============================================================================= */

import type { Metadata } from "next";
import { SITE_URL, contato, grupo } from "@/content/site";

/** Remove chaves cujo valor ainda é um marcador [PENDENTE]. */
function semPendentes<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const saida: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim().startsWith("[")) continue;
    if (v === undefined || v === null) continue;
    saida[k] = v;
  }
  return saida as Partial<T>;
}

interface MetaRota {
  titulo: string;
  descricao: string;
  caminho: string;
  imagem?: string;
}

export function metadadosRota({
  titulo,
  descricao,
  caminho,
  imagem = "/og/grupo.png",
}: MetaRota): Metadata {
  const url = `${SITE_URL}${caminho}`;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: grupo.nome,
      title: titulo,
      description: descricao,
      images: [{ url: imagem, width: 1200, height: 630, alt: titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  };
}

/* --- Blocos schema.org ------------------------------------------------------ */

const ENDERECO = semPendentes({
  "@type": "PostalAddress",
  streetAddress: grupo.endereco.logradouro,
  addressLocality: grupo.endereco.cidade,
  addressRegion: grupo.endereco.uf,
  postalCode: grupo.endereco.cep,
  addressCountry: grupo.pais,
});

const TELEFONE = `+${contato.whatsappNumero}`;

export const schemaOrganizacao = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organizacao`,
  name: grupo.nome,
  url: SITE_URL,
  description: grupo.descricao,
  logo: `${SITE_URL}/logos/LOGO-HORIZ_1.png`,
  address: ENDERECO,
  sameAs: [contato.instagram],
  areaServed: {
    "@type": "City",
    name: grupo.cidade,
  },
};

export const schemaEngenharia = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "GeneralContractor"],
  "@id": `${SITE_URL}/engenharia#negocio`,
  name: "Tridium Engenharia",
  description:
    "Engenharia, construção, arquitetura e reforma em Florianópolis, SC.",
  url: `${SITE_URL}/engenharia`,
  telephone: TELEFONE,
  image: `${SITE_URL}/img/engenharia/hero.webp`,
  logo: `${SITE_URL}/logos/LOGO-HORIZ_1.png`,
  address: ENDERECO,
  geo: {
    "@type": "GeoCoordinates",
    latitude: grupo.geo.lat,
    longitude: grupo.geo.lng,
  },
  areaServed: [
    { "@type": "City", name: "Florianópolis" },
    { "@type": "AdministrativeArea", name: "Grande Florianópolis" },
  ],
  sameAs: [contato.instagram],
  parentOrganization: { "@id": `${SITE_URL}/#organizacao` },
  makesOffer: [
    "Construção",
    "Reforma",
    "Arquitetura e projetos",
    "Projetos especiais",
  ].map((nome) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: nome },
  })),
};

export const schemaImobiliaria = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/imobiliaria#negocio`,
  name: "Tridium Imóveis",
  description:
    "Imóveis e empreendimentos em Florianópolis avaliados pela engenharia do Grupo Tridium.",
  url: `${SITE_URL}/imobiliaria`,
  telephone: TELEFONE,
  image: `${SITE_URL}/img/imobiliaria/hero.webp`,
  address: ENDERECO,
  geo: {
    "@type": "GeoCoordinates",
    latitude: grupo.geo.lat,
    longitude: grupo.geo.lng,
  },
  areaServed: { "@type": "City", name: "Florianópolis" },
  parentOrganization: { "@id": `${SITE_URL}/#organizacao` },
};

export const schemaInstituto = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": `${SITE_URL}/instituto#organizacao`,
  name: "Instituto Tridium",
  alternateName: "Instituto Tridium — projeto social do Grupo Tridium",
  description:
    "Projeto social do Grupo Tridium para reforma e reconstrução de moradias de famílias em situação de vulnerabilidade em Florianópolis.",
  url: `${SITE_URL}/instituto`,
  telephone: TELEFONE,
  image: `${SITE_URL}/img/instituto/hero.webp`,
  address: ENDERECO,
  areaServed: { "@type": "City", name: "Florianópolis" },
  parentOrganization: { "@id": `${SITE_URL}/#organizacao` },
};

export function schemaMigalhas(
  itens: readonly { nome: string; caminho: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: `${SITE_URL}${item.caminho}`,
    })),
  };
}
