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
import { credencialTeste, procedimentos, totalTopicos } from "@/content/corretor";
import { imoveis } from "@/content/imobiliaria";
import { useSessaoCorretor } from "@/lib/sessaoCorretor";
import { PainelCarteira } from "./PainelCarteira";
import { PainelProcedimentos } from "./PainelProcedimentos";

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
              de teste, quem entra precisa saber o que não pode colocar aqui. */}
          <div className="mt-6 rounded-xl border border-dashed border-[color:var(--cart-campo-linha)] px-5 py-4">
            <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
              ◇ Acesso de teste
            </p>
            <p className="t-body mt-2 text-sm text-[color:var(--ink-muted)]">
              Usuário <strong>{credencialTeste.usuario}</strong>, senha{" "}
              <strong>{credencialTeste.senha}</strong>. A conferência acontece
              no navegador, então a senha pode ser lida por quem abrir o código
              da página. Até existir um login de verdade, não coloque aqui dado
              de cliente, proposta, documento nem valor de comissão.
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
}: {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  tipo?: string;
  autoComplete?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="t-label text-[color:var(--ink-faint)]">{rotulo}</span>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        autoComplete={autoComplete}
        required
        className="mt-2 h-12 w-full rounded-xl border border-[color:var(--cart-campo-linha)] bg-white px-4 text-[0.9375rem] text-[color:var(--ink)] focus:border-[color:var(--cart-titulo)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)]"
      />
    </label>
  );
}

/* --------------------------------------------------------------------------
   AS SALAS
   -------------------------------------------------------------------------- */

type Aba = "carteira" | "procedimentos";

function Painel({
  usuario,
  aoSair,
}: {
  usuario: string;
  aoSair: () => void;
}) {
  const [aba, setAba] = useState<Aba>("carteira");

  const abas: { chave: Aba; rotulo: string; contagem: string }[] = [
    {
      chave: "carteira",
      rotulo: "Carteira",
      contagem: `${imoveis.length} ${imoveis.length === 1 ? "imóvel" : "imóveis"}`,
    },
    {
      chave: "procedimentos",
      rotulo: "Procedimentos",
      contagem: `${procedimentos.length} etapas · ${totalTopicos()} tópicos`,
    },
  ];

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

        {/* ---------- Abas ---------- */}
        <div
          role="tablist"
          aria-label="Áreas do painel"
          className="mt-8 flex flex-wrap gap-3"
        >
          {abas.map((a) => {
            const ativa = aba === a.chave;
            return (
              <button
                key={a.chave}
                type="button"
                role="tab"
                aria-selected={ativa}
                aria-controls={`painel-${a.chave}`}
                id={`aba-${a.chave}`}
                onClick={() => setAba(a.chave)}
                className={`rounded-xl border px-5 py-3 text-left transition-[translate,box-shadow,border-color,background-color] duration-[220ms] ease-[var(--cart-curva)] ${
                  ativa
                    ? "border-[color:var(--cart-pilula)] bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
                    : "border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] text-[color:var(--cart-preco)] shadow-[var(--cart-sombra)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] motion-reduce:hover:translate-y-0"
                }`}
              >
                <span className="block text-[0.9375rem] font-bold">
                  {a.rotulo}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    ativa ? "opacity-80" : "text-[color:var(--ink-faint)]"
                  }`}
                >
                  {a.contagem}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`painel-${aba}`}
          aria-labelledby={`aba-${aba}`}
          className="mt-8"
        >
          {aba === "carteira" ? <PainelCarteira /> : <PainelProcedimentos />}
        </div>
      </div>
    </div>
  );
}
