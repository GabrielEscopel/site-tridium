"use client";

/* =============================================================================
   GESTÃO DO CORRETOR — a semana, as metas, as premiações e a ficha
   -----------------------------------------------------------------------------
   Área própria, irmã do treinamento: lá é onde o corretor APRENDE, aqui é
   onde ele vê O QUE TEM PARA FAZER e como está indo. A carteira continua no
   painel, porque lá são imóveis.

   A ORDEM DOS BLOCOS É A ORDEM DAS PERGUNTAS de quem abre a tela:
     1. o que eu faço hoje?      → a semana
     2. como eu estou indo?      → metas
     3. o que eu ganho com isso? → premiações
     4. quem eu sou              → ficha

   A SEMANA TEM DUAS FONTES, e essa separação é o centro do desenho:
     ROTINA DA CASA     — igual para todos, escrita no repositório pela
                          gestão. Responde "o que a casa espera de mim".
     COMPROMISSO PRÓPRIO — visita, vistoria, reunião. O corretor põe. Responde
                          "o que eu marquei".

   ⚠ O QUE É MARCADO AQUI FICA NO NAVEGADOR DE QUEM MARCOU. O gestor não vê.
   É por isso que existe o botão que copia o FECHAMENTO DA SEMANA: enquanto o
   número não chega sozinho à gestão, o corretor cola o texto no grupo. Não é
   controle — é o corretor declarando. Ver lib/gestaoCorretor para o que falta
   e para onde a troca acontece.

   OS GANCHOS SÃO CHAMADOS UMA VEZ SÓ, aqui no alto, e descem por propriedade.
   Dois `useMetasCorretor()` na mesma árvore seriam dois estados separados: o
   que fosse marcado num não apareceria no outro até recarregar a página.
   ============================================================================= */

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  iniciaisDe,
  nomeDoDia,
  perfilDoUsuario,
  premiacoesDaCasa,
  rotinaDoDia,
  tempoDeMercado,
  type MetaCorretor,
  type PerfilCorretor,
  type Premiacao,
  type TarefaDaRotina,
} from "@/content/corretor";
import { formatarPreco, imoveis, type Imovel } from "@/content/imobiliaria";
import { marcas } from "@/content/site";
import { useMetasCorretor } from "@/lib/metasCorretor";
import { useSessaoCorretor } from "@/lib/sessaoCorretor";
import {
  DIAS_ENTRE_REVISOES,
  prazoDeRevisao,
  rotuloDaCaptacao,
  rotuloDoInvestidor,
  rotuloDoTipo,
  useGestaoCorretor,
  type Compromisso,
  type DiaDaSemana,
  type StatusCaptacao,
  type StatusInvestidor,
  type Captacao,
  type TipoCompromisso,
} from "@/lib/gestaoCorretor";
import {
  apagarFoto,
  guardarFotos,
  lerFotos,
  MAXIMO_DE_FOTOS,
  type FotoGuardada,
} from "@/lib/fotosCaptacao";

export function AreaGestao() {
  const { sessao, pronto: sessaoPronta, sair } = useSessaoCorretor();
  const metas = useMetasCorretor();
  const gestao = useGestaoCorretor();

  if (!sessaoPronta) return <div className="min-h-[70svh]" aria-hidden="true" />;

  /* Sem sessão, a pessoa é mandada para a porta. Isto não é segurança — é
     cortesia de navegação; ver lib/sessaoCorretor. */
  if (!sessao) return <SemAcesso />;

  const perfil = perfilDoUsuario(sessao.usuario);

  return (
    <div className="carteira min-h-screen">
      {/* ================= CABEÇALHO =================
          CLARO E COM UMA MARCA SÓ, diferente do treinamento. Lá a faixa é
          escura porque precisa acomodar a marca da Sinos, que tem lettering
          branco e some em fundo claro. Aqui a Sinos não entra: gestão da
          equipe é assunto da casa. Sem a segunda marca, o fundo escuro
          perderia a razão de ser e brigaria com o resto do painel. */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--cart-card-linha)] bg-white/95 backdrop-blur">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/imobiliaria/corretor" className="shrink-0 no-underline">
              <Image
                src={marcas.imobiliaria.claro}
                alt="Tridium Imóveis — voltar ao painel"
                width={190}
                height={44}
                priority
                className="h-8 w-auto md:h-9"
              />
            </Link>
            <span
              aria-hidden="true"
              className="h-7 w-px shrink-0 bg-[color:var(--cart-card-linha)]"
            />
            {/* SEM `truncate` AQUI. `t-label` tem `line-height: 1`, e o
                `overflow: hidden` que vem junto com o truncate corta o til
                do "Ã" — a palavra aparecia como "GESTAO". Uma palavra curta
                não precisa de corte nenhum. */}
            <span className="t-label whitespace-nowrap text-[color:var(--cart-titulo)]">
              Gestão
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/imobiliaria/corretor/treinamento"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--cart-preco)] no-underline transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              Treinamento
            </Link>
            <Link
              href="/imobiliaria/corretor"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[color:var(--cart-preco)] no-underline transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              Painel
            </Link>
            <button
              type="button"
              onClick={sair}
              className="rounded-xl bg-[color:var(--cart-pilula)] px-4 py-2 text-sm font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="wrap py-8 md:py-12">
        {/* O nome e o CRECI saíram daqui. Eles ficavam à direita deste
            cabeçalho porque a ficha estava enterrada no pé da coluna
            lateral e nada dizia de quem era aquela semana. Agora a ficha
            abre a página logo abaixo, em letra maior e com retrato: repetir
            os dois a cem pixels de distância é a mesma redundância que já
            foi desfeita duas vezes no treinamento. */}
        <div>
          <p className="t-label text-[color:var(--cart-titulo)]">
            Minha semana
          </p>
          <h1 className="t-display-tight fs-bloco mt-2 text-[color:var(--ink)]">
            {metas.intervalo}
          </h1>
        </div>

        {/* Não é um alerta a ser fechado: enquanto a tranca for de papelão,
            esta frase precisa estar visível toda vez. */}
        <p className="mt-6 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-5 py-3.5 text-sm leading-snug text-[color:var(--ink-muted)]">
          <strong className="text-[color:var(--cart-preco)]">
            Ambiente de teste.
          </strong>{" "}
          O que você marcar aqui fica neste navegador e a gestão não vê. Para o
          gerente acompanhar, use o botão de fechamento no fim da semana.
        </p>

        {/* A semana manda na tela e fica na coluna larga; metas, premiações e
            ficha são consulta e descem para a lateral. Em tela estreita tudo
            empilha nessa mesma ordem. */}
        {/* ================= A FAIXA DE CIMA =================
            A ficha à esquerda, estreita, e o monitoramento ao lado dela
            ocupando o resto. São as duas coisas que o corretor abre a
            página para ver: quem ele é perante o CRECI, e o que está
            cobrando ação dele hoje. */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-8">
          <Ficha perfil={perfil} />
          <Monitor gestao={gestao} />
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8">
          <Semana perfil={perfil} metas={metas} gestao={gestao} />

          <div className="space-y-6">
            {perfil.metas && perfil.metas.length > 0 && (
              <Metas metas={perfil.metas} metasHook={metas} />
            )}
            <Premiacoes metas={perfil.metas ?? []} metasHook={metas} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SemAcesso() {
  return (
    <section className="carteira flex min-h-[80svh] items-center py-16">
      <div className="wrap text-center">
        <h1 className="t-display-tight fs-bloco text-[color:var(--ink)]">
          Entre para ver a sua semana.
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

type MetasHook = ReturnType<typeof useMetasCorretor>;
type GestaoHook = ReturnType<typeof useGestaoCorretor>;

/* =============================================================================
   MONITORAMENTO — publicados, captações e investidores
   -----------------------------------------------------------------------------
   Três controles no mesmo painel, em abas. Em três cartões empilhados a
   página ficaria com o dobro da altura e o corretor rolaria para achar o que
   quer; em abas, ele escolhe. A aba de publicados abre primeiro porque é a
   única com prazo correndo — captação e investidor esperam, anúncio vencido
   já está errado no ar.

   ⚠ NADA AQUI ACEITA DADO DE CLIENTE enquanto o acesso for conferido no
   navegador. O campo do investidor se chama "referência" e pede iniciais ou
   codinome, não nome e telefone.
   ============================================================================= */

type AbaMonitor = "publicados" | "captacoes" | "investidores";

function Monitor({ gestao }: { gestao: GestaoHook }) {
  const [aba, setAba] = useState<AbaMonitor>("publicados");

  /* O contador na aba é o que está PEDINDO AÇÃO, não o total. "Publicados 3"
     com os três em dia seria um número sem recado; "3" em vermelho quando
     três venceram faz a pessoa clicar. */
  const vencidos = imoveis.filter(
    (i) => prazoDeRevisao(gestao.revisao(i.chave)?.em).vencido
  ).length;
  const naFila = gestao.captacoes.filter((c) => c.status !== "pronta").length;
  const abertos = gestao.investidores.filter(
    (c) => c.status !== "encerrada"
  ).length;

  const abas: { chave: AbaMonitor; rotulo: string; conta: number }[] = [
    { chave: "publicados", rotulo: "Publicados", conta: vencidos },
    { chave: "captacoes", rotulo: "Captações", conta: naFila },
    { chave: "investidores", rotulo: "Investidores", conta: abertos },
  ];

  return (
    <section className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-5 shadow-[var(--cart-sombra)] md:p-6">
      <div
        role="tablist"
        aria-label="Monitoramento"
        className="flex flex-wrap gap-1 border-b border-[color:var(--cart-card-linha)]"
      >
        {abas.map((a) => {
          const ativa = a.chave === aba;
          return (
            <button
              key={a.chave}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => setAba(a.chave)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                ativa
                  ? "border-[color:var(--cart-titulo)] text-[color:var(--cart-titulo)]"
                  : "border-transparent text-[color:var(--ink-muted)] hover:text-[color:var(--cart-preco)]"
              }`}
            >
              {a.rotulo}
              {a.conta > 0 && (
                <span
                  className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 font-mono text-[0.625rem] font-bold ${
                    ativa
                      ? "bg-[color:var(--cart-acao)] text-[color:var(--cart-acao-ink)]"
                      : "bg-[color:var(--cart-caixa)] text-[color:var(--cart-preco)]"
                  }`}
                >
                  {a.conta}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {aba === "publicados" && <Publicados gestao={gestao} />}
        {aba === "captacoes" && <Captacoes gestao={gestao} />}
        {aba === "investidores" && <Investidores gestao={gestao} />}
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   PUBLICADOS — o relógio dos 60 dias
   -----------------------------------------------------------------------------
   Anúncio no ar envelhece: preço que mudou, foto de outra estação, texto que
   não bate mais. A casa revisa a cada 60 dias, e o que a tela precisa dizer é
   só uma coisa — qual imóvel está pedindo revisão agora.

   Vencido primeiro, e não ordem de código: a lista existe para ser trabalhada
   de cima para baixo.
   ----------------------------------------------------------------------------- */

function Publicados({ gestao }: { gestao: GestaoHook }) {
  const lista = [...imoveis].sort((a, b) => {
    const pa = prazoDeRevisao(gestao.revisao(a.chave)?.em);
    const pb = prazoDeRevisao(gestao.revisao(b.chave)?.em);
    /* Nunca revisado encabeça, depois o mais atrasado. */
    if (pa.nunca !== pb.nunca) return pa.nunca ? -1 : 1;
    return pb.dias - pa.dias;
  });

  return (
    <>
      <p className="text-xs leading-snug text-[color:var(--ink-faint)]">
        Cada anúncio no ar é revisto a cada {DIAS_ENTRE_REVISOES} dias: preço,
        fotos e texto. Marque a revisão no dia em que fizer.
      </p>

      <ul className="mt-4 space-y-3">
        {lista.map((imovel) => (
          <LinhaPublicado
            key={imovel.chave}
            imovel={imovel}
            gestao={gestao}
          />
        ))}
      </ul>
    </>
  );
}

function LinhaPublicado({
  imovel,
  gestao,
}: {
  imovel: Imovel;
  gestao: GestaoHook;
}) {
  const registro = gestao.revisao(imovel.chave);
  const prazo = prazoDeRevisao(registro?.em);
  const [abrindo, setAbrindo] = useState(false);

  const selo = prazo.nunca
    ? { texto: "Nunca revisado", cor: "acao" as const }
    : prazo.vencido
      ? { texto: `${prazo.dias} dias`, cor: "acao" as const }
      : prazo.perto
        ? { texto: `${prazo.dias} dias`, cor: "aviso" as const }
        : { texto: `${prazo.dias} dias`, cor: "ok" as const };

  return (
    <li
      className={`rounded-xl border px-4 py-3 ${
        prazo.vencido
          ? "border-[color:var(--cart-acao)] bg-[color:var(--cart-caixa)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2.5">
            <span className="font-mono text-xs font-bold text-[color:var(--cart-titulo)]">
              {imovel.codigo}
            </span>
            <span className="text-sm font-semibold text-[color:var(--ink)]">
              {imovel.tipo} · {imovel.bairro}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">
            {formatarPreco(imovel.preco)}
            {registro?.em ? ` · revisado em ${emDiaMes(registro.em)}` : ""}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-bold ${
            selo.cor === "acao"
              ? "bg-[color:var(--cart-acao)] text-[color:var(--cart-acao-ink)]"
              : selo.cor === "aviso"
                ? "bg-[color:var(--cart-caixa)] text-[color:var(--cart-preco)]"
                : "bg-[color:var(--cart-caixa)] text-[color:var(--ink-faint)]"
          }`}
        >
          {selo.texto}
        </span>
      </div>

      {registro?.nota && !abrindo && (
        <p className="mt-2 border-l-2 border-[color:var(--cart-campo-linha)] pl-3 text-xs leading-snug text-[color:var(--cart-ficha)]">
          {registro.nota}
        </p>
      )}

      {abrindo ? (
        <FormRevisao
          notaAtual={registro?.nota ?? ""}
          aoSalvar={(nota) => {
            gestao.registrarRevisao(imovel.chave, nota);
            setAbrindo(false);
          }}
          aoFechar={() => setAbrindo(false)}
        />
      ) : (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={() => setAbrindo(true)}
            className="text-xs font-semibold text-[color:var(--cart-titulo)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
          >
            {registro ? "Revisar de novo" : "Registrar revisão"}
          </button>
          <Link
            href={`/imobiliaria/${imovel.chave}`}
            className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
          >
            Ver o anúncio
          </Link>
          {registro && (
            <button
              type="button"
              onClick={() => gestao.apagarRevisao(imovel.chave)}
              className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
            >
              Desfazer
            </button>
          )}
        </div>
      )}
    </li>
  );
}

/* O que mudou na revisão, em texto livre. Campo fechado por padrão: na maior
   parte das vezes a revisão é "olhei, está certo" e um clique basta. */
function FormRevisao({
  notaAtual,
  aoSalvar,
  aoFechar,
}: {
  notaAtual: string;
  aoSalvar: (nota: string) => void;
  aoFechar: () => void;
}) {
  const [nota, setNota] = useState(notaAtual);

  return (
    <div className="mt-3 rounded-xl border border-[color:var(--cart-campo-linha)] bg-white p-3">
      <label
        htmlFor="nota-revisao"
        className="t-label font-bold text-[color:var(--cart-titulo)]"
      >
        O que mudou
      </label>
      <textarea
        id="nota-revisao"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        rows={2}
        autoFocus
        placeholder="Preço, fotos, texto — ou nada a mudar"
        className="mt-2 w-full resize-y rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => aoSalvar(nota)}
          className="rounded-lg bg-[color:var(--cart-acao)] px-3.5 py-2 text-xs font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90"
        >
          Marcar revisado hoje
        </button>
        <button
          type="button"
          onClick={aoFechar}
          className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   CAPTAÇÕES — a fila entre "visitei" e "está no ar"
   ----------------------------------------------------------------------------- */

const STATUS_CAPTACAO: StatusCaptacao[] = [
  "visitada",
  "autorizacao",
  "documentos",
  "fotos",
  "pronta",
];

function Captacoes({ gestao }: { gestao: GestaoHook }) {
  const [identificacao, setIdentificacao] = useState("");

  const salvar = () => {
    const t = identificacao.trim();
    if (!t) return;
    gestao.adicionarCaptacao({ identificacao: t, status: "visitada" });
    setIdentificacao("");
  };

  return (
    <>
      <p className="text-xs leading-snug text-[color:var(--ink-faint)]">
        O que você captou e ainda não subiu. Comece pela identificação — tipo e
        rua, nunca o nome do proprietário. A ficha completa do imóvel abre
        depois, na própria linha.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <input
          type="text"
          value={identificacao}
          onChange={(e) => setIdentificacao(e.target.value)}
          placeholder="Apto 2 dorm., Rua das Flores"
          aria-label="Identificação do imóvel captado"
          className="min-w-0 flex-1 rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
        />
        <button
          type="submit"
          disabled={!identificacao.trim()}
          className="shrink-0 rounded-lg bg-[color:var(--cart-pilula)] px-4 py-2 text-xs font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
        >
          Acrescentar
        </button>
      </form>

      {gestao.captacoes.length === 0 ? (
        /* O ESTADO VAZIO DIZ O QUE VEM DEPOIS, e não só que está vazio.
           A ficha completa do imóvel — código, metragem, preço, textos,
           fotos — só existe dentro de uma linha, e com a lista vazia não há
           linha para abrir. Sem esta frase, a tela parece ser apenas um
           campo de anotação, e foi exatamente o que aconteceu: a função
           inteira ficou escondida atrás de um registro que ainda não
           existia. */
        <div className="mt-4 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-5 py-6 text-center">
          <p className="text-sm font-semibold text-[color:var(--ink)]">
            Nenhuma captação na fila.
          </p>
          <p className="mx-auto mt-2 max-w-[46ch] text-xs leading-relaxed text-[color:var(--ink-faint)]">
            Acrescente a primeira acima. Cada captação abre uma ficha com os
            mesmos campos do site — código, tipo, bairro, metragem, preço,
            textos do anúncio e até {MAXIMO_DE_FOTOS} fotos.
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {gestao.captacoes.map((c) => (
            <LinhaCaptacao key={c.id} captacao={c} gestao={gestao} />
          ))}
        </ul>
      )}
    </>
  );
}

/* Uma captação, fechada como linha e aberta como ficha.

   FECHADA POR PADRÃO porque a fila se lê de relance — o que está em cada
   etapa — e a ficha inteira em cada linha viraria uma parede de formulários.
   Aberta, ela é a mesma ficha do site, campo por campo: o que falta aqui é
   exatamente o que impede o anúncio de subir. */
function LinhaCaptacao({
  captacao: c,
  gestao,
}: {
  captacao: Captacao;
  gestao: GestaoHook;
}) {
  const [aberta, setAberta] = useState(false);
  const faltando = camposQueFaltam(c);

  return (
    <li
      className={`rounded-xl border px-4 py-3 ${
        c.status === "pronta"
          ? "border-[color:var(--cart-titulo)] bg-[color:var(--cart-caixa)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2.5">
            {c.codigo && (
              <span className="font-mono text-xs font-bold text-[color:var(--cart-titulo)]">
                {c.codigo}
              </span>
            )}
            <span className="text-sm font-semibold leading-snug text-[color:var(--ink)]">
              {c.identificacao}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">
            Na fila desde {emDiaMes(c.em)}
            {faltando > 0 && ` · faltam ${faltando} campos da ficha`}
          </p>
        </div>

        <select
          value={c.status}
          onChange={(e) =>
            gestao.mudarCaptacao(c.id, {
              status: e.target.value as StatusCaptacao,
            })
          }
          aria-label={`Status de ${c.identificacao}`}
          className="shrink-0 rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-2.5 py-1.5 text-xs font-semibold text-[color:var(--cart-preco)]"
        >
          {STATUS_CAPTACAO.map((s) => (
            <option key={s} value={s}>
              {rotuloDaCaptacao[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
          className="text-xs font-semibold text-[color:var(--cart-titulo)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
        >
          {/* "Completar" enquanto faltar campo, "Abrir" depois: o verbo diz
              o que há para fazer ali, em vez de só descrever o botão. */}
          {aberta
            ? "Fechar a ficha"
            : faltando > 0
              ? "Completar a ficha"
              : "Abrir a ficha"}
        </button>
        <button
          type="button"
          onClick={() => gestao.removerCaptacao(c.id)}
          className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
        >
          Apagar
        </button>
      </div>

      {aberta && <FichaCaptacao captacao={c} gestao={gestao} />}
    </li>
  );
}

/** Quantos campos da ficha ainda estão em branco. É o que diz, de relance,
    o quanto falta para o imóvel poder ser publicado. */
function camposQueFaltam(c: Captacao): number {
  const obrigatorios: unknown[] = [
    c.tipo,
    c.finalidade,
    c.bairro,
    c.cidade,
    c.endereco,
    c.area,
    c.preco,
    c.resumo,
    c.descricao,
  ];
  return obrigatorios.filter(
    (v) => v === undefined || v === "" || v === null
  ).length;
}

const TIPOS_IMOVEL = [
  "Apartamento",
  "Casa",
  "Terreno",
  "Cobertura",
  "Sala comercial",
  "Galpão",
  "Sítio",
];

function FichaCaptacao({
  captacao: c,
  gestao,
}: {
  captacao: Captacao;
  gestao: GestaoHook;
}) {
  const mudar = (mudanca: Partial<Omit<Captacao, "id">>) =>
    gestao.mudarCaptacao(c.id, mudanca);

  return (
    <div className="mt-3 space-y-5 rounded-xl border border-[color:var(--cart-campo-linha)] bg-white p-4">
      {/* ---------- Identificação ---------- */}
      <Grupo titulo="Identificação">
        <Entrada
          rotulo="Código"
          valor={c.codigo ?? ""}
          dica="TRI1004"
          aoSalvar={(v) => mudar({ codigo: v || undefined })}
        />
        <Escolha
          rotulo="Tipo"
          valor={c.tipo ?? ""}
          opcoes={TIPOS_IMOVEL}
          aoSalvar={(v) => mudar({ tipo: v || undefined })}
        />
        <Escolha
          rotulo="Finalidade"
          valor={c.finalidade ?? ""}
          opcoes={["venda", "aluguel"]}
          aoSalvar={(v) =>
            mudar({ finalidade: (v as "venda" | "aluguel") || undefined })
          }
        />
        <Entrada
          rotulo="Empreendimento"
          valor={c.empreendimento ?? ""}
          dica="Residencial Alta Cittá"
          aoSalvar={(v) => mudar({ empreendimento: v || undefined })}
        />
      </Grupo>

      {/* ---------- Onde fica ---------- */}
      <Grupo titulo="Onde fica">
        <Entrada
          rotulo="Bairro"
          valor={c.bairro ?? ""}
          aoSalvar={(v) => mudar({ bairro: v || undefined })}
        />
        <Entrada
          rotulo="Cidade"
          valor={c.cidade ?? ""}
          dica="Florianópolis"
          aoSalvar={(v) => mudar({ cidade: v || undefined })}
        />
        <Entrada
          rotulo="Endereço"
          valor={c.endereco ?? ""}
          dica="Rua e número, para o mapa"
          largo
          aoSalvar={(v) => mudar({ endereco: v || undefined })}
        />
      </Grupo>

      {/* ---------- A ficha ---------- */}
      <Grupo titulo="A ficha">
        <Numero
          rotulo="Dormitórios"
          valor={c.dormitorios}
          aoSalvar={(v) => mudar({ dormitorios: v })}
        />
        <Numero
          rotulo="Suítes"
          valor={c.suites}
          aoSalvar={(v) => mudar({ suites: v })}
        />
        <Numero
          rotulo="Vagas"
          valor={c.vagas}
          aoSalvar={(v) => mudar({ vagas: v })}
        />
        <Numero
          rotulo="Área privativa (m²)"
          valor={c.area}
          aoSalvar={(v) => mudar({ area: v })}
        />
        <Numero
          rotulo="Área do terreno (m²)"
          valor={c.areaTerreno}
          aoSalvar={(v) => mudar({ areaTerreno: v })}
        />
      </Grupo>

      {/* ---------- Valores ---------- */}
      <Grupo titulo="Valores">
        <Numero
          rotulo="Preço (R$)"
          valor={c.preco}
          aoSalvar={(v) => mudar({ preco: v })}
        />
        <Numero
          rotulo="Condomínio (R$)"
          valor={c.condominio}
          aoSalvar={(v) => mudar({ condominio: v })}
        />
        <Numero
          rotulo="IPTU (R$)"
          valor={c.iptu}
          aoSalvar={(v) => mudar({ iptu: v })}
        />
      </Grupo>

      {/* ---------- Textos ---------- */}
      <Grupo titulo="Textos do anúncio">
        <Entrada
          rotulo="Título"
          valor={c.titulo ?? ""}
          dica="A manchete, se houver uma escrita à mão"
          largo
          aoSalvar={(v) => mudar({ titulo: v || undefined })}
        />
        <Longo
          rotulo="Resumo"
          valor={c.resumo ?? ""}
          dica="Uma frase: o que o imóvel tem de melhor"
          linhas={2}
          aoSalvar={(v) => mudar({ resumo: v || undefined })}
        />
        <Longo
          rotulo="Descrição"
          valor={c.descricao ?? ""}
          dica="Um parágrafo por linha"
          linhas={4}
          aoSalvar={(v) => mudar({ descricao: v || undefined })}
        />
        <Longo
          rotulo="Diferenciais"
          valor={c.diferenciais ?? ""}
          dica="Um por linha: churrasqueira, vista para o mar…"
          linhas={3}
          aoSalvar={(v) => mudar({ diferenciais: v || undefined })}
        />
        <Entrada
          rotulo="Selos"
          valor={(c.selos ?? []).join(", ")}
          dica="Mobiliado, Aceita permuta — separados por vírgula"
          largo
          aoSalvar={(v) =>
            mudar({
              selos: v
                ? v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
            })
          }
        />
      </Grupo>

      {/* ---------- Fotos ---------- */}
      <FotosDaCaptacao captacao={c.id} />

      {/* ---------- Observação ---------- */}
      <div>
        <p className="t-label font-bold text-[color:var(--cart-titulo)]">
          Observação
        </p>
        <CampoLivre
          valor={c.nota ?? ""}
          rotulo="Observação da captação"
          dica="O que falta, com quem está, prazo"
          aoSalvar={(nota) => mudar({ nota: nota || undefined })}
        />
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   FOTOS
   ----------------------------------------------------------------------------- */

function FotosDaCaptacao({ captacao }: { captacao: string }) {
  const [fotos, setFotos] = useState<FotoGuardada[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [recusadas, setRecusadas] = useState<string[]>([]);

  /* As URLs de objeto precisam ser revogadas quando a lista muda, senão o
     navegador segura cada blob na memória até a aba fechar. */
  const urls = useMemo(
    () => fotos.map((f) => ({ id: f.id, url: URL.createObjectURL(f.blob) })),
    [fotos]
  );
  useEffect(() => {
    return () => urls.forEach((u) => URL.revokeObjectURL(u.url));
  }, [urls]);

  const recarregar = useCallback(async () => {
    setFotos(await lerFotos(captacao));
  }, [captacao]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const aoEscolher = async (lista: FileList | null) => {
    if (!lista || lista.length === 0) return;
    setCarregando(true);
    setRecusadas([]);
    const r = await guardarFotos(captacao, Array.from(lista), fotos.length);
    if (r.recusadas.length > 0) setRecusadas(r.recusadas);
    await recarregar();
    setCarregando(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="t-label font-bold text-[color:var(--cart-titulo)]">
          Fotos
        </p>
        <p className="text-xs text-[color:var(--ink-faint)]">
          {fotos.length} de {MAXIMO_DE_FOTOS}
        </p>
      </div>

      {fotos.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {urls.map((u, i) => (
            <li key={u.id} className="group relative">
              {/* `img` cru, e não `next/image`: a origem é um blob: do
                  navegador, que o otimizador do Next não consegue buscar. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u.url}
                alt={`Foto ${i + 1}${i === 0 ? ", capa" : ""}`}
                className="aspect-[4/3] w-full rounded-lg object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-[color:var(--cart-acao)] px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase text-[color:var(--cart-acao-ink)]">
                  Capa
                </span>
              )}
              <button
                type="button"
                onClick={async () => {
                  await apagarFoto(u.id);
                  await recarregar();
                }}
                aria-label={`Apagar a foto ${i + 1}`}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-xs font-bold text-white opacity-0 transition-opacity duration-200 focus:opacity-100 group-hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--cart-campo-linha)] px-3.5 py-2 text-xs font-semibold text-[color:var(--cart-preco)] transition-colors duration-200 hover:border-[color:var(--cart-titulo)] hover:bg-[color:var(--cart-caixa)]">
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={carregando || fotos.length >= MAXIMO_DE_FOTOS}
            onChange={(e) => {
              void aoEscolher(e.target.files);
              /* Limpa o input: sem isto, escolher o mesmo arquivo duas
                 vezes seguidas não dispara o evento. */
              e.target.value = "";
            }}
          />
          {carregando
            ? "Reduzindo…"
            : fotos.length >= MAXIMO_DE_FOTOS
              ? "Limite de fotos atingido"
              : "Escolher fotos"}
        </label>
      </div>

      {recusadas.length > 0 && (
        <p className="mt-2 text-xs leading-snug text-[color:var(--ink-muted)]">
          Não entraram: {recusadas.join(", ")}.
        </p>
      )}

      <p className="mt-2 text-xs leading-snug text-[color:var(--ink-faint)]">
        As fotos são reduzidas e ficam <strong>neste navegador</strong>. Não
        chegam à imobiliária nem ao site, e somem se você trocar de aparelho ou
        limpar os dados. Servem para montar a ficha.
      </p>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   OS CAMPOS DA FICHA
   -----------------------------------------------------------------------------
   Todos salvam AO SAIR DO CAMPO. Gravar por tecla, com o localStorage, é
   invisível; com servidor seria uma requisição por letra digitada.
   ----------------------------------------------------------------------------- */

function Grupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="t-label font-bold text-[color:var(--cart-titulo)]">
        {titulo}
      </p>
      <div className="mt-2.5 grid gap-x-4 gap-y-3 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

const CLASSE_CAMPO =
  "mt-1 w-full rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]";

function Entrada({
  rotulo,
  valor,
  dica,
  largo,
  aoSalvar,
}: {
  rotulo: string;
  valor: string;
  dica?: string;
  largo?: boolean;
  aoSalvar: (v: string) => void;
}) {
  const [texto, setTexto] = useState(valor);
  return (
    <label className={largo ? "sm:col-span-2" : undefined}>
      <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
        {rotulo}
      </span>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          if (texto.trim() !== valor) aoSalvar(texto.trim());
        }}
        placeholder={dica}
        className={CLASSE_CAMPO}
      />
    </label>
  );
}

function Numero({
  rotulo,
  valor,
  aoSalvar,
}: {
  rotulo: string;
  valor: number | undefined;
  aoSalvar: (v: number | undefined) => void;
}) {
  const [texto, setTexto] = useState(valor === undefined ? "" : String(valor));
  return (
    <label>
      <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
        {rotulo}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          const n = texto.trim() === "" ? undefined : Number(texto);
          /* Campo vazio apaga o valor; texto que não é número não grava
             nada, em vez de gravar NaN e quebrar a conta depois. */
          if (n !== undefined && Number.isNaN(n)) return;
          if (n !== valor) aoSalvar(n);
        }}
        className={CLASSE_CAMPO}
      />
    </label>
  );
}

function Escolha({
  rotulo,
  valor,
  opcoes,
  aoSalvar,
}: {
  rotulo: string;
  valor: string;
  opcoes: string[];
  aoSalvar: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
        {rotulo}
      </span>
      <select
        value={valor}
        onChange={(e) => aoSalvar(e.target.value)}
        className={CLASSE_CAMPO}
      >
        <option value="">—</option>
        {opcoes.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Longo({
  rotulo,
  valor,
  dica,
  linhas,
  aoSalvar,
}: {
  rotulo: string;
  valor: string;
  dica?: string;
  linhas: number;
  aoSalvar: (v: string) => void;
}) {
  const [texto, setTexto] = useState(valor);
  return (
    <label className="sm:col-span-2">
      <span className="text-xs font-semibold text-[color:var(--ink-muted)]">
        {rotulo}
      </span>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          if (texto.trim() !== valor) aoSalvar(texto.trim());
        }}
        rows={linhas}
        placeholder={dica}
        className={`${CLASSE_CAMPO} resize-y`}
      />
    </label>
  );
}

function CampoLivre({
  valor,
  rotulo,
  dica,
  aoSalvar,
}: {
  valor: string;
  rotulo: string;
  dica?: string;
  aoSalvar: (v: string) => void;
}) {
  const [texto, setTexto] = useState(valor);
  return (
    <input
      type="text"
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
      onBlur={() => {
        if (texto.trim() !== valor) aoSalvar(texto.trim());
      }}
      placeholder={dica}
      aria-label={rotulo}
      className={CLASSE_CAMPO}
    />
  );
}

/* -----------------------------------------------------------------------------
   INVESTIDORES — a frente de relacionamento
   ----------------------------------------------------------------------------- */

const STATUS_INVESTIDOR: StatusInvestidor[] = [
  "a-contatar",
  "agendada",
  "realizada",
  "retorno",
  "encerrada",
];

function Investidores({ gestao }: { gestao: GestaoHook }) {
  const [referencia, setReferencia] = useState("");
  const [interesse, setInteresse] = useState("");

  const salvar = () => {
    const r = referencia.trim();
    if (!r) return;
    gestao.adicionarInvestidor({
      referencia: r,
      interesse: interesse.trim() || undefined,
      status: "a-contatar",
    });
    setReferencia("");
    setInteresse("");
  };

  return (
    <>
      <p className="text-xs leading-snug text-[color:var(--ink-faint)]">
        Empresários e investidores em contato. Use iniciais, codinome ou o
        código do negócio — nome e telefone não entram aqui enquanto o acesso
        não for de verdade.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
        className="mt-4 flex flex-wrap gap-2"
      >
        <input
          type="text"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          placeholder="Referência (ex.: J.M. / construtora)"
          aria-label="Referência do investidor"
          className="min-w-0 flex-1 rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
        />
        <input
          type="text"
          value={interesse}
          onChange={(e) => setInteresse(e.target.value)}
          placeholder="Interesse"
          aria-label="Interesse do investidor"
          className="min-w-0 flex-1 rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
        />
        <button
          type="submit"
          disabled={!referencia.trim()}
          className="shrink-0 rounded-lg bg-[color:var(--cart-pilula)] px-4 py-2 text-xs font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
        >
          Acrescentar
        </button>
      </form>

      {gestao.investidores.length === 0 ? (
        <Vazio texto="Nenhum contato registrado." />
      ) : (
        <ul className="mt-4 space-y-3">
          {gestao.investidores.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-[color:var(--cart-card-linha)] px-4 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-[color:var(--ink)]">
                    {c.referencia}
                  </p>
                  {c.interesse && (
                    <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">
                      {c.interesse}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <input
                    type="date"
                    value={c.data ?? ""}
                    onChange={(e) =>
                      gestao.mudarInvestidor(c.id, {
                        data: e.target.value || undefined,
                      })
                    }
                    aria-label={`Data da visita de ${c.referencia}`}
                    className="rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-2 py-1.5 text-xs text-[color:var(--cart-preco)]"
                  />
                  <select
                    value={c.status}
                    onChange={(e) =>
                      gestao.mudarInvestidor(c.id, {
                        status: e.target.value as StatusInvestidor,
                      })
                    }
                    aria-label={`Status de ${c.referencia}`}
                    className="rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-2.5 py-1.5 text-xs font-semibold text-[color:var(--cart-preco)]"
                  >
                    {STATUS_INVESTIDOR.map((s) => (
                      <option key={s} value={s}>
                        {rotuloDoInvestidor[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <CampoNota
                valor={c.nota ?? ""}
                rotulo={`Observação de ${c.referencia}`}
                aoSalvar={(nota) => gestao.mudarInvestidor(c.id, { nota })}
                aoRemover={() => gestao.removerInvestidor(c.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* Observação de uma linha, salva ao SAIR DO CAMPO e não a cada tecla.
   Com o localStorage a diferença é invisível; quando a fonte virar servidor,
   gravar por tecla seria uma requisição por letra digitada. */
function CampoNota({
  valor,
  rotulo,
  aoSalvar,
  aoRemover,
}: {
  valor: string;
  rotulo: string;
  aoSalvar: (nota: string) => void;
  aoRemover: () => void;
}) {
  const [texto, setTexto] = useState(valor);

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => {
          if (texto.trim() !== valor) aoSalvar(texto.trim());
        }}
        placeholder="Observação"
        aria-label={rotulo}
        className="min-w-0 flex-1 rounded-lg border border-transparent bg-[color:var(--cart-caixa)] px-3 py-1.5 text-xs text-[color:var(--cart-preco)] transition-colors duration-200 placeholder:text-[color:var(--ink-faint)] focus:border-[color:var(--cart-campo-linha)] focus:bg-white"
      />
      <button
        type="button"
        onClick={aoRemover}
        className="shrink-0 text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
      >
        Apagar
      </button>
    </div>
  );
}

function Vazio({ texto }: { texto: string }) {
  return (
    <p className="mt-4 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-4 py-5 text-center text-sm text-[color:var(--ink-faint)]">
      {texto}
    </p>
  );
}

/** "24/11", a partir de "2026-11-24". */
function emDiaMes(data: string): string {
  const [, mes, dia] = data.split("-");
  return mes && dia ? `${dia}/${mes}` : data;
}

/* =============================================================================
   A SEMANA
   ============================================================================= */

function Semana({
  perfil,
  metas,
  gestao,
}: {
  perfil: PerfilCorretor;
  metas: MetasHook;
  gestao: GestaoHook;
}) {
  return (
    <section className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-5 shadow-[var(--cart-sombra)] md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="t-label font-bold text-[color:var(--cart-titulo)]">
          Segunda a domingo
        </h2>
        <p className="text-xs text-[color:var(--ink-faint)]">
          Rotina da casa e os seus compromissos
        </p>
      </div>

      <ol className="mt-5 space-y-3">
        {gestao.dias.map((dia) => (
          <Dia key={dia.data} dia={dia} gestao={gestao} />
        ))}
      </ol>

      <Fechamento perfil={perfil} metas={metas} gestao={gestao} />
    </section>
  );
}

function Dia({ dia, gestao }: { dia: DiaDaSemana; gestao: GestaoHook }) {
  const [abrindo, setAbrindo] = useState(false);
  const tarefas = rotinaDoDia(dia.iso);
  const compromissos = gestao.doDia(dia.data);
  const vazio = tarefas.length === 0 && compromissos.length === 0;

  return (
    <li
      className={`rounded-xl border px-4 py-3.5 transition-colors duration-200 ${
        dia.hoje
          ? "border-[color:var(--cart-titulo)] bg-[color:var(--cart-caixa)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[0.9375rem] font-bold text-[color:var(--ink)]">
          {nomeDoDia[dia.iso]}{" "}
          <span className="font-mono text-xs font-semibold text-[color:var(--ink-faint)]">
            {dia.curta}
          </span>
        </h3>
        {dia.hoje && (
          <span className="rounded-full bg-[color:var(--cart-acao)] px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-[color:var(--cart-acao-ink)]">
            Hoje
          </span>
        )}
      </div>

      {tarefas.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {tarefas.map((t) => (
            <ItemDaRotina key={t.chave} tarefa={t} gestao={gestao} />
          ))}
        </ul>
      )}

      {compromissos.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-dashed border-[color:var(--cart-campo-linha)] pt-3">
          {compromissos.map((c) => (
            <ItemDeAgenda key={c.id} compromisso={c} aoRemover={gestao.remover} />
          ))}
        </ul>
      )}

      {vazio && !abrindo && (
        <p className="mt-2 text-xs text-[color:var(--ink-faint)]">
          Nada marcado.
        </p>
      )}

      {abrindo ? (
        <FormCompromisso
          data={dia.data}
          aoSalvar={(novo) => {
            gestao.adicionar(novo);
            setAbrindo(false);
          }}
          aoFechar={() => setAbrindo(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAbrindo(true)}
          className="mt-3 text-xs font-semibold text-[color:var(--cart-titulo)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
        >
          + Compromisso
        </button>
      )}
    </li>
  );
}

/* Uma tarefa da rotina da casa.

   Tarefa sem quantidade é uma caixa: fez ou não fez. Com quantidade pequena,
   a fileira de bolinhas — dá para ver o quanto falta sem ler número, como nas
   metas. Acima de seis bolinhas a fileira vira ruído e entra o contador com
   menos e mais: "dez ligações" não se conta no olho. */
function ItemDaRotina({
  tarefa,
  gestao,
}: {
  tarefa: TarefaDaRotina;
  gestao: GestaoHook;
}) {
  const alvo = tarefa.quantidade ?? 1;
  const n = gestao.pronto ? gestao.feitoNaRotina(tarefa.chave) : 0;
  const completa = n >= alvo;

  return (
    <li className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug ${
            completa
              ? "text-[color:var(--ink-faint)] line-through"
              : "font-semibold text-[color:var(--cart-ficha)]"
          }`}
        >
          {tarefa.titulo}
          {/* O "×N" só entra a partir de dois. Tarefa de quantidade 1 vira
              caixa de marcar, e um "×1" ao lado dela não diz nada. */}
          {alvo > 1 ? (
            <span className="ml-1.5 font-mono text-xs font-semibold text-[color:var(--ink-faint)]">
              ×{alvo}
            </span>
          ) : null}
        </p>
        {tarefa.observacao && (
          <p className="mt-0.5 text-xs leading-snug text-[color:var(--ink-faint)]">
            {tarefa.observacao}
          </p>
        )}
      </div>

      {gestao.pronto && (
        <div className="shrink-0 pt-0.5">
          {alvo === 1 ? (
            <button
              type="button"
              onClick={() => gestao.marcarRotina(tarefa.chave, n >= 1 ? 0 : 1)}
              aria-pressed={completa}
              aria-label={`${tarefa.titulo}: marcar como feito`}
              className={`grid h-6 w-6 place-items-center rounded-md border-2 transition-colors duration-200 ${
                completa
                  ? "border-[color:var(--cart-acao)] bg-[color:var(--cart-acao)] text-[color:var(--cart-acao-ink)]"
                  : "border-[color:var(--cart-campo-linha)] hover:border-[color:var(--cart-titulo)]"
              }`}
            >
              {completa && (
                <span aria-hidden="true" className="text-xs font-bold">
                  &#10003;
                </span>
              )}
            </button>
          ) : alvo <= 6 ? (
            <span
              className="flex items-center gap-1.5"
              role="group"
              aria-label={`${tarefa.titulo}: ${n} de ${alvo} nesta semana`}
            >
              {Array.from({ length: alvo }).map((_, i) => {
                const cheia = i < n;
                return (
                  <button
                    key={i}
                    type="button"
                    /* Clicar na bolinha i define a contagem como i+1; clicar
                       na última cheia desmarca. Corrigir um engano é um
                       toque, não vários. */
                    onClick={() =>
                      gestao.marcarRotina(
                        tarefa.chave,
                        cheia && i + 1 === n ? i : i + 1
                      )
                    }
                    aria-pressed={cheia}
                    aria-label={
                      cheia
                        ? `Desmarcar ${i + 1}`
                        : `Marcar ${i + 1} como feito`
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
          ) : (
            <span
              className="flex items-center gap-1"
              role="group"
              aria-label={`${tarefa.titulo}: ${n} de ${alvo} nesta semana`}
            >
              <BotaoPasso
                rotulo={`Tirar um de ${tarefa.titulo}`}
                sinal="&minus;"
                desligado={n <= 0}
                aoClicar={() => gestao.marcarRotina(tarefa.chave, n - 1)}
              />
              <span
                aria-hidden="true"
                className={`w-12 text-center font-mono text-xs font-bold ${
                  completa
                    ? "text-[color:var(--cart-titulo)]"
                    : "text-[color:var(--cart-preco)]"
                }`}
              >
                {n}/{alvo}
              </span>
              <BotaoPasso
                rotulo={`Somar um em ${tarefa.titulo}`}
                sinal="+"
                desligado={n >= alvo}
                aoClicar={() => gestao.marcarRotina(tarefa.chave, n + 1)}
              />
            </span>
          )}
        </div>
      )}
    </li>
  );
}

function BotaoPasso({
  rotulo,
  sinal,
  desligado,
  aoClicar,
}: {
  rotulo: string;
  sinal: string;
  desligado: boolean;
  aoClicar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={desligado}
      aria-label={rotulo}
      className="grid h-6 w-6 place-items-center rounded-md border border-[color:var(--cart-campo-linha)] text-sm font-bold text-[color:var(--cart-preco)] transition-colors duration-200 hover:border-[color:var(--cart-titulo)] hover:bg-[color:var(--cart-caixa)] disabled:opacity-35 disabled:hover:border-[color:var(--cart-campo-linha)] disabled:hover:bg-transparent"
      dangerouslySetInnerHTML={{ __html: sinal }}
    />
  );
}

function ItemDeAgenda({
  compromisso,
  aoRemover,
}: {
  compromisso: Compromisso;
  aoRemover: (id: string) => void;
}) {
  return (
    <li className="group flex items-baseline gap-2.5">
      <span className="w-11 shrink-0 font-mono text-xs font-bold text-[color:var(--cart-titulo)]">
        {compromisso.hora ?? "—"}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-snug text-[color:var(--cart-ficha)]">
        <span className="font-semibold">
          {rotuloDoTipo[compromisso.tipo]}
        </span>{" "}
        · {compromisso.titulo}
        {compromisso.local && (
          <span className="text-[color:var(--ink-faint)]">
            {" "}
            — {compromisso.local}
          </span>
        )}
      </span>
      <button
        type="button"
        onClick={() => aoRemover(compromisso.id)}
        aria-label={`Apagar ${compromisso.titulo}`}
        className="shrink-0 text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
      >
        Apagar
      </button>
    </li>
  );
}

const TIPOS: TipoCompromisso[] = [
  "visita",
  "vistoria",
  "plantao",
  "reuniao",
  "ligacao",
  "outro",
];

function FormCompromisso({
  data,
  aoSalvar,
  aoFechar,
}: {
  data: string;
  aoSalvar: (novo: Omit<Compromisso, "id">) => void;
  aoFechar: () => void;
}) {
  const [tipo, setTipo] = useState<TipoCompromisso>("visita");
  const [titulo, setTitulo] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");

  const enviar = useCallback(() => {
    const t = titulo.trim();
    if (!t) return;
    aoSalvar({
      data,
      tipo,
      titulo: t,
      hora: hora || undefined,
      local: local.trim() || undefined,
    });
  }, [aoSalvar, data, hora, local, tipo, titulo]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
      className="mt-3 space-y-2.5 rounded-xl border border-[color:var(--cart-campo-linha)] bg-white p-3"
    >
      <div className="flex flex-wrap gap-2">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoCompromisso)}
          aria-label="Tipo de compromisso"
          className="rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-2.5 py-2 text-sm text-[color:var(--cart-preco)]"
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {rotuloDoTipo[t]}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          aria-label="Hora"
          className="rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-2.5 py-2 text-sm text-[color:var(--cart-preco)]"
        />
      </div>

      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        /* O autofoco é certo aqui: o campo só existe depois de a pessoa
           clicar em "+ Compromisso", então é exatamente onde ela vai
           escrever. */
        autoFocus
        placeholder="O que é"
        aria-label="O que é"
        className="w-full rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
      />

      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Onde (opcional)"
        aria-label="Onde"
        className="w-full rounded-lg border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-campo)] px-3 py-2 text-sm text-[color:var(--cart-preco)] placeholder:text-[color:var(--ink-faint)]"
      />

      {/* Sem nome de cliente nem telefone: enquanto o acesso for conferido no
          navegador, dado de cliente não entra aqui. */}
      <p className="text-[0.6875rem] leading-snug text-[color:var(--ink-faint)]">
        Não escreva nome, telefone ou dado de cliente.
      </p>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={!titulo.trim()}
          className="rounded-lg bg-[color:var(--cart-acao)] px-3.5 py-2 text-xs font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={aoFechar}
          className="text-xs text-[color:var(--ink-faint)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-preco)]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

/* =============================================================================
   FECHAMENTO DA SEMANA
   -----------------------------------------------------------------------------
   A ponte até existir banco de dados. Monta o texto do que a semana teve e
   copia para a área de transferência; o corretor cola no grupo da gestão.

   O texto é feito para ser lido no WhatsApp: linhas curtas, sem tabela, sem
   emoji. E só entra o que tem conteúdo — dia sem nada não aparece, senão o
   resumo de uma semana fraca fica do mesmo tamanho de uma cheia.
   ============================================================================= */

function Fechamento({
  perfil,
  metas,
  gestao,
}: {
  perfil: PerfilCorretor;
  metas: MetasHook;
  gestao: GestaoHook;
}) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState(false);

  const montar = useCallback((): string => {
    const linhas: string[] = [];
    const nome = perfil.nome.startsWith("[") ? perfil.usuario : perfil.nome;

    linhas.push(`Fechamento da semana — ${metas.intervalo}`);
    linhas.push(perfil.creci.startsWith("[") ? nome : `${nome} · CRECI ${perfil.creci}`);

    const comMeta = perfil.metas ?? [];
    if (comMeta.length > 0) {
      linhas.push("", "METAS");
      for (const m of comMeta) {
        if (m.alvo === null) {
          linhas.push(`- ${m.rotulo}: alvo a definir`);
          continue;
        }
        const n = metas.feito(m.chave);
        linhas.push(
          `- ${m.rotulo}: ${n} de ${m.alvo}${n >= m.alvo ? " (feita)" : ""}`
        );
      }
    }

    const daRotina: string[] = [];
    for (const dia of gestao.dias) {
      for (const t of rotinaDoDia(dia.iso)) {
        const n = gestao.feitoNaRotina(t.chave);
        if (n <= 0) continue;
        const alvo = t.quantidade ?? 1;
        daRotina.push(
          `- ${nomeDoDia[dia.iso]}: ${t.titulo}${
            t.quantidade ? ` — ${n} de ${alvo}` : ""
          }`
        );
      }
    }
    if (daRotina.length > 0) linhas.push("", "ROTINA DA CASA", ...daRotina);

    const daAgenda: string[] = [];
    for (const dia of gestao.dias) {
      for (const c of gestao.doDia(dia.data)) {
        daAgenda.push(
          `- ${nomeDoDia[dia.iso]} ${dia.curta}${c.hora ? ` ${c.hora}` : ""} — ${
            rotuloDoTipo[c.tipo]
          }: ${c.titulo}${c.local ? ` (${c.local})` : ""}`
        );
      }
    }
    if (daAgenda.length > 0) linhas.push("", "AGENDA", ...daAgenda);

    return linhas.join("\n");
  }, [gestao, metas, perfil]);

  const copiar = useCallback(async () => {
    const texto = montar();
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setErro(false);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* Sem permissão de área de transferência, ou contexto não seguro: o
         texto aparece na tela para a pessoa copiar na mão, em vez de o botão
         não fazer nada. */
      setErro(true);
    }
  }, [montar]);

  return (
    <div className="mt-6 border-t border-[color:var(--cart-card-linha)] pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[color:var(--ink)]">
            Fechamento da semana
          </p>
          <p className="mt-0.5 text-xs leading-snug text-[color:var(--ink-faint)]">
            Copia o resumo pronto para mandar à gestão.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void copiar()}
          className="rounded-xl bg-[color:var(--cart-pilula)] px-4 py-2.5 text-sm font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90"
        >
          {copiado ? "Copiado" : "Copiar resumo"}
        </button>
      </div>

      {erro && (
        <>
          <p className="mt-3 text-xs text-[color:var(--ink-muted)]">
            O navegador não deixou copiar. Selecione o texto abaixo.
          </p>
          <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-caixa)] p-3 text-xs leading-relaxed text-[color:var(--cart-ficha)]">
            {montar()}
          </pre>
        </>
      )}
    </div>
  );
}

/* =============================================================================
   METAS
   -----------------------------------------------------------------------------
   As mesmas metas do cartão do treinamento, pelo mesmo gancho: o que for
   marcado num lugar aparece no outro. Aqui elas ganham barra, porque esta é a
   tela em que se vem para saber como a semana está indo; lá são um resumo ao
   lado do perfil.
   ============================================================================= */

function Metas({
  metas,
  metasHook,
}: {
  metas: MetaCorretor[];
  metasHook: MetasHook;
}) {
  const { pronto, feito, marcar } = metasHook;

  return (
    <section className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-5 shadow-[var(--cart-sombra)]">
      <h2 className="t-label font-bold text-[color:var(--cart-titulo)]">
        Metas
      </h2>

      <ul className="mt-4 space-y-5">
        {metas.map((m) => {
          const semAlvo = m.alvo === null;
          const alvo = m.alvo ?? 0;
          const n = pronto ? feito(m.chave) : 0;
          const completa = !semAlvo && n >= alvo;
          const percentual =
            semAlvo || alvo === 0 ? 0 : Math.min(100, Math.round((n / alvo) * 100));

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
                      : "font-semibold text-[color:var(--cart-preco)]"
                  }`}
                >
                  {semAlvo
                    ? "A definir"
                    : `${n} de ${alvo} · por ${m.periodo === "semana" ? "semana" : "mês"}`}
                </p>
              </div>

              {!semAlvo && (
                <>
                  <div
                    role="progressbar"
                    aria-valuenow={n}
                    aria-valuemin={0}
                    aria-valuemax={alvo}
                    aria-label={`${m.rotulo}: ${n} de ${alvo}`}
                    className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--cart-caixa)]"
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ease-[var(--cart-curva)] ${
                        completa
                          ? "bg-[color:var(--cart-titulo)]"
                          : "bg-[color:var(--cart-acao)]"
                      }`}
                      style={{ width: `${percentual}%` }}
                    />
                  </div>

                  {pronto && (
                    <div className="mt-2 flex items-center gap-2">
                      <BotaoPasso
                        rotulo={`Tirar um de ${m.rotulo}`}
                        sinal="&minus;"
                        desligado={n <= 0}
                        aoClicar={() => marcar(m.chave, n - 1)}
                      />
                      <BotaoPasso
                        rotulo={`Somar um em ${m.rotulo}`}
                        sinal="+"
                        desligado={false}
                        aoClicar={() => marcar(m.chave, n + 1)}
                      />
                      {completa && (
                        <span className="text-xs font-bold text-[color:var(--cart-titulo)]">
                          feita
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}

              {m.criterio && (
                <p className="mt-2 text-xs leading-snug text-[color:var(--ink-faint)]">
                  {m.criterio}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* A meta de mês tem um problema honesto: a contagem zera na virada da
          semana, porque é assim que o registro semanal funciona. Dizer isso
          vale mais do que mostrar um número que o corretor vai achar errado
          na segunda-feira. */}
      {metas.some((m) => m.periodo === "mes") && (
        <p className="mt-5 border-t border-dashed border-[color:var(--cart-campo-linha)] pt-4 text-xs leading-snug text-[color:var(--ink-faint)]">
          A contagem zera na virada da semana. Meta de mês só fecha de verdade
          com o banco de dados.
        </p>
      )}
    </section>
  );
}

/* =============================================================================
   PREMIAÇÕES
   -----------------------------------------------------------------------------
   Premiação de meta própria se apura aqui. Premiação de ranking não: comparar
   corretores exige os números de todos ao mesmo tempo, e isso é banco. Ela
   aparece trancada, dizendo o que falta — a premiação está decidida, só não
   dá para apurar ainda.
   ============================================================================= */

function Premiacoes({
  metas,
  metasHook,
}: {
  metas: MetaCorretor[];
  metasHook: MetasHook;
}) {
  return (
    <section className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-5 shadow-[var(--cart-sombra)]">
      <h2 className="t-label font-bold text-[color:var(--cart-titulo)]">
        Premiações
      </h2>

      <ul className="mt-4 space-y-4">
        {premiacoesDaCasa.map((p) => (
          <ItemDePremiacao
            key={p.chave}
            premiacao={p}
            metas={metas}
            metasHook={metasHook}
          />
        ))}
      </ul>
    </section>
  );
}

function ItemDePremiacao({
  premiacao,
  metas,
  metasHook,
}: {
  premiacao: Premiacao;
  metas: MetaCorretor[];
  metasHook: MetasHook;
}) {
  const { condicao } = premiacao;
  const recompensaPendente = premiacao.recompensa.startsWith("[");

  /* Só se apura o que depende de uma pessoa só E fecha dentro da semana, que
     é o período que o registro guarda. */
  const apuravel = condicao.tipo === "meta" && premiacao.periodo === "semana";
  const n =
    condicao.tipo === "meta" && metasHook.pronto
      ? metasHook.feito(condicao.meta)
      : 0;
  const alvo = condicao.tipo === "meta" ? condicao.alvo : 0;
  const ganha = apuravel && n >= alvo;

  const rotuloDoPeriodo =
    premiacao.periodo === "semana"
      ? "na semana"
      : premiacao.periodo === "mes"
        ? "no mês"
        : "no trimestre";

  /* A premiação pode cobrar mais do que a meta pede — três agenciamentos
     contra os dois da meta —, e nesse caso convém dizer de onde o número sai,
     senão parece erro de contagem. */
  const daMeta =
    condicao.tipo === "meta"
      ? metas.find((m) => m.chave === condicao.meta)
      : undefined;

  return (
    <li
      className={`rounded-xl border px-3.5 py-3 ${
        ganha
          ? "border-[color:var(--cart-titulo)] bg-[color:var(--cart-caixa)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-[color:var(--ink)]">
          {premiacao.titulo}
        </p>
        {ganha && (
          <span className="shrink-0 rounded-full bg-[color:var(--cart-acao)] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-[color:var(--cart-acao-ink)]">
            Batida
          </span>
        )}
      </div>

      <p
        className={`mt-1 text-xs ${
          recompensaPendente
            ? "italic text-[color:var(--ink-faint)]"
            : "font-semibold text-[color:var(--cart-titulo)]"
        }`}
      >
        {recompensaPendente ? "Recompensa a definir" : premiacao.recompensa}
        <span className="font-normal text-[color:var(--ink-faint)]">
          {" "}
          · {rotuloDoPeriodo}
        </span>
      </p>

      {apuravel && condicao.tipo === "meta" ? (
        <p className="mt-2 font-mono text-xs font-bold text-[color:var(--cart-preco)]">
          {n}/{alvo}
          {daMeta?.rotulo ? (
            <span className="ml-1.5 font-sans font-normal text-[color:var(--ink-faint)]">
              {daMeta.rotulo.toLowerCase()}
            </span>
          ) : null}
        </p>
      ) : (
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-[color:var(--ink-faint)]">
          <span aria-hidden="true">&#128274;</span>
          <span>
            {condicao.tipo === "ranking"
              ? "Comparar corretores precisa dos números de todos — depende do banco de dados."
              : "Apuração fora da semana precisa do banco de dados."}
          </span>
        </p>
      )}
    </li>
  );
}

/* =============================================================================
   FICHA
   -----------------------------------------------------------------------------
   A credencial do corretor. O CRECI fica aqui, à vista do próprio — o
   registro vence, e o primeiro a notar tem de ser quem depende dele. É por
   isso que o vencimento aparece mesmo vazio, como pendência: campo que falta
   e não se mostra nunca é preenchido.
   ============================================================================= */

function Ficha({ perfil }: { perfil: PerfilCorretor }) {
  const pendente = (v: string) => v.startsWith("[");
  const tempo = tempoDeMercado(perfil.atuaDesde);
  const semNome = pendente(perfil.nome);
  const formacao = perfil.formacao.filter((f) => !pendente(f));

  return (
    <section className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-5 shadow-[var(--cart-sombra)] md:p-6">
      {/* O retrato e o nome abrem a faixa. O avatar cresce em relação ao da
          lateral: numa faixa larga o círculo pequeno virava um detalhe
          perdido no canto. */}
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

      {/* DUAS COLUNAS, E NÃO TRÊS. A ficha dividia a faixa inteira com
          ninguém e podia espalhar os campos; agora ela ocupa 22rem ao lado
          do monitoramento, e em três colunas os rótulos — "VENCIMENTO DO
          REGISTRO" em caixa-alta espaçada — não cabiam numa linha. */}
      <dl className="mt-5 grid gap-x-6 gap-y-4 border-t border-[color:var(--cart-card-linha)] pt-4 sm:grid-cols-2">
        <Campo rotulo="CRECI" pendente={pendente(perfil.creci)}>
          {pendente(perfil.creci) ? "A preencher" : perfil.creci}
        </Campo>

        <Campo rotulo="Vencimento do registro" pendente={!perfil.creciVence}>
          {perfil.creciVence
            ? new Date(`${perfil.creciVence}T12:00:00`).toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "long", year: "numeric" }
              )
            : "A preencher"}
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

      {/* A FORMAÇÃO OCUPA A LINHA INTEIRA, e os cursos correm lado a lado
          em vez de empilhar. São cinco títulos longos: numa das colunas
          acima, eles sozinhos dariam à faixa o triplo da altura do resto.
          O ponto verde passa a separar um curso do outro, que é o trabalho
          que ele já fazia como marcador de lista. */}
      <div className="mt-4 border-t border-[color:var(--cart-card-linha)] pt-4">
        <p className="t-label font-bold text-[color:var(--cart-titulo)]">
          Formação
        </p>
        {formacao.length === 0 ? (
          <p className="mt-2 text-sm italic text-[color:var(--ink-faint)]">
            A preencher
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {formacao.map((f, i) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm leading-snug text-[color:var(--cart-ficha)]"
              >
                {/* O ponto é decorativo e separa os cursos; o primeiro não
                    tem ponto antes porque não há nada para separar dele. */}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--cart-titulo)]"
                  />
                )}
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
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
      <dt className="t-label font-bold text-[color:var(--cart-titulo)]">
        {rotulo}
      </dt>
      <dd
        className={`mt-1.5 text-sm leading-relaxed ${
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
