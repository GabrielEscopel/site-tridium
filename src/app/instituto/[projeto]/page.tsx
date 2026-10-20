import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Bloco, CorpoProjeto } from "@/components/CorpoProjeto";
import { JornadaCapitulos } from "@/components/JornadaCapitulos";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Rotulo } from "@/components/ui";
import { buscarProjeto, instituto, projetos } from "@/content/instituto";
import {
  contato,
  mensagensWhatsapp,
  SITE_URL,
  whatsappLink,
} from "@/content/site";
import { metadadosRota, schemaMigalhas } from "@/lib/seo";

/* Uma página estática por projeto do Instituto. */
export function generateStaticParams() {
  return projetos.map((p) => ({ projeto: p.chave }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projeto: string }>;
}): Promise<Metadata> {
  const { projeto: chave } = await params;
  const projeto = buscarProjeto(chave);
  if (!projeto) return {};

  return metadadosRota({
    titulo: `${projeto.nome} — Instituto Tridium`,
    descricao: projeto.resumo,
    caminho: `/instituto/${projeto.chave}`,
    imagem: "/og/instituto.png",
  });
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ projeto: string }>;
}) {
  const { projeto: chave } = await params;
  const projeto = buscarProjeto(chave);
  if (!projeto) notFound();

  return (
    <div data-front="instituto" className="bg-surface">
      <JsonLd
        dados={[
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Instituto", caminho: "/instituto" },
            { nome: projeto.nome, caminho: `/instituto/${projeto.chave}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Project",
            name: projeto.nome,
            description: projeto.resumo,
            url: `${SITE_URL}/instituto/${projeto.chave}`,
            parentOrganization: { "@id": `${SITE_URL}/instituto#instituto` },
          },
        ]}
      />

      {/* ================= CABEÇALHO ================= */}
      <section className="pt-24 md:pt-28">
        <div className="wrap py-10 md:py-14">
          <Link
            href="/instituto"
            className="t-label group inline-flex items-center gap-3 text-muted transition-colors duration-200 hover:text-accent-texto"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
            >
              ←
            </span>
            Voltar ao Instituto
          </Link>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
            <Rotulo>Projeto do Instituto Tridium</Rotulo>
          </div>

          <h1 className="t-display fs-hero mt-6 text-ink">{projeto.nome}</h1>
          <p className="t-lead mt-5 max-w-[52ch] text-muted">{projeto.resumo}</p>
        </div>
      </section>

      {/* ================= O PROJETO =================
          Todos os projetos passam pelo mesmo corpo, na mesma ordem. */}
      <div className="wrap space-y-20 pb-20 md:space-y-28 md:pb-28">
        <CorpoProjeto projeto={projeto}>
          {projeto.temJornada && (
            <Bloco titulo={instituto.jornada.rotulo}>
              <Reveal>
                <h3 className="t-display-tight fs-secao text-ink">
                  {instituto.jornada.titulo}
                </h3>
                <p className="t-lead mt-5 max-w-[46ch] text-muted">
                  {instituto.jornada.texto}
                </p>
              </Reveal>
              <div className="mt-12">
                <JornadaCapitulos capitulos={instituto.capitulos} />
              </div>
            </Bloco>
          )}
        </CorpoProjeto>
      </div>

      {/* ================= OUTROS PROJETOS =================
          Saída no fim da leitura: quem chegou até aqui pelo Instagram não
          veio pelo índice e não sabe que existem outros. */}
      <section className="bg-inset py-16 md:py-20">
        <div className="wrap">
          <Reveal>
            <h2 className="t-label text-accent-texto">Outros projetos</h2>

            <ul className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
              {projetos
                .filter((p) => p.chave !== projeto.chave)
                .map((p) => (
                  <li key={p.chave}>
                    <Link
                      href={`/instituto/${p.chave}`}
                      className="t-display-tight group fs-card inline-flex items-center gap-3 text-ink no-underline transition-colors duration-200 hover:text-accent-texto"
                    >
                      {p.nome}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>

            <div className="mt-10">
              <Botao
                href={whatsappLink(mensagensWhatsapp.instituto)}
                externo
                ariaLabel={`Falar sobre o Instituto no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
              >
                Quero ajudar
              </Botao>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
