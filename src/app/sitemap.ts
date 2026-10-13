import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/engenharia`, lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/imobiliaria`, lastModified: agora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/instituto`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
  ];
}
