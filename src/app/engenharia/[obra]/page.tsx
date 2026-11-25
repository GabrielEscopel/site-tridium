import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CarrosselCapa } from "@/components/CarrosselCapa";
import type { FotoCard } from "@/components/CarrosselFotos";
import { FotoPendente } from "@/components/FotoPendente";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Botao, Pendente, Rotulo } from "@/components/ui";
import type { FrenteDeObra } from "@/components/GaleriaCases";
import { buscarCase, cases, casesComPagina } from "@/content/engenharia";
import {
  contato,
  mensagensWhatsapp,
  SITE_URL,
  whatsappLink,
} from "@/content/site";
import { metadadosRota, schemaMigalhas } from "@/lib/seo";

/* =============================================================================
   PÁGINA DE OBRA — o case aprofundado
   -----------------------------------------------------------------------------
   Uma página estática por obra QUE TENHA CONTEÚDO para uma. `casesComPagina`
   filtra pelo campo `pagina` do case, então obra sem o campo não gera rota e
   o card dela na galeria continua sem link — em vez de abrir uma página vazia
   com o nome de um cliente real em cima.

   A página serve a duas pessoas ao mesmo tempo. Quem já conhece a Tridium
   quer ver a obra; quem chegou do buscador procurando "reforma em shopping
   center" quer saber se a casa sabe fazer aquilo. Por isso a ordem é: a obra
   primeiro, o método depois, o FAQ no fim — e o FAQ vira schema, que é o que
   o buscador mostra como resposta.
   ============================================================================= */

export function generateStaticParams() {
  return casesComPagina.map((c) => ({ obra: c.chave }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ obra: string }>;
}): Promise<Metadata> {
  const { obra: chave } = await params;
  const obra = buscarCase(chave);
  if (!obra) return {};

  return metadadosRota({
    titulo: `${obra.nome} — ${obra.categoria} | Tridium Engenharia`,
    descricao: obra.resumo,
    caminho: `/engenharia/${obra.chave}`,
    imagem: "/og/engenharia.png",
  });
}

export default async function ObraPage({
  params,
}: {
  params: Promise<{ obra: string }>;
}) {
  const { obra: chave } = await params;
  const obra = buscarCase(chave);
  if (!obra?.pagina) notFound();

  const { pagina } = obra;
  const pendente = (v: string) => v.startsWith("[");
  const outras = cases.filter((c) => c.pagina && c.chave !== obra.chave);

  return (
    <div data-front="engenharia" className="bg-surface">
      <JsonLd
        dados={[
          schemaMigalhas([
            { nome: "Grupo Tridium", caminho: "/" },
            { nome: "Engenharia", caminho: "/engenharia" },
            { nome: obra.nome, caminho: `/engenharia/${obra.chave}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Project",
            name: obra.nome,
            description: obra.resumo,
            url: `${SITE_URL}/engenharia/${obra.chave}`,
            parentOrganization: { "@id": `${SITE_URL}/engenharia#engenharia` },
          },
          /* O FAQ só vira schema se houver FAQ. Marcação de página vazia é
             o tipo de coisa que o buscador pune em vez de premiar. */
          ...(pagina.faq && pagina.faq.length > 0
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: pagina.faq.map((f) => ({
                    "@type": "Question",
                    name: f.pergunta,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.resposta,
                    },
                  })),
                },
              ]
            : []),
        ]}
      />

      {/* ================= CAPA ================= */}
      <CarrosselCapa
        rotulo={`Fotos da obra ${obra.nome}`}
        itens={(obra.capa ? [obra.capa, ...obra.fotos] : obra.fotos).map(
          (foto, i) => ({
            chave: `${foto.src}-${i}`,
            imagem: foto.src,
            posicao: foto.posicao,
            provisoria: foto.provisoria,
            descricaoPendente: foto.alt,
            /* A legenda da capa diz o que a foto mostra. Quando a foto não
               tem `alt` — o campo é opcional em FotoCard —, entra o nome da
               obra: legenda vazia deixaria a faixa inferior da capa com um
               espaço sem explicação. */
            titulo: foto.alt ?? obra.nome,
            etiqueta: obra.categoria,
          })
        )}
      >
        <Link
          href="/engenharia"
          className="t-label group inline-flex items-center gap-3 text-muted no-underline transition-colors duration-200 hover:text-accent-texto"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
          >
            ←
          </span>
          Voltar à Engenharia
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-8 shrink-0 bg-accent" aria-hidden="true" />
          <Rotulo>
            {obra.categoria} · {obra.local}
          </Rotulo>
        </div>

        <h1 className="t-display fs-hero mt-6 text-ink">{obra.nome}</h1>
        <p className="t-lead mt-5 max-w-[52ch] text-muted">{pagina.chamada}</p>
      </CarrosselCapa>

      <div className="wrap space-y-20 py-20 md:space-y-28 md:py-28">
        {/* ================= A OBRA =================
            Texto à esquerda, ficha à direita. A ficha é o que um comprador
            técnico procura primeiro, e ela não esconde o que falta: campo
            [A CONFIRMAR] aparece marcado, em vez de sumir da lista e dar a
            impressão de que a obra não tem área nem ano. */}
        <Bloco titulo="A obra">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
            <div>
              <p className="t-body max-w-[60ch] text-muted">{obra.descricao}</p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {obra.escopo.map((e) => (
                  <li
                    key={e}
                    className="border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted"
                  >
                    {e}
                  </li>
                ))}
              </ul>

              {/* OS NÚMEROS, logo abaixo da descrição. São o que a
                  administração de um shopping lê primeiro — e são também o
                  que preenche o vazio que sobrava: a descrição é curta e a
                  ficha, estreita, deixavam metade da largura em branco. */}
              {pagina.numeros && pagina.numeros.length > 0 && (
                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-4">
                  {pagina.numeros.map((n) => (
                    <div key={n.rotulo}>
                      <dt className="sr-only">{n.rotulo}</dt>
                      <dd>
                        <span className="t-display-tight block fs-bloco text-accent-texto">
                          {n.valor}
                        </span>
                        <span className="mt-1.5 block max-w-[18ch] text-xs leading-snug text-muted">
                          {n.rotulo}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <dl className="shrink-0 space-y-5 border-t border-line pt-6 lg:w-[19rem] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {pagina.ficha.map((campo) => (
                <div key={campo.rotulo}>
                  <dt className="t-label text-faint">{campo.rotulo}</dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-snug text-ink">
                    {pendente(campo.valor) ? (
                      <Pendente>A confirmar</Pendente>
                    ) : (
                      campo.valor
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Bloco>

        {/* ================= AS FRENTES =================
            A parte visual da página, e a razão de ela existir: quem abre o
            link vê o que foi feito antes de ler. Em grade, porque uma obra
            de dez anos não é uma história linear — são serviços diferentes
            que se reconhecem pela imagem. */}
        {pagina.frentes && pagina.frentes.length > 0 && (
          <Bloco titulo="O que foi feito">
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {pagina.frentes.map((f) => (
                <li key={f.titulo}>
                  <Frente frente={f} />
                </li>
              ))}
            </ul>
          </Bloco>
        )}

        {/* ================= O APROFUNDAMENTO ================= */}
        {pagina.secoes.map((secao) => (
          <Bloco key={secao.titulo} titulo={secao.titulo}>
            {secao.texto && (
              <p className="t-body max-w-[62ch] text-muted">{secao.texto}</p>
            )}
            {secao.itens && (
              <ul className="mt-8 grid gap-4 md:grid-cols-2 md:gap-x-10">
                {secao.itens.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 bg-accent"
                    />
                    <span className="t-body max-w-[46ch] leading-relaxed text-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Bloco>
        ))}

        {/* O CARROSSEL DE REGISTRO SAIU DAQUI. Ele repetia as mesmas três
            fotos que já abrem a página na capa e que agora aparecem, uma a
            uma e com legenda própria, nas frentes de obra — e ficava solto
            no meio da leitura, uma foto grande sem dizer de quê. */}

        {/* ================= O QUE A CASA FAZ ================= */}
        {pagina.servicos && pagina.servicos.length > 0 && (
          <Bloco titulo={pagina.tituloServicos ?? "O que a Tridium faz"}>
            <ul className="grid gap-x-10 gap-y-8 md:grid-cols-2">
              {pagina.servicos.map((s) => (
                <li key={s.titulo} className="border-t border-line pt-5">
                  <h3 className="t-display-tight fs-card text-ink">
                    {s.titulo}
                  </h3>
                  <p className="t-body mt-3 max-w-[44ch] text-muted">
                    {s.texto}
                  </p>
                </li>
              ))}
            </ul>
          </Bloco>
        )}

        {/* ================= FAQ =================
            Em <details>, e não num acordeão de JavaScript: funciona sem
            script, abre com busca do navegador e o buscador lê o conteúdo
            inteiro mesmo fechado. */}
        {pagina.faq && pagina.faq.length > 0 && (
          <Bloco titulo="Perguntas frequentes">
            <ul className="max-w-[62rem] space-y-0">
              {pagina.faq.map((f) => (
                <li key={f.pergunta} className="border-t border-line">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-ink marker:hidden">
                      <span className="t-display-tight fs-card">
                        {f.pergunta}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-accent-texto transition-transform duration-300 ease-out group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="t-body max-w-[58ch] pb-6 text-muted">
                      {f.resposta}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Bloco>
        )}
      </div>

      {/* ================= SAÍDA ================= */}
      <section className="bg-inset py-16 md:py-20">
        <div className="wrap">
          <Reveal>
            <h2 className="t-label text-accent-texto">
              Tem uma obra parecida?
            </h2>
            <p className="t-lead mt-6 max-w-[46ch] text-ink">
              Obra em prédio que não pode fechar tem um jeito próprio de ser
              planejada. Conte o que você precisa e a gente diz como caberia.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              <Botao
                href={whatsappLink(mensagensWhatsapp.engenharia)}
                externo
                ariaLabel={`Falar com a Tridium Engenharia no WhatsApp ${contato.whatsappExibicao} (abre em nova aba)`}
              >
                Pedir um orçamento
              </Botao>

              {outras.map((c) => (
                <Link
                  key={c.chave}
                  href={`/engenharia/${c.chave}`}
                  className="t-display-tight group fs-card inline-flex items-center gap-3 text-ink no-underline transition-colors duration-200 hover:text-accent-texto"
                >
                  {c.nome}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   UMA FRENTE DE OBRA
   -----------------------------------------------------------------------------
   Foto em cima, título e texto embaixo. Três estados, nesta ordem de
   preferência:

     ANTES E DEPOIS  o par lado a lado, rotulado. Num retrofit é o argumento
                     mais forte que existe, e o descritivo do cliente pede.
     FOTO            a imagem da frente, sozinha.
     PENDENTE        o painel que diz QUAL foto falta. Nunca foto de banco:
                     uma imagem genérica de obra sob a legenda "praça de
                     alimentação do Floripa Shopping" passa por real, e esta
                     página vai para administração de shopping.
   ----------------------------------------------------------------------------- */

function Frente({ frente }: { frente: FrenteDeObra }) {
  const par = frente.antes && frente.depois;

  return (
    <article>
      {par ? (
        <div className="grid grid-cols-2 gap-1.5">
          <Lado foto={frente.antes!} rotulo="Antes" />
          <Lado foto={frente.depois!} rotulo="Depois" />
        </div>
      ) : frente.foto ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-inset">
          <Image
            src={frente.foto.src}
            alt={frente.foto.alt ?? frente.titulo}
            fill
            sizes="(min-width: 1024px) 23rem, (min-width: 640px) 45vw, 100vw"
            className="object-cover"
            style={
              frente.foto.posicao
                ? { objectPosition: frente.foto.posicao }
                : undefined
            }
          />
        </div>
      ) : (
        <FotoPendente
          className="aspect-[4/3]"
          descricao={frente.fotoPendente ?? frente.titulo}
        />
      )}

      <div className="mt-5 flex items-baseline gap-3">
        {frente.quando && (
          <span className="shrink-0 font-mono text-xs font-bold text-accent-texto">
            {frente.quando}
          </span>
        )}
        <h3 className="t-display-tight fs-card text-ink">{frente.titulo}</h3>
      </div>
      <p className="t-body mt-3 text-muted">{frente.texto}</p>
    </article>
  );
}

function Lado({ foto, rotulo }: { foto: FotoCard; rotulo: string }) {
  return (
    <figure className="relative aspect-[3/4] overflow-hidden bg-inset">
      <Image
        src={foto.src}
        alt={`${rotulo}: ${foto.alt ?? ""}`}
        fill
        sizes="(min-width: 1024px) 11rem, 22vw"
        className="object-cover"
        style={foto.posicao ? { objectPosition: foto.posicao } : undefined}
      />
      <figcaption className="absolute left-1.5 top-1.5 bg-black/60 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-white">
        {rotulo}
      </figcaption>
    </figure>
  );
}

/* O mesmo bloco do corpo de projeto do Instituto: rótulo, fio e um respiro
   grande antes do próximo. Sem essa marcação a página vira texto corrido e
   não se vê onde um assunto termina e o outro começa. */
function Bloco({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section>
        {/* SEM `shrink-0` NO TÍTULO, e com quebra de linha permitida.
            A estrutura veio do corpo de projeto do Instituto, onde os
            títulos são curtos — "O projeto", "Contemplados". Aqui eles são
            frases inteiras, e `t-label` as põe em caixa-alta com 0,22em de
            espaçamento: travado contra o encolhimento, "TRABALHO NOTURNO É
            A ESPECIALIDADE, NÃO O DETALHE" media 462px numa tela de 375 e
            dava rolagem horizontal na página toda.

            Com `flex-wrap`, título comprido ocupa a linha e o fio desce
            para a seguinte, virando um filete sob o título. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h2 className="t-label max-w-full text-accent-texto">{titulo}</h2>
          <span
            className="h-px min-w-[3rem] flex-1 bg-line"
            aria-hidden="true"
          />
        </div>
        <div className="mt-8">{children}</div>
      </section>
    </Reveal>
  );
}
