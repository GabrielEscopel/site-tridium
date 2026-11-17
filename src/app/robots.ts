import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    /* A area do corretor fica fora dos buscadores. Isto NAO a protege —
       robots.txt e um pedido, e quem tem o endereco entra do mesmo jeito.
       Serve so para a pagina interna nao aparecer em resultado de busca. */
    rules: { userAgent: "*", allow: "/", disallow: "/imobiliaria/corretor" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
