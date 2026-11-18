"use client";

/* =============================================================================
   TREINAMENTO — a formação do corretor
   -----------------------------------------------------------------------------
   Área própria, com cabeçalho próprio: a marca da Tridium Imóveis no canto
   superior esquerdo e, abaixo dela, a sequência inteira do treinamento.

   A LÓGICA é a do trabalho, não a de um índice: os nove módulos seguem a
   ordem em que um imóvel passa pela imobiliária, da captação ao jurídico.
   Quem termina o módulo 1 sabe captar; quem termina o 6 sabe fechar. Por
   isso cada módulo abre com um OBJETIVO escrito como capacidade — "ao fim
   deste módulo você sabe fazer X" — e não como assunto.

   Cada tópico vira uma AULA que se marca como concluída. A marcação é do
   navegador de quem estudou e não chega à Tridium; ver progressoTreinamento
   para o porquê e para o que falta.

   O conteúdo é o mesmo de content/corretor.ts que o painel já usava. Não há
   duas versões a manter: módulo, aula ou card novo entra lá e aparece aqui.
   ============================================================================= */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  iniciaisDe,
  perfilDoUsuario,
  procedimentos,
  tempoDeMercado,
  type BlocoAula,
  type CardProcedimento,
  type MetaCorretor,
  type PerfilCorretor,
} from "@/content/corretor";
import { marcas } from "@/content/site";
import { useMetasCorretor } from "@/lib/metasCorretor";
import { useProgressoTreinamento } from "@/lib/progressoTreinamento";
import { useSessaoCorretor } from "@/lib/sessaoCorretor";
import { iconeDaCategoria } from "./IconesImovel";

export function AreaTreinamento() {
  const { sessao, pronto: sessaoPronta, sair } = useSessaoCorretor();
  const progresso = useProgressoTreinamento();
  const [moduloAberto, setModuloAberto] = useState(procedimentos[0].chave);

  if (!sessaoPronta) return <div className="min-h-[70svh]" aria-hidden="true" />;

  /* Sem sessão, não se mostra o treinamento nem se finge que ele não existe:
     a pessoa é mandada para a porta. Isto não é segurança — é cortesia de
     navegação. Quem quiser o conteúdo pega no código da página. */
  if (!sessao) return <SemAcesso />;

  const modulo =
    procedimentos.find((m) => m.chave === moduloAberto) ?? procedimentos[0];

  return (
    <div className="carteira min-h-screen">
      {/* ================= CABEÇALHO =================
          CONGELADO NO TOPO: o treinamento é uma página longa, e a faixa com
          as duas marcas, o painel e o sair precisa estar à mão em qualquer
          altura dela.

          ESCURO, e isso não é escolha de gosto. A marca da Sinos tem o
          lettering BRANCO e o telhado amarelo — foi desenhada para fundo
          escuro e some num claro. A da Tridium tem as duas versões. Então o
          fundo que deixa as duas conviverem é o verde-mata do grupo, que é
          também onde o amarelo do telhado e o ouro da Tridium se encontram.
          `sobre-foto` reaproveita a inversão de paleta que o resto do site já
          usa sobre fundo escuro. */}
      <header className="sticky top-0 z-40 shadow-[var(--cart-sombra-alta)]">
        {/* FAIXA DE CIMA, escura: as marcas e os botoes de sessao. */}
        <div className="sobre-foto border-b border-white/10 bg-[color:var(--cart-barra)]">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 py-3">
          {/* AS DUAS MARCAS, lado a lado, separadas só por um fio. A da casa
              primeiro: esta é a área da Tridium, a Sinos entra como parceira.

              AS ALTURAS SÃO DIFERENTES DE PROPÓSITO, e é isso que faz as duas
              parecerem do mesmo tamanho. A da Tridium é deitada e a palavra
              ocupa 59% do arquivo; a da Sinos é empilhada, com telhado em
              cima e "imóveis" embaixo, e a palavra ocupa 53,8%. Igualar a
              ALTURA DO ARQUIVO deixaria "Sinos" menor que "Tridium" — o que
              o olho compara é a letra, não a caixa.

              Medido nos dois arquivos: com a Tridium a 32px a palavra dela
              tem 18,9px, e a Sinos precisa de 35px para chegar ao mesmo; a
              36px, 40px.

              A SUBIDA ajusta o registro vertical. Centradas pela caixa, as
              duas palavras ficavam 8px fora: a da Sinos nasce mais abaixo no
              arquivo dela, porque tem o telhado em cima. Alinhar as bases ao
              milimetro, porem, deixava a marca parecendo alta demais na
              faixa — o telhado puxa a massa visual para cima. Por isso a
              subida ficou em 5px, e nao nos 9px do calculo: a palavra da
              Sinos termina 5,5px abaixo da Tridium, e e assim que as duas
              parecem assentadas.

              A Sinos tambem entra 14% maior na palavra. Marca empilhada, com
              telhado e assinatura minuscula, le menor que uma deitada do
              mesmo tamanho; o excesso compensa isso sem distorcer nada.
              Como e `translate`, nao mexe na altura da faixa. */}
          <div className="flex min-w-0 items-center gap-3 md:gap-4">
            <Link href="/imobiliaria/corretor" className="shrink-0 no-underline">
              <Image
                src={marcas.imobiliaria.escuro}
                alt="Tridium Imóveis — voltar ao painel"
                width={190}
                height={44}
                priority
                className="h-8 w-auto md:h-9"
              />
            </Link>

            <span
              aria-hidden="true"
              className="h-8 w-px shrink-0 bg-white/20 md:h-9"
            />

            <Image
              src="/logos/parceiro-sinos.webp"
              alt="Sinos Imóveis"
              width={310}
              height={160}
              priority
              className="h-[39px] w-auto shrink-0 -translate-y-[4px] md:h-11 md:-translate-y-[5px]"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-white/70 sm:inline">
              {sessao.usuario}
            </span>
            <Link
              href="/imobiliaria/corretor"
              className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white no-underline transition-colors duration-200 hover:border-white/60 hover:bg-white/10"
            >
              Painel
            </Link>
            <button
              type="button"
              onClick={sair}
              className="rounded-xl bg-[color:var(--cart-acao)] px-4 py-2.5 text-sm font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90"
            >
              Sair
            </button>
          </div>
        </div>
        </div>

        {/* FAIXA DE BAIXO, clara: os modulos, com o nome escrito.

            Eles estavam na faixa escura, espremidos entre as marcas e os
            botoes, e so cabia o numero. Aqui a faixa e inteira deles, entao
            cabe "MODULO 01 / Captacao" em todos — e ninguem precisa decorar
            que o 06 e Fechamento.

            Continua dentro do mesmo <header> congelado: duas faixas que
            grudam juntas, sem precisar calcular a altura de uma para
            deslocar a outra. */}
        <div className="border-b border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)]">
          <div className="wrap">
            <TrilhaDeModulos
              moduloAberto={modulo.chave}
              aoEscolher={setModuloAberto}
              progresso={progresso}
            />
          </div>
        </div>
      </header>

      {/* ================= CORPO =================
          À esquerda, quem está estudando: foto, CRECI, formação, tempo de
          mercado e o progresso. À direita, o módulo escolhido lá em cima.

          A coluna da esquerda era a trilha dos módulos; ela subiu para a
          faixa verde, que fica congelada e acompanha a rolagem — navegação
          que some quando se desce a página não serve para quem está lendo
          um módulo longo. */}
      <div className="wrap py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[19rem_1fr] lg:gap-8">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Perfil
              perfil={perfilDoUsuario(sessao.usuario)}
              progresso={progresso}
            />
          </div>

          <Modulo
            modulo={modulo}
            progresso={progresso}
            aoAvancar={() => {
              const i = procedimentos.findIndex((m) => m.chave === modulo.chave);
              const prox = procedimentos[i + 1];
              if (prox) {
                setModuloAberto(prox.chave);
                window.scrollTo({ top: 0, behavior: "instant" });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   PEÇAS
   -------------------------------------------------------------------------- */

type Progresso = ReturnType<typeof useProgressoTreinamento>;

function SemAcesso() {
  return (
    <section className="carteira flex min-h-[80svh] items-center py-16">
      <div className="wrap text-center">
        <h1 className="t-display-tight fs-bloco text-[color:var(--ink)]">
          Entre para ver o treinamento.
        </h1>
        <p className="t-body mx-auto mt-4 max-w-[42ch] text-[color:var(--ink-muted)]">
          Esta área é da equipe da Tridium Imóveis.
        </p>
        <Link
          href="/imobiliaria/corretor"
          className="mt-8 inline-block rounded-xl bg-[color:var(--cart-acao)] px-6 py-3 text-[0.9375rem] font-bold text-[color:var(--cart-acao-ink)] no-underline transition-opacity duration-200 hover:opacity-90"
        >
          Ir para o acesso
        </Link>
      </div>
    </section>
  );
}

/* A navegacao do treinamento, na faixa clara logo abaixo das marcas.

   Cada chip traz o numero E o nome: a faixa e inteira deles, entao cabe, e
   "Modulo 06" sozinho nao diz nada a quem ainda nao decorou a sequencia.

   Modulo concluido troca o numero pelo visto. Em tela estreita a fileira
   rola na horizontal, com o modulo aberto trazido para a vista. */
function TrilhaDeModulos({
  moduloAberto,
  aoEscolher,
  progresso,
}: {
  moduloAberto: string;
  aoEscolher: (chave: string) => void;
  progresso: Progresso;
}) {
  return (
    <nav aria-label="Módulos do treinamento">
      <ol className="flex items-stretch gap-0.5 overflow-x-auto py-2">
        {procedimentos.map((m) => {
          const ativo = m.chave === moduloAberto;
          const p = progresso.resumo.porModulo[m.chave] ?? { feitas: 0, total: 0 };
          const completo = p.total > 0 && p.feitas === p.total;

          return (
            <li key={m.chave} className="shrink-0">
              <button
                type="button"
                onClick={() => aoEscolher(m.chave)}
                aria-current={ativo ? "true" : undefined}
                ref={(el) => {
                  /* Ao trocar de modulo pelo botao "seguinte", la embaixo, o
                     chip correspondente pode estar fora da vista numa tela
                     estreita. Ele se traz para dentro sozinho. */
                  if (el && ativo) {
                    el.scrollIntoView({ block: "nearest", inline: "nearest" });
                  }
                }}
                className={`flex h-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-200 ${
                  ativo
                    ? "bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
                    : "text-[color:var(--cart-preco)] hover:bg-[color:var(--cart-caixa)]"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[0.625rem] font-bold ${
                    ativo
                      ? "bg-white/15"
                      : completo
                        ? "bg-[color:var(--cart-acao)] text-[color:var(--cart-acao-ink)]"
                        : "bg-[color:var(--cart-caixa)] text-[color:var(--cart-titulo)]"
                  }`}
                >
                  {completo && !ativo ? <span aria-hidden="true">&#10003;</span> : m.numero}
                </span>

                {/* So o nome. A palavra "modulo" repetida nove vezes nao
                    acrescenta nada, e o numero ja esta na bolinha ao lado —
                    tirada, sobra espaco e a fileira respira. Ela continua
                    dita ao leitor de tela, logo abaixo, onde a bolinha
                    sozinha nao bastaria. */}
                <span className="whitespace-nowrap text-sm font-semibold leading-tight">
                  {m.tituloCurto ?? m.titulo}
                </span>

                <span className="sr-only">
                  Módulo {m.numero}{completo ? ", concluído" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* Quem está estudando. O CRECI fica aqui, à vista do próprio corretor: o
   registro vence, e o primeiro a notar tem de ser quem depende dele. */
function Perfil({
  perfil,
  progresso,
}: {
  perfil: PerfilCorretor;
  progresso: Progresso;
}) {
  const pendente = (v: string) => v.startsWith("[");
  const tempo = tempoDeMercado(perfil.atuaDesde);
  const { feitas, total, percentual } = progresso.resumo;
  const semNome = pendente(perfil.nome);

  return (
    <div className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-6 shadow-[var(--cart-sombra)]">
      <div className="flex items-center gap-4">
        {perfil.foto ? (
          <Image
            src={perfil.foto}
            alt={perfil.nome}
            width={160}
            height={160}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        ) : (
          /* Sem foto, as iniciais — e não um painel de "foto pendente".
             Avatar vazio é padrão em qualquer sistema e não parece defeito;
             o aviso de pendência está nos campos, onde resolve algo. */
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[color:var(--cart-pilula)] text-[1.25rem] font-bold text-[color:var(--cart-pilula-ink)]">
            {iniciaisDe(semNome ? perfil.usuario : perfil.nome)}
          </span>
        )}

        <div className="min-w-0">
          <p
            className={`text-[1.0625rem] font-bold leading-tight ${
              semNome ? "text-[color:var(--ink-faint)]" : "text-[color:var(--ink)]"
            }`}
          >
            {semNome ? "Nome a preencher" : perfil.nome}
          </p>
          <p className="mt-1 text-sm text-[color:var(--ink-muted)]">
            {perfil.cargo}
          </p>
        </div>
      </div>

      <dl className="mt-6 space-y-5 border-t border-[color:var(--cart-card-linha)] pt-5">
        <Campo rotulo="CRECI" pendente={pendente(perfil.creci)}>
          {pendente(perfil.creci) ? "A preencher" : perfil.creci}
        </Campo>

        <Campo rotulo="Formação" pendente={perfil.formacao.every(pendente)}>
          {perfil.formacao.every(pendente) ? (
            "A preencher"
          ) : (
            /* A formacao e uma lista de verdade — cinco cursos, nao um
               paragrafo quebrado —, e sem marcador as linhas liam como
               texto corrido que alguem tinha enrolado. O ponto verde diz
               onde cada item comeca e repete a cor do rotulo acima.

               O ponto e decorativo: quem le com leitor de tela ja ouve a
               estrutura da <ul>, e um bullet falado seria ruido. */
            <ul className="space-y-1.5">
              {perfil.formacao
                .filter((f) => !pendente(f))
                .map((f) => (
                  <li key={f} className="flex gap-2 leading-snug">
                    <span
                      aria-hidden="true"
                      className="mt-[0.4375rem] h-1 w-1 shrink-0 rounded-full bg-[color:var(--cart-titulo)]"
                    />
                    <span>{f}</span>
                  </li>
                ))}
            </ul>
          )}
        </Campo>

        <Campo rotulo="No mercado" pendente={!tempo}>
          {tempo ? `Desde ${perfil.atuaDesde} · ${tempo}` : "A preencher"}
        </Campo>

        {perfil.atuacao && (
          <Campo rotulo="Atuação" pendente={false}>
            {perfil.atuacao}
          </Campo>
        )}
      </dl>

      {perfil.metas && perfil.metas.length > 0 && (
        <Metas metas={perfil.metas} />
      )}

      {progresso.pronto && (
        <div className="mt-6 border-t border-[color:var(--cart-card-linha)] pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="t-label text-[color:var(--ink-faint)]">Treinamento</p>
            <p className="text-[1.25rem] font-bold text-[color:var(--cart-preco)]">
              {percentual}%
            </p>
          </div>

          <div
            role="progressbar"
            aria-valuenow={feitas}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${feitas} de ${total} aulas concluídas`}
            className="mt-2.5 h-2 overflow-hidden rounded-full bg-[color:var(--cart-caixa)]"
          >
            <div
              className="h-full rounded-full bg-[color:var(--cart-acao)] transition-[width] duration-500 ease-[var(--cart-curva)]"
              style={{ width: `${percentual}%` }}
            />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[color:var(--ink-muted)]">
              {feitas} de {total} aulas
            </p>
            {feitas > 0 && (
              <button
                type="button"
                onClick={progresso.zerar}
                className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-titulo)]"
              >
                Zerar
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-5 border-t border-dashed border-[color:var(--cart-campo-linha)] pt-4 text-xs leading-snug text-[color:var(--ink-faint)]">
        O progresso fica neste navegador. Com login de verdade, ele passa a ser
        do corretor, em qualquer computador.
      </p>
    </div>
  );
}

/* As metas da semana, dentro do cartao do corretor.

   Meta sem forma de conferir e desejo, entao cada uma tem um marcador: uma
   fileira de bolinhas quando o alvo e pequeno, que e o caso de "dois por
   semana" — da para ver o quanto falta sem ler numero. A contagem zera
   sozinha na virada da semana.

   Meta sem numero definido aparece como "a definir" em vez de sumir: o que
   falta decidir fica a vista de quem decide. */
function Metas({ metas }: { metas: MetaCorretor[] }) {
  const { pronto, feito, marcar, intervalo } = useMetasCorretor();

  return (
    <div className="mt-6 border-t border-[color:var(--cart-card-linha)] pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="t-label font-bold text-[color:var(--cart-titulo)]">
          Metas
        </p>
        <p className="text-xs text-[color:var(--ink-faint)]">{intervalo}</p>
      </div>

      <ul className="mt-4 space-y-4">
        {metas.map((m) => {
          const semAlvo = m.alvo === null;
          const n = pronto ? feito(m.chave) : 0;
          const completa = !semAlvo && n >= (m.alvo ?? 0);

          return (
            <li key={m.chave}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-[color:var(--ink)]">
                  {m.rotulo}
                </p>
                <p
                  className={`text-xs ${
                    semAlvo
                      ? "italic text-[color:var(--ink-faint)]"
                      : "text-[color:var(--ink-muted)]"
                  }`}
                >
                  {semAlvo
                    ? "A definir"
                    : `${m.alvo} por ${m.periodo === "semana" ? "semana" : "mes"}`}
                </p>
              </div>

              {!semAlvo && pronto && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className="flex items-center gap-1.5"
                    role="group"
                    aria-label={`${m.rotulo}: ${n} de ${m.alvo} nesta semana`}
                  >
                    {Array.from({ length: m.alvo ?? 0 }).map((_, i) => {
                      const cheia = i < n;
                      return (
                        <button
                          key={i}
                          type="button"
                          /* Clicar na bolinha i define a contagem como i+1;
                             clicar na ultima cheia desmarca. Assim corrigir
                             um engano e um toque, nao varios. */
                          onClick={() => marcar(m.chave, cheia && i + 1 === n ? i : i + 1)}
                          aria-pressed={cheia}
                          aria-label={
                            cheia
                              ? `Desmarcar ${m.rotulo.toLowerCase()} ${i + 1}`
                              : `Marcar ${m.rotulo.toLowerCase()} ${i + 1} como feito`
                          }
                          className={`h-5 w-5 rounded-full border-2 transition-colors duration-200 ${
                            cheia
                              ? "border-[color:var(--cart-acao)] bg-[color:var(--cart-acao)]"
                              : "border-[color:var(--cart-campo-linha)] hover:border-[color:var(--cart-titulo)]"
                          }`}
                        />
                      );
                    })}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`text-xs font-semibold ${
                      completa
                        ? "text-[color:var(--cart-titulo)]"
                        : "text-[color:var(--ink-faint)]"
                    }`}
                  >
                    {completa ? "feita" : `${n}/${m.alvo}`}
                  </span>
                </div>
              )}

              {m.criterio && (
                <p className="mt-1.5 text-xs leading-snug text-[color:var(--ink-faint)]">
                  {m.criterio}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Campo({
  rotulo,
  children,
  pendente,
}: {
  rotulo: string;
  children: React.ReactNode;
  pendente: boolean;
}) {
  return (
    <div>
      {/* Os rótulos da ficha vem no verde da marca e em negrito: são eles
          que o olho procura quando se quer o CRECI ou o tempo de mercado,
          e em cinza-fraco eles sumiam sob o próprio conteúdo. 7,66:1 sobre
          o branco do cartão, acima do mínimo AA. */}
      <dt className="t-label font-bold text-[color:var(--cart-titulo)]">
        {rotulo}
      </dt>
      {/* O valor vem em tinta cheia (--cart-ficha → --ink, 16,11:1 sobre o
          branco do cartão) e bem afastado do rótulo. A ficha é a credencial
          do corretor — o número do CRECI, os cinco cursos, os quinze anos de
          mercado —, e nenhum cinza dava a ela o peso que ela tem.

          O risco de pôr os dois em força máxima seria rótulo e valor lerem
          como um bloco só. Quem resolve isso aqui não é a tinta: é o rótulo
          ser verde, caixa-alta, pequeno e espaçado contra um valor preto,
          caixa-baixa e maior, e o mt-2 que separa um do outro. */}
      <dd
        className={`mt-2 text-sm leading-relaxed ${
          pendente
            ? "italic text-[color:var(--ink-faint)]"
            : "text-[color:var(--cart-ficha)]"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

function Modulo({
  modulo,
  progresso,
  aoAvancar,
}: {
  modulo: (typeof procedimentos)[number];
  progresso: Progresso;
  aoAvancar: () => void;
}) {
  const p = progresso.resumo.porModulo[modulo.chave] ?? { feitas: 0, total: 0 };
  const completo = p.total > 0 && p.feitas === p.total;
  const ultimo =
    procedimentos[procedimentos.length - 1].chave === modulo.chave;

  return (
    <div>
      {/* ---------- Abertura do modulo ----------
          Com imagem, o cartao vira duas colunas no desktop: a imagem de um
          lado, o texto do outro. A imagem do modulo 01 e quadrada, e numa
          faixa deitada o corte comeria justamente a passagem do tempo que
          ela conta — a caravela em cima, a mesa com a planta embaixo. Por
          isso ela fica quadrada nos dois tamanhos: no celular empilha em
          cima do texto, inteira.

          Sem imagem, o texto ocupa o cartao inteiro, como antes. */}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)]">
        {/* Card desenhado, com texto dentro, entra como FAIXA em cima:
            espremido numa coluna estreita ele perde metade do que diz.
            Foto solta entra ao lado, que e mais compacto. */}
        <div
          className={
            modulo.imagem?.src && modulo.imagem.formato !== "deitada"
              ? "grid gap-0 md:grid-cols-[minmax(0,15rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr]"
              : ""
          }
        >
          {modulo.imagem?.src && (
            <figure
              className={`relative w-full bg-[color:var(--cart-caixa)] ${
                modulo.imagem.formato === "deitada"
                  ? "aspect-[16/9]"
                  : "aspect-square md:h-full"
              }`}
            >
              <Image
                src={modulo.imagem.src}
                alt={modulo.imagem.alt}
                fill
                sizes={
                  modulo.imagem.formato === "deitada"
                    ? "(min-width: 1024px) 60vw, 100vw"
                    : "(min-width: 1024px) 17rem, (min-width: 768px) 15rem, 100vw"
                }
                className="object-cover"
              />
              {modulo.imagem.credito && (
                <figcaption className="absolute bottom-2 right-2 rounded bg-black/55 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-white">
                  {modulo.imagem.credito}
                </figcaption>
              )}
            </figure>
          )}

          <div className="p-6 md:p-8">
            <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-[color:var(--cart-titulo)]">
              MÓDULO {modulo.numero} DE {procedimentos.length}
            </p>
            <h2 className="t-display-tight fs-bloco mt-2 text-[color:var(--ink)]">
              {modulo.titulo}
            </h2>
            {/* 48ch, nao 62ch. A medida de 62 vinha de quando o resumo tinha
                o cartao inteiro; ao lado da foto, numa coluna que ja e
                estreita, a linha longa fazia o bloco parecer uma parede.

                O painel do objetivo — "Ao fim deste modulo voce sabe" —
                ficava aqui e saiu. `modulo.objetivo` CONTINUA nos dados, em
                src/content/corretor.ts, escrito para os doze modulos: e o que
                separa treinamento de manual, e nao se joga fora porque a
                abertura ficou cheia. So nao aparece mais nesta tela. */}
            <p className="t-body mt-3 max-w-[48ch] text-[color:var(--ink-muted)]">
              {modulo.resumo}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- As aulas ---------- */}
      <ol className="mt-4 space-y-3">
        {modulo.topicos.map((t, i) => (
          <Aula
            key={t.chave}
            numero={i + 1}
            topico={t}
            concluida={progresso.concluida(modulo.chave, t.chave)}
            aoConcluir={() =>
              progresso.alternar(`${modulo.chave}/${t.chave}`)
            }
          />
        ))}
      </ol>

      {/* ---------- Fim do módulo ---------- */}
      {completo && !ultimo && (
        <div className="mt-4 rounded-2xl border border-[color:var(--cart-acao)] bg-[color:var(--cart-card)] p-6 text-center shadow-[var(--cart-sombra)]">
          <p className="t-display-tight fs-card text-[color:var(--ink)]">
            Módulo {modulo.numero} concluído.
          </p>
          <button
            type="button"
            onClick={aoAvancar}
            className="mt-5 rounded-xl bg-[color:var(--cart-pilula)] px-6 py-3 text-[0.9375rem] font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90"
          >
            Ir para o módulo seguinte →
          </button>
        </div>
      )}

      {completo && ultimo && (
        <div className="mt-4 rounded-2xl border border-[color:var(--cart-acao)] bg-[color:var(--cart-card)] p-6 text-center shadow-[var(--cart-sombra)]">
          <p className="t-display-tight fs-card text-[color:var(--ink)]">
            Treinamento concluído.
          </p>
          <p className="t-body mx-auto mt-3 max-w-[46ch] text-sm text-[color:var(--ink-muted)]">
            A marcação fica neste navegador e não chega à Tridium. Para o
            gestor acompanhar quem concluiu o quê, é preciso o mesmo banco de
            dados que o login de verdade pede.
          </p>
        </div>
      )}
    </div>
  );
}

function Aula({
  numero,
  topico,
  concluida,
  aoConcluir,
}: {
  numero: number;
  topico: (typeof procedimentos)[number]["topicos"][number];
  concluida: boolean;
  aoConcluir: () => void;
}) {
  const [aberta, setAberta] = useState(false);

  return (
    <li
      className={`overflow-hidden rounded-2xl border bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)] ${
        concluida
          ? "border-[color:var(--cart-acao)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
        {/* A caixa de concluído fica FORA do botão que abre a aula: um botão
            dentro do outro não existe em HTML, e marcar como vista não devia
            obrigar a abrir. */}
        <button
          type="button"
          onClick={aoConcluir}
          aria-pressed={concluida}
          aria-label={
            concluida
              ? `Desmarcar a aula ${topico.titulo}`
              : `Marcar a aula ${topico.titulo} como concluída`
          }
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
            concluida
              ? "border-[color:var(--cart-acao)] bg-[color:var(--cart-acao)] text-[color:var(--cart-acao-ink)]"
              : "border-[color:var(--cart-campo-linha)] text-transparent hover:border-[color:var(--cart-titulo)]"
          }`}
        >
          <span aria-hidden="true" className="text-sm font-bold">
            ✓
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
          aria-controls={`aula-${topico.chave}`}
          className="group flex min-w-0 flex-1 items-start gap-4 text-left"
        >
          <span className="min-w-0 flex-1">
            {/* O número anda na MESMA linha do título. Empilhado, o rótulo
                "AULA 01" ocupava uma linha inteira para dizer o que o lugar
                na lista já dizia, e empurrava o título para baixo. Ao lado,
                ele vira o que sempre foi: um índice.

                Baseline comum, não centro comum: o número é pequeno e o
                título grande, e alinhá-los pelo meio deixaria o número
                boiando. `sr-only` devolve a palavra "Aula" a quem ouve a
                página — lido em voz alta, um "01" solto antes do título não
                diz nada. */}
            <span className="flex items-baseline gap-2.5">
              <span className="shrink-0 font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-[color:var(--ink-faint)]">
                <span className="sr-only">Aula </span>
                {String(numero).padStart(2, "0")}
              </span>
              <span
                className={`min-w-0 text-[1.0625rem] font-semibold ${
                  concluida
                    ? "text-[color:var(--ink-muted)]"
                    : "text-[color:var(--cart-titulo)]"
                }`}
              >
                {topico.titulo}
              </span>
            </span>
            <span className="mt-1.5 block text-sm leading-snug text-[color:var(--ink-muted)]">
              {topico.resumo}
            </span>
          </span>

          {/* A seta é o que diz que o cartão abre, e era um ▾ de texto, solto
              e do tamanho do corpo. Agora é um disco de 32px — maior que a
              caixa de concluído, porque abrir é a ação principal da linha.

              No repouso ela é verde sobre o branco do cartão; sob o mouse o
              disco acende no amarelo da marca e o traço vira tinta escura.
              O amarelo NÃO entra no traço: #e0b411 sobre branco dá 1,96:1 e
              uma seta amarela sobre o cartão sumiria em vez de chamar. Como
              fundo, com #2a2100 em cima, dá 8,14:1 — é como o botão Sair já
              funciona.

              `group-focus-visible` repete o aceso para quem chega pelo
              teclado: o botão não tinha foco visível nenhum. */}
          <span
            aria-hidden="true"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[color:var(--cart-titulo)] transition-[background-color,color,rotate] duration-300 ease-[var(--cart-curva)] group-hover:bg-[color:var(--cart-acao)] group-hover:text-[color:var(--cart-acao-ink)] group-focus-visible:bg-[color:var(--cart-acao)] group-focus-visible:text-[color:var(--cart-acao-ink)] motion-reduce:transition-[background-color,color] ${
              aberta ? "rotate-180" : ""
            }`}
          >
            <svg
              viewBox="0 0 16 16"
              className="h-[1.125rem] w-[1.125rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6.25 8 10.25 12 6.25" />
            </svg>
          </span>
        </button>
      </div>

      {aberta && (
        <div
          id={`aula-${topico.chave}`}
          className="border-t border-[color:var(--cart-card-linha)] px-5 pb-6 pt-5 sm:px-6"
        >
          {/* Aula desenha `conteudo`; procedimento desenha `passos`. Um
              topico nunca tem os dois cheios. */}
          {topico.conteudo ? (
            <Materia blocos={topico.conteudo} />
          ) : (
            <ol className="space-y-2.5">
              {topico.passos.map((passo, i) => (
                <li key={passo} className="flex gap-3.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color:var(--cart-caixa)] font-mono text-[0.625rem] font-bold text-[color:var(--cart-titulo)]">
                    {i + 1}
                  </span>
                  <span className="text-[color:var(--ink)]">{passo}</span>
                </li>
              ))}
            </ol>
          )}

          {topico.exigencia && (
            <Marca tom="lei" rotulo="Exigência legal">
              {topico.exigencia}
            </Marca>
          )}

          {topico.atencao && (
            <Marca tom="atencao" rotulo="Atenção">
              {topico.atencao}
            </Marca>
          )}

          {topico.cards && topico.cards.length > 0 && (
            <div className="mt-5 border-t border-[color:var(--cart-card-linha)] pt-5">
              <p className="t-label text-[color:var(--ink-faint)]">
                Material de apoio
              </p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {topico.cards.map((c) => (
                  <li key={c.chave}>
                    <CardApoio card={c} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topico.fontes && topico.fontes.length > 0 && (
            <div className="mt-6 border-t border-[color:var(--cart-card-linha)] pt-4">
              <p className="t-label text-[color:var(--ink-faint)]">Fontes</p>
              <ul className="mt-2 space-y-1">
                {topico.fontes.map((f) => (
                  <li key={f.href}>
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[color:var(--cart-titulo)] underline underline-offset-2 transition-opacity duration-200 hover:opacity-70"
                    >
                      {f.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!concluida && (
            <button
              type="button"
              onClick={aoConcluir}
              className="mt-6 rounded-xl border border-[color:var(--cart-campo-linha)] px-5 py-2.5 text-sm font-semibold text-[color:var(--cart-preco)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              Marcar aula como concluída
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/* A materia de uma aula. Quatro formas, cada uma com um trabalho:

     texto   abre ou fecha, em corpo maior que o resto
     secao   titulo numerado, texto e lista — e o grosso da aula
     linha   a linha do tempo, com o ano ancorado a esquerda
     fecho   a caixa final, a ideia que a aula quer deixar

   Nao e lista numerada como nos procedimentos: aula nao e sequencia de
   passos a executar, e materia a ler, e numerar tudo achataria a
   hierarquia entre secao, item e marco. */
function Materia({ blocos }: { blocos: BlocoAula[] }) {
  return (
    <div className="space-y-6">
      {blocos.map((b, i) => {
        if (b.tipo === "texto") {
          return (
            <p
              key={i}
              className="text-[0.9375rem] leading-relaxed text-[color:var(--ink)]"
            >
              {b.texto}
            </p>
          );
        }

        if (b.tipo === "secao") {
          return (
            <section key={i}>
              <h4 className="text-[0.9375rem] font-bold text-[color:var(--cart-titulo)]">
                {b.titulo}
              </h4>
              {b.texto && (
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                  {b.texto}
                </p>
              )}
              {b.itens && (
                <ul className="mt-3 space-y-2">
                  {b.itens.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--cart-acao)]"
                      />
                      <span className="leading-relaxed text-[color:var(--ink)]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        }

        if (b.tipo === "linha") {
          return (
            <section key={i}>
              {b.titulo && (
                <h4 className="text-[0.9375rem] font-bold text-[color:var(--cart-titulo)]">
                  {b.titulo}
                </h4>
              )}
              {/* O fio vertical liga os marcos; o ano fica ancorado a
                  esquerda, largura fixa, para a coluna nao dancar. */}
              <ol className="mt-4 space-y-5 border-l-2 border-[color:var(--cart-card-linha)] pl-5">
                {b.marcos.map((m) => (
                  <li key={m.ano} className="relative">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1.6rem] top-1 h-3 w-3 rounded-full border-2 border-[color:var(--cart-card)] ${
                        m.marco
                          ? "bg-[color:var(--cart-acao)]"
                          : "bg-[color:var(--cart-card-linha)]"
                      }`}
                    />
                    <p
                      className={`font-mono text-xs font-bold tracking-[0.08em] ${
                        m.marco
                          ? "text-[color:var(--cart-acao-ink)]"
                          : "text-[color:var(--ink-faint)]"
                      }`}
                    >
                      {m.ano}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[color:var(--ink)]">
                      {m.titulo}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-muted)]">
                      {m.texto}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          );
        }

        if (b.tipo === "imagem") {
          return (
            <figure key={i}>
              <div
                className={`relative w-full overflow-hidden rounded-xl bg-[color:var(--cart-caixa)] ${
                  b.formato === "quadrada" ? "aspect-square" : "aspect-[16/9]"
                }`}
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {b.legenda && (
                <figcaption className="mt-2 text-xs leading-snug text-[color:var(--ink-faint)]">
                  {b.legenda}
                </figcaption>
              )}
            </figure>
          );
        }

        /* `fecho`. Escrito por extenso, e nao como "o que sobrar": assim o
           TypeScript avisa quando um tipo novo de bloco entrar sem desenho. */
        if (b.tipo === "fecho") {
          return (
            <div
              key={i}
              className="rounded-xl border-l-[3px] border-l-[color:var(--cart-titulo)] bg-[color:var(--cart-caixa)] px-5 py-4"
            >
              <p className="text-sm font-bold text-[color:var(--cart-titulo)]">
                {b.titulo}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink)]">
                {b.texto}
              </p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function Marca({
  tom,
  rotulo,
  children,
}: {
  tom: "lei" | "atencao";
  rotulo: string;
  children: React.ReactNode;
}) {
  const lei = tom === "lei";
  return (
    <div className="mt-5 rounded-xl border-l-[3px] bg-[color:var(--cart-caixa)] px-4 py-3.5"
      style={{
        borderLeftColor: lei
          ? "var(--cart-titulo)"
          : "var(--cart-acao)",
      }}
    >
      <p
        className={`font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] ${
          lei
            ? "text-[color:var(--cart-titulo)]"
            : "text-[color:var(--cart-acao-ink)]"
        }`}
      >
        {rotulo}
      </p>
      <p className="mt-1.5 text-sm leading-snug text-[color:var(--ink)]">
        {children}
      </p>
    </div>
  );
}

function CardApoio({ card }: { card: CardProcedimento }) {
  const TIPOS = { modelo: "Modelo", guia: "Guia", ferramenta: "Ferramenta" };

  const miolo = (
    <>
      <span className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
        {TIPOS[card.tipo]}
      </span>
      <span className="mt-1.5 block text-sm font-semibold text-[color:var(--cart-preco)]">
        {card.titulo}
      </span>
      <span className="mt-1 block text-xs leading-snug text-[color:var(--ink-muted)]">
        {card.descricao}
      </span>
    </>
  );

  if (card.href) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full rounded-xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-4 no-underline transition-[translate,box-shadow,border-color] duration-[220ms] ease-[var(--cart-curva)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] hover:shadow-[var(--cart-sombra-alta)] motion-reduce:hover:translate-y-0"
      >
        {miolo}
      </a>
    );
  }

  return (
    <div className="h-full rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-caixa)]/60 p-4">
      {miolo}
      <span className="mt-2.5 inline-block font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]">
        ◇ A produzir
      </span>
    </div>
  );
}
