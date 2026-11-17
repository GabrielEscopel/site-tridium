"use client";

/* Esconde o que é do site público quando a rota é interna. Existe porque o
   Footer é componente de servidor e não pode decidir isso sozinho — ele
   chega aqui como children e este invólucro, que roda no navegador, é quem
   olha a rota. */

import { usePathname } from "next/navigation";
import { rotaInterna } from "@/lib/rotaInterna";

export function SomenteNoSite({ children }: { children: React.ReactNode }) {
  if (rotaInterna(usePathname())) return null;
  return <>{children}</>;
}
