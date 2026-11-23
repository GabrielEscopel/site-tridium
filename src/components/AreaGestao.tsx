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

import { useCallback, useState } from "react";
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
import { marcas } from "@/content/site";
import { useMetasCorretor } from "@/lib/metasCorretor";
import { useSessaoCorretor } from "@/lib/sessaoCorretor";
import {
  rotuloDoTipo,
  useGestaoCorretor,
  type Compromisso,
  type DiaDaSemana,
  type TipoCompromisso,
} from "@/lib/gestaoCorretor";

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
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8">
          {/* A FICHA ABRE A COLUNA LARGA, e não fecha a lateral.
              Ela é a credencial do corretor — CRECI, formação, tempo de
              mercado — e estava no pé da coluna da direita, abaixo de metas
              e premiações: para vê-la era preciso rolar a página inteira.

              DEITADA, e não o cartão vertical que estava na lateral. Num
              bloco com a largura da coluna principal, o cartão em pé
              deixaria dois terços de vazio ao lado. Deitado, o retrato e o
              nome abrem a faixa e os campos se distribuem embaixo. */}
          <div className="space-y-6">
            <Ficha perfil={perfil} />
            <Semana perfil={perfil} metas={metas} gestao={gestao} />
          </div>

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

      {/* OS CAMPOS CURTOS LADO A LADO. Empilhados, como estavam na coluna
          estreita, esta faixa teria a altura do cartão antigo e nada do
          ganho de movê-la para cima. */}
      <dl className="mt-5 grid gap-x-8 gap-y-4 border-t border-[color:var(--cart-card-linha)] pt-4 sm:grid-cols-2 lg:grid-cols-3">
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
