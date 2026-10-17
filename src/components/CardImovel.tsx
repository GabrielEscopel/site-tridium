/* =============================================================================
   CARD DE IMÓVEL
   -----------------------------------------------------------------------------
   A ordem segue como alguém decide: foto, onde fica, o que cabe, quanto custa.
   Bairro em destaque porque em Florianópolis é o bairro que define a vida —
   Centro e Campeche são cidades diferentes dentro da mesma cidade.

   O código fica sobre a foto, no canto que o olho varre primeiro. É por ele
   que a conversa começa no telefone e no WhatsApp: a pessoa não descreve o
   imóvel, ela diz o código.
   ============================================================================= */

import Link from "next/link";
import { formatarPreco, type Imovel } from "@/content/imobiliaria";
import { CarrosselFotos } from "./CarrosselFotos";

export function CardImovel({
  imovel,
  prioridade = false,
}: {
  imovel: Imovel;
  prioridade?: boolean;
}) {
  return (
    <article className="group h-full border border-line bg-surface transition-colors duration-200 hover:border-accent">
      <Link
        href={`/imobiliaria/${imovel.chave}`}
        className="flex h-full flex-col no-underline"
      >
        <div className="relative">
          <CarrosselFotos
            fotos={imovel.fotos}
            prioridade={prioridade}
            className="aspect-[4/3] w-full"
          />

          <span className="t-label absolute left-3 top-3 z-10 bg-accent px-2.5 py-1 text-accent-ink">
            <span className="sr-only">Código </span>
            {imovel.codigo}
          </span>

          {/* Selos do outro lado: dois blocos no mesmo canto disputariam o
              olho, e o código precisa ganhar essa disputa. */}
          {imovel.selos && imovel.selos.length > 0 && (
            <ul className="absolute right-3 top-3 z-10 flex flex-wrap justify-end gap-2">
              {imovel.selos.map((selo) => (
                <li
                  key={selo}
                  className="t-label bg-black/70 px-2.5 py-1 text-white"
                >
                  {selo}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="t-label text-faint">
            {imovel.tipo} · {imovel.cidade}
          </p>

          <h3 className="t-display-tight fs-card mt-2 text-ink transition-colors duration-200 group-hover:text-accent-texto">
            {imovel.bairro}
          </h3>

          <p className="t-body mt-3 line-clamp-2 text-muted">{imovel.resumo}</p>

          <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
            {imovel.dormitorios > 0 && (
              <Ficha rotulo="quartos" valor={imovel.dormitorios} />
            )}
            <Ficha rotulo="m²" valor={imovel.area} juntoAoRotulo />
            {imovel.vagas > 0 && <Ficha rotulo="vagas" valor={imovel.vagas} />}
          </dl>

          <p className="t-display-tight fs-card mt-auto pt-5 text-accent-texto">
            {formatarPreco(imovel.preco)}
          </p>
        </div>
      </Link>
    </article>
  );
}

function Ficha({
  rotulo,
  valor,
  juntoAoRotulo = false,
}: {
  rotulo: string;
  valor: number;
  juntoAoRotulo?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{rotulo}</dt>
      <dd className="text-sm text-ink">
        <span className="font-medium">{valor}</span>
        <span className={juntoAoRotulo ? "" : " "} />
        <span className="t-label ml-1 text-faint">{rotulo}</span>
      </dd>
    </div>
  );
}
