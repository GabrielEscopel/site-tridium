import type { Metadata } from "next";
import { AreaCorretor } from "@/components/AreaCorretor";
import { metadadosRota } from "@/lib/seo";

/* A área do corretor é interna: não entra na busca nem no sitemap, e não
   deve aparecer em resultado nenhum. `noindex` não esconde a página de quem
   tem o endereço — isso é trabalho da sessão, não do robô. */
export const metadata: Metadata = {
  ...metadadosRota({
    titulo: "Área do corretor — Tridium Imóveis",
    descricao: "Acesso interno da equipe da Tridium Imóveis.",
    caminho: "/imobiliaria/corretor",
  }),
  robots: { index: false, follow: false },
};

export default function CorretorPage() {
  return (
    <div data-front="imobiliaria" className="bg-inset">
      <AreaCorretor />
    </div>
  );
}
