import type { Metadata } from "next";
import { AreaTreinamento } from "@/components/AreaTreinamento";
import { metadadosRota } from "@/lib/seo";

/* Interna, como o resto da área do corretor: fora da busca e do sitemap. */
export const metadata: Metadata = {
  ...metadadosRota({
    titulo: "Treinamento — Tridium Imóveis",
    descricao: "Formação da equipe da Tridium Imóveis.",
    caminho: "/imobiliaria/corretor/treinamento",
  }),
  robots: { index: false, follow: false },
};

export default function TreinamentoPage() {
  return (
    <div data-front="imobiliaria" className="bg-inset">
      <AreaTreinamento />
    </div>
  );
}
