"use client";

/* =============================================================================
   ÁREA DO CORRETOR
   -----------------------------------------------------------------------------
   Uma porta e duas salas. A porta é a tela de acesso; as salas são a carteira,
   onde o corretor mexe nos imóveis, e os procedimentos, que é o manual da
   casa.

   ⚠ A TRANCA É DE PAPELÃO e isso está escrito na tela, não só aqui. Ver
   lib/sessaoCorretor.ts para o porquê e para o que falta.

   Enquanto não houver banco de dados, o que o corretor altera na carteira
   fica no navegador dele e não chega ao site publicado. O painel diz isso em
   voz alta e oferece a exportação do que foi mexido, para alguém aplicar no
   conteúdo. É um rascunho com saída, não um faz de conta.
   ============================================================================= */

import { useState } from "react";
import Link from "next/link";
import { procedimentos, totalTopicos } from "@/content/corretor";
import { imoveis } from "@/content/imobiliaria";
import { useSessaoCorretor } from "@/lib/sessaoCorretor";
import { PainelCarteira } from "./PainelCarteira";

export function AreaCorretor() {
  const { sessao, pronto, entrar, sair } = useSessaoCorretor();

  if (!pronto) {
    /* Nem "entre" nem o painel até saber qual dos dois. A altura segura a
       página para o rodapé não subir e descer. */
    return <div className="min-h-[70svh]" aria-hidden="true" />;
  }

  return sessao ? (
    <Painel usuario={sessao.usuario} aoSair={sair} />
  ) : (
    <TelaDeAcesso aoEntrar={entrar} />
  );
}

/* --------------------------------------------------------------------------
   A PORTA
   -------------------------------------------------------------------------- */

function TelaDeAcesso({
  aoEntrar,
}: {
  aoEntrar: (usuario: string, senha: string) => boolean;
}) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (aoEntrar(usuario, senha)) return;
    /* Uma mensagem só para usuário errado e senha errada: dizer qual dos dois
       falhou entrega ao curioso metade da resposta. */
    setErro("Usuário ou senha incorretos.");
    setSenha("");
  };

  return (
    <section className="carteira flex min-h-[80svh] items-center py-16 md:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-[27rem]">
          <Link
            href="/imobiliaria"
            className="t-label group inline-flex items-center gap-3 text-[color:var(--ink-muted)] no-underline transition-colors duration-200 hover:text-[color:var(--cart-titulo)]"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-1"
            >
              ←
            </span>
            Voltar ao site
          </Link>

          <h1 className="t-display-tight fs-secao mt-8 text-[color:var(--ink)]">
            Área do corretor
          </h1>
          <p className="t-body mt-3 text-[color:var(--ink-muted)]">
            Acesso interno da equipe da Tridium Imóveis.
          </p>

          <form
            onSubmit={enviar}
            className="mt-8 rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-6 shadow-[var(--cart-sombra)] md:p-8"
          >
            <Campo
              id="usuario"
              rotulo="Usuário"
              valor={usuario}
              aoMudar={setUsuario}
              autoComplete="username"
            />

            <div className="mt-5">
              <Campo
                id="senha"
                rotulo="Senha"
                tipo="password"
                valor={senha}
                aoMudar={setSenha}
                autoComplete="current-password"
                revelavel
              />
            </div>

            {/* A mensagem é region live: quem usa leitor de tela precisa ouvir
                que a tentativa falhou, não só ver o campo esvaziar. */}
            {erro && (
              <p
                role="alert"
                className="mt-5 rounded-lg bg-[color:var(--cart-caixa)] px-4 py-3 text-sm text-[color:var(--cart-preco)]"
              >
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="mt-7 h-12 w-full rounded-xl bg-[color:var(--cart-acao)] text-[0.9375rem] font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90"
            >
              Entrar
            </button>
          </form>

          {/* O aviso fica NA TELA, não só no código. Enquanto a credencial for
              de teste, quem entra precisa saber o que não pode colocar aqui.

              A CREDENCIAL SAIU DAQUI. Enquanto a senha era "admin", imprimi-la
              era honestidade: não escondia nada que o palpite óbvio não
              abrisse, e avisava quem entrasse de que a porta era de papelão.
              Com uma senha que não se adivinha, imprimir é outra coisa — anula
              a única barreira que ela cria, a do visitante casual que digita o
              óbvio e desiste.

              Isso NÃO torna a área segura: a conferência continua no navegador
              e a senha continua viajando dentro do arquivo que o navegador
              baixa. Quem abre as ferramentas de desenvolvedor lê a senha em
              segundos, e o conteúdo do treinamento é servido a quem pedir, com
              ou sem login. O que muda é só o degrau mais baixo. O conserto de
              verdade está descrito no cabeçalho de src/lib/sessaoCorretor.ts.

              O aviso sobre o que NÃO colocar aqui fica: ele continua valendo, e
              é o que importa para quem usa a tela. */}
          <div className="mt-6 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-5 py-4">
            <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
              ◇ Acesso de teste
            </p>
            <p className="t-body mt-2 text-sm text-[color:var(--ink-muted)]">
              A conferência acontece no navegador, então a senha pode ser lida
              por quem abrir o código da página. Até existir um login de
              verdade, não coloque aqui dado de cliente, proposta, documento nem
              valor de comissão.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Campo({
  id,
  rotulo,
  valor,
  aoMudar,
  tipo = "text",
  autoComplete,
  revelavel = false,
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
  /** Mostra o olho que revela o que está sendo digitado. Só para senha. */
  revelavel?: boolean;
}) {
  const [revelada, setRevelada] = useState(false);
  const mostrando = revelavel && revelada;

  return (
    /* O <label> envolvia o campo inteiro. Com o botão dentro, clicar no olho
       acionaria o label também — e o clique chegaria duas vezes. Por isso o
       rótulo agora aponta para o campo por `htmlFor` em vez de abraçá-lo. */
    <div>
      <label
        htmlFor={id}
        className="t-label block text-[color:var(--ink-faint)]"
      >
        {rotulo}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={mostrando ? "text" : tipo}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          autoComplete={autoComplete}
          required
          className={`h-12 w-full rounded-xl border border-[color:var(--cart-campo-linha)] bg-white pl-4 text-[0.9375rem] text-[color:var(--ink)] focus:border-[color:var(--cart-titulo)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)] ${
            revelavel ? "pr-13" : "pr-4"
          }`}
        />
        {revelavel && (
          /* `type="button"`: sem isso o botão herda `submit` e tentar ver a
             senha enviaria o formulário.

             O ícone mostra a AÇÃO, não o estado: olho aberto quando a senha
             está escondida (clique para ver), olho cortado quando está à
             vista (clique para esconder). O `aria-label` diz a mesma ação, e
             `aria-pressed` conta o estado a quem usa leitor de tela. */
          <button
            type="button"
            onClick={() => setRevelada((v) => !v)}
            aria-label={mostrando ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={mostrando}
            aria-controls={id}
            className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-[color:var(--ink-faint)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)] hover:text-[color:var(--cart-titulo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cart-acao)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 12S6 5.5 12 5.5s9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
              <circle cx="12" cy="12" r="3.25" />
              {mostrando && <path d="M4 20 20 4" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   AS SALAS
   -------------------------------------------------------------------------- */

function Painel({
  usuario,
  aoSair,
}: {
  usuario: string;
  aoSair: () => void;
}) {
  return (
    <div className="carteira py-10 md:py-14">
      <div className="wrap">
        {/* ---------- Cabeçalho do painel ---------- */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="t-label text-[color:var(--cart-titulo)]">
              Tridium Imóveis · área interna
            </p>
            <h1 className="t-display-tight fs-bloco mt-2 text-[color:var(--ink)]">
              Olá, {usuario}.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/imobiliaria"
              className="rounded-xl border border-[color:var(--cart-campo-linha)] bg-white px-4 py-2.5 text-sm font-semibold text-[color:var(--cart-preco)] no-underline transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              Ver o site
            </Link>
            <button
              type="button"
              onClick={aoSair}
              className="rounded-xl bg-[color:var(--cart-pilula)] px-4 py-2.5 text-sm font-bold text-[color:var(--cart-pilula-ink)] transition-opacity duration-200 hover:opacity-90"
            >
              Sair
            </button>
          </div>
        </div>

        {/* ---------- Aviso permanente ----------
            Não é um alerta a ser fechado: enquanto a tranca for de papelão,
            esta frase precisa estar visível toda vez. */}
        <p className="mt-6 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-5 py-3.5 text-sm text-[color:var(--ink-muted)]">
          <strong className="text-[color:var(--cart-preco)]">
            Ambiente de teste.
          </strong>{" "}
          O acesso é conferido no navegador e ainda não protege nada. Não
          registre aqui dado de cliente, proposta, documento ou comissão.
        </p>

        {/* ---------- As duas frentes ----------
            Não são abas: a carteira vive aqui e o treinamento é uma área
            própria, com cabeçalho e marca próprios. Por isso uma é um
            cartão parado e a outra é um link, com a seta dizendo que leva
            para fora desta tela. */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-[42rem]">
          <div className="rounded-xl border border-[color:var(--cart-pilula)] bg-[color:var(--cart-pilula)] px-5 py-4 text-[color:var(--cart-pilula-ink)]">
            <span className="block text-[0.9375rem] font-bold">Carteira</span>
            <span className="mt-0.5 block text-xs opacity-80">
              {imoveis.length} {imoveis.length === 1 ? "imóvel" : "imóveis"}
            </span>
          </div>

          <Link
            href="/imobiliaria/corretor/treinamento"
            className="group flex items-center justify-between gap-4 rounded-xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] px-5 py-4 no-underline shadow-[var(--cart-sombra)] transition-[translate,box-shadow,border-color] duration-[220ms] ease-[var(--cart-curva)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] hover:shadow-[var(--cart-sombra-alta)] motion-reduce:hover:translate-y-0"
          >
            <span className="min-w-0">
              <span className="block text-[0.9375rem] font-bold text-[color:var(--cart-preco)]">
                Treinamento
              </span>
              <span className="mt-0.5 block text-xs text-[color:var(--ink-faint)]">
                {procedimentos.length} módulos · {totalTopicos()} aulas
              </span>
            </span>
            <span
              aria-hidden="true"
              className="shrink-0 text-[color:var(--cart-titulo)] transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-8">
          <PainelCarteira />
        </div>
      </div>
    </div>
  );
}
