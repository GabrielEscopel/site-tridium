import type { Metadata } from "next";
import { AreaGestao } from "@/components/AreaGestao";
import { metadadosRota } from "@/lib/seo";

/* Interna, como o resto da área do corretor: fora da busca e do sitemap. */
export const metadata: Metadata = {
  ...metadadosRota({
    titulo: "Gestão — Tridium Imóveis",
    descricao: "Semana, metas e premiações da equipe da Tridium Imóveis.",
    caminho: "/imobiliaria/corretor/gestao",
  }),
  robots: { index: false, follow: false },
};

export default function GestaoPage() {
  return (
    <div data-front="imobiliaria" className="bg-inset">
      <AreaGestao />
    </div>
  );
}
