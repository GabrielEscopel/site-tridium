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
  type CardProcedimento,
  type PerfilCorretor,
} from "@/content/corretor";
import { marcas } from "@/content/site";
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

              A SUBIDA DE 8px alinha as linhas de base. Centradas pela
              caixa, as duas palavras ficavam 8px fora de registro: a da
              Sinos nasce mais abaixo no arquivo dela, porque tem o telhado
              em cima. Como e `translate`, nao mexe na altura da faixa. */}
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
              className="h-[35px] w-auto shrink-0 -translate-y-[8px] md:h-10 md:-translate-y-[9px]"
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
            <span className="block space-y-1.5">
              {perfil.formacao
                .filter((f) => !pendente(f))
                .map((f) => (
                  <span key={f} className="block leading-snug">
                    {f}
                  </span>
                ))}
            </span>
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
      {/* O conteúdo vem mais leve que o resto do cartão e mais longe do
          rótulo. Em tinta cheia, colado, rótulo e valor liam como um bloco
          só e era preciso procurar onde um terminava. Com o verde forte em
          cima e o cinza embaixo, a hierarquia se vê de relance.

          --ink-muted dá 5,99:1 sobre o branco do cartão: mais leve que o
          quase-preto de antes e ainda bem acima do mínimo AA. */}
      <dd
        className={`mt-2 text-sm leading-relaxed ${
          pendente
            ? "italic text-[color:var(--ink-faint)]"
            : "text-[color:var(--ink-muted)]"
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
      {/* ---------- Abertura do módulo ---------- */}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)]">
        {/* A imagem de abertura, quando o módulo tiver uma. Sem arquivo,
            entra o painel dizendo o que precisa ser produzido — a mesma
            regra do resto do site: nunca imagem de banco no lugar da real. */}
        {modulo.imagem &&
          (modulo.imagem.src ? (
            <figure className="relative aspect-[21/9] w-full bg-[color:var(--cart-caixa)]">
              <Image
                src={modulo.imagem.src}
                alt={modulo.imagem.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              {modulo.imagem.credito && (
                <figcaption className="absolute bottom-2 right-3 rounded bg-black/55 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-white">
                  {modulo.imagem.credito}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="flex aspect-[21/9] w-full items-center justify-center border-b border-dashed border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-caixa)] px-8 text-center">
              <p className="max-w-[52ch]">
                <span className="block font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
                  &#9671; Imagem a produzir
                </span>
                <span className="mt-2 block text-sm leading-snug text-[color:var(--ink-muted)]">
                  {modulo.imagem.descricao}
                </span>
              </p>
            </div>
          ))}

        <div className="p-6 md:p-8">
        <p className="font-mono text-[0.6875rem] font-bold tracking-[0.12em] text-[color:var(--cart-titulo)]">
          MÓDULO {modulo.numero} DE {procedimentos.length}
        </p>
        <h2 className="t-display-tight fs-bloco mt-2 text-[color:var(--ink)]">
          {modulo.titulo}
        </h2>
        <p className="t-body mt-3 max-w-[62ch] text-[color:var(--ink-muted)]">
          {modulo.resumo}
        </p>

        {/* O objetivo é o que separa treinamento de manual: ele diz o que a
            pessoa tem de SABER FAZER, não o que vai ler. */}
        <div className="mt-6 rounded-xl border-l-[3px] border-l-[color:var(--cart-acao)] bg-[color:var(--cart-caixa)] px-5 py-4">
          <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-acao-ink)]">
            Ao fim deste módulo você sabe
          </p>
          <p className="mt-2 text-sm leading-snug text-[color:var(--ink)]">
            {modulo.objetivo}
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
          className="flex min-w-0 flex-1 items-start gap-4 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[0.625rem] font-bold tracking-[0.12em] text-[color:var(--ink-faint)]">
              AULA {String(numero).padStart(2, "0")}
            </span>
            <span
              className={`mt-1 block text-[1.0625rem] font-semibold ${
                concluida
                  ? "text-[color:var(--ink-muted)]"
                  : "text-[color:var(--cart-titulo)]"
              }`}
            >
              {topico.titulo}
            </span>
            <span className="mt-1.5 block text-sm leading-snug text-[color:var(--ink-muted)]">
              {topico.resumo}
            </span>
          </span>

          <span
            aria-hidden="true"
            className={`mt-5 shrink-0 text-[color:var(--cart-titulo)] transition-transform duration-300 ease-[var(--cart-curva)] ${
              aberta ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>
      </div>

      {aberta && (
        <div
          id={`aula-${topico.chave}`}
          className="border-t border-[color:var(--cart-card-linha)] px-5 pb-6 pt-5 sm:px-6"
        >
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
