import type { MetadataRoute } from "next";
import { imoveis } from "@/content/imobiliaria";
import { projetos } from "@/content/instituto";
import { SITE_URL } from "@/content/site";

/* As páginas internas saem dos próprios dados: imóvel novo na carteira ou
   projeto novo no Instituto entram no sitemap sozinhos. Lista escrita à mão é
   lista que fica velha. */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/engenharia`, lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/imobiliaria`, lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/instituto`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },

    ...imoveis.map((imovel) => ({
      url: `${SITE_URL}/imobiliaria/${imovel.chave}`,
      lastModified: agora,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),

    ...projetos.map((projeto) => ({
      url: `${SITE_URL}/instituto/${projeto.chave}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
