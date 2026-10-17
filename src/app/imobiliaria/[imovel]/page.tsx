import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CarrosselFotos } from "@/components/CarrosselFotos";
import { JsonLd } from "@/components/JsonLd";
import { MapaImovel } from "@/components/MapaImovel";
import { Reveal } from "@/components/Reveal";
import { Botao, Pendente, Rotulo } from "@/components/ui";
import {
  buscarImovel,
  formatarPreco,
  imoveis,
  resumirImovel,
} from "@/content/imobiliaria";
import { contato, SITE_URL, whatsappLink } from "@/content/site";
import { metadadosRota, schemaMigalhas } from "@/lib/seo";

/* Gera uma página estática por imóvel da carteira. */
export function generateStaticParams() {
  return imoveis.map((i) => ({ imovel: i.chave }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ imovel: string }>;
}): Promise<Metadata> {
  const { imovel: chave } = await params;
  const imovel = buscarImovel(chave);
  if (!imovel) return {};

  return metadadosRota({
    titulo: `${imovel.tipo} no ${imovel.bairro}, ${imovel.cidade} — ${imovel.area} m²`,
    descricao: `${resumirImovel(imovel)}. ${formatarPreco(imovel.preco)}. Avaliado pela engenharia do Grupo Tridium.`,
    caminho: `/imobiliaria/${imovel.chave}`,
    imagem: imovel.fotos[0]?.src ?? "/og/imobiliaria.png",
  });
}

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ imovel: string }>;
}) {
  const { imovel: chave } = await params;
  const imovel = buscarImovel(chave);
  if (!imovel) notFound();

  const mensagem = `Olá! Vim pelo site do Grupo Tridium e tenho interesse no ${imovel.tipo.toLowerCase()} no bairro ${imovel.bairro} (${imovel.area} m²).`;

  return (
    <div data-front="imobiliaria" className="bg-surface">
      <JsonLd
        dados={[
          {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: `${imovel.tipo} no ${imovel.bairro}`,
            description: imovel.resumo,
            url: `${SITE_URL}/imobiliaria/${imovel.chave}`,
            ...(imovel.preco !== null && {
              offers: {
                "@type": "Offer",
                price: imovel.preco,
                priceCurrency: "BRL",
              },
            }),
            address: {
              "@type": "PostalAddress",
              addressLocality: imovel.cidade,
              addressRegion: "SC",
              addressCountry: "BR",
            },
          },
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Imóveis", caminho: "/imobiliaria" },
            {
              nome: `${imovel.tipo} no ${imovel.bairro}`,
              caminho: `/imobiliaria/${imovel.chave}`,
            },
          ]),
        ]}
      />

      {/* ================= CABEÇALHO ================= */}
      <section className="pt-24 md:pt-28">
        <div className="wrap py-10 md:py-14">
          <Link
            href="/imobiliaria"
            className="t-label group inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-accent-texto"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
            >
              ←
            </span>
            Voltar à carteira
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Rotulo>
                {imovel.tipo} · {imovel.situacao}
              </Rotulo>
              <h1 className="t-display fs-hero mt-5 text-ink">
                {imovel.bairro}
              </h1>
              <p className="t-lead mt-4 text-muted">
                {imovel.cidade} · {resumirImovel(imovel)}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="t-display-tight fs-secao text-accent-texto">
                {formatarPreco(imovel.preco)}
              </p>
              {(imovel.condominio || imovel.iptu) && (
                <p className="t-label mt-3 text-faint">
                  {imovel.condominio &&
                    `Condomínio ${formatarPreco(imovel.condominio)}`}
                  {imovel.condominio && imovel.iptu && " · "}
                  {imovel.iptu && `IPTU ${formatarPreco(imovel.iptu)}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOTOS E MAPA =================
          Lado a lado: a foto mostra o imóvel, o mapa mostra a vida em volta.
          Em Florianópolis a segunda pergunta é sempre "mas fica onde?". */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <CarrosselFotos
              fotos={imovel.fotos}
              prioridade
              className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[32rem]"
            />
            <MapaImovel
              endereco={imovel.endereco}
              className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[32rem]"
            />
          </div>
        </div>
      </section>

      {/* ================= FICHA E DESCRIÇÃO ================= */}
      <section className="pb-20 md:pb-28">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
            <Reveal className="max-w-[62ch]">
              <h2 className="t-label text-accent-texto">Sobre o imóvel</h2>
              <div className="mt-6 space-y-5">
                {imovel.descricao.map((paragrafo, i) => (
                  <p key={i} className="t-body text-muted">
                    {paragrafo}
                  </p>
                ))}
              </div>

              {imovel.diferenciais.length > 0 && (
                <>
                  <h3 className="t-label mt-12 text-accent-texto">
                    Diferenciais
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {imovel.diferenciais.map((d) => (
                      <li
                        key={d}
                        className="border border-line px-3 py-1.5 text-sm text-ink"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* O que nenhuma outra imobiliária entrega junto do anúncio. */}
              {imovel.laudo && (
                <div className="mt-14 border-l-2 border-accent bg-raised p-6 md:p-8">
                  <h3 className="t-label text-accent-texto">
                    Avaliação da engenharia
                  </h3>
                  <p className="t-body mt-4 text-muted">{imovel.laudo}</p>
                  <p className="mt-5">
                    <Pendente titulo="src/content/imobiliaria.ts">
                      Laudo pendente
                    </Pendente>
                  </p>
                </div>
              )}
            </Reveal>

            <Reveal as="dl" className="lg:w-72">
              <Linha rotulo="Tipo" valor={imovel.tipo} />
              <Linha rotulo="Bairro" valor={imovel.bairro} />
              <Linha rotulo="Área privativa" valor={`${imovel.area} m²`} />
              {imovel.dormitorios > 0 && (
                <Linha rotulo="Dormitórios" valor={String(imovel.dormitorios)} />
              )}
              {imovel.suites ? (
                <Linha rotulo="Suítes" valor={String(imovel.suites)} />
              ) : null}
              {imovel.vagas > 0 && (
                <Linha rotulo="Vagas" valor={String(imovel.vagas)} />
              )}
              <Linha rotulo="Situação" valor={imovel.situacao} />

              <div className="pt-8">
                <Botao
                  href={whatsappLink(mensagem)}
                  externo
                  ariaLabel={`Falar sobre este imóvel no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
                  className="w-full"
                >
                  Agendar visita
                </Botao>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
      <dt className="t-label text-faint">{rotulo}</dt>
      <dd className="text-sm text-ink">{valor}</dd>
    </div>
  );
}
