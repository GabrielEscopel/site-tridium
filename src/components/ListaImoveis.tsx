"use client";

/* =============================================================================
   LISTA DE IMÓVEIS COM FILTROS
   -----------------------------------------------------------------------------
   Filtros em cima, contagem ao lado, grade embaixo — a ordem da referência.

   O filtro roda no navegador, sobre a carteira inteira. Isso funciona bem até
   algumas centenas de imóveis; passando disso, a lista precisa vir paginada do
   servidor, e é aí que entra o CRM.

   Acessibilidade: a contagem é uma região live, então quem usa leitor de tela
   ouve "7 imóveis" mudar para "2 imóveis" ao filtrar. Sem isso, a pessoa mexe
   num filtro e nada é anunciado.
   ============================================================================= */

import { useMemo, useState } from "react";
import { opcoesFiltro, type Imovel } from "@/content/imobiliaria";
import { CardImovel } from "./CardImovel";

type Ordem = "relevancia" | "menor-preco" | "maior-preco" | "maior-area";

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "relevancia", rotulo: "Mais relevantes" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "maior-area", rotulo: "Maior área" },
];

export function ListaImoveis({ imoveis }: { imoveis: readonly Imovel[] }) {
  const [tipo, setTipo] = useState("");
  const [bairro, setBairro] = useState("");
  const [dormitorios, setDormitorios] = useState(0);
  const [ordem, setOrdem] = useState<Ordem>("relevancia");

  const filtrados = useMemo(() => {
    const lista = imoveis.filter(
      (i) =>
        (!tipo || i.tipo === tipo) &&
        (!bairro || i.bairro === bairro) &&
        (!dormitorios || i.dormitorios >= dormitorios)
    );

    /* Imóvel sem preço público vai para o fim das ordens por preço: ele não
       tem como ser comparado, e no topo atrapalharia quem ordenou por valor. */
    const semPreco = (i: Imovel) => i.preco === null;

    return [...lista].sort((a, b) => {
      if (ordem === "maior-area") return b.area - a.area;
      if (ordem === "menor-preco" || ordem === "maior-preco") {
        if (semPreco(a) && semPreco(b)) return 0;
        if (semPreco(a)) return 1;
        if (semPreco(b)) return -1;
        return ordem === "menor-preco"
          ? a.preco! - b.preco!
          : b.preco! - a.preco!;
      }
      return 0;
    });
  }, [imoveis, tipo, bairro, dormitorios, ordem]);

  const temFiltro = Boolean(tipo || bairro || dormitorios);

  const limpar = () => {
    setTipo("");
    setBairro("");
    setDormitorios(0);
  };

  return (
    <div>
      {/* --- Filtros --- */}
      <div className="border-y border-line py-5">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <Campo rotulo="Tipo" valor={tipo} aoMudar={setTipo}>
            <option value="">Todos</option>
            {opcoesFiltro.tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Campo>

          <Campo rotulo="Bairro" valor={bairro} aoMudar={setBairro}>
            <option value="">Todos</option>
            {opcoesFiltro.bairros.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Campo>

          <Campo
            rotulo="Quartos"
            valor={String(dormitorios)}
            aoMudar={(v) => setDormitorios(Number(v))}
          >
            <option value="0">Qualquer</option>
            {opcoesFiltro.dormitorios.map((d) => (
              <option key={d} value={d}>
                {d}+
              </option>
            ))}
          </Campo>

          <Campo
            rotulo="Ordenar por"
            valor={ordem}
            aoMudar={(v) => setOrdem(v as Ordem)}
            className="md:ml-auto"
          >
            {ORDENS.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </Campo>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <p aria-live="polite" className="t-label text-ink">
            {filtrados.length}{" "}
            {filtrados.length === 1 ? "imóvel" : "imóveis"} na carteira
          </p>

          {temFiltro && (
            <button
              type="button"
              onClick={limpar}
              className="t-label text-muted underline underline-offset-4 transition-colors duration-200 hover:text-accent-texto"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* --- Grade --- */}
      {filtrados.length > 0 ? (
        <ul className="mt-px grid gap-px bg-line md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((imovel, i) => (
            <li key={imovel.chave}>
              <CardImovel imovel={imovel} prioridade={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-b border-line py-20 text-center">
          <p className="t-display-tight fs-bloco text-ink">
            Nenhum imóvel com esse filtro.
          </p>
          <p className="t-body mx-auto mt-4 max-w-[46ch] text-muted">
            A carteira ainda é pequena e cresce toda semana. Diga o que procura
            e avisamos quando entrar algo no perfil.
          </p>
          <button
            type="button"
            onClick={limpar}
            className="t-label mt-8 border border-line-strong px-6 py-3 text-ink transition-colors duration-200 hover:border-accent hover:text-accent-texto"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  aoMudar,
  children,
  className = "",
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="t-label text-faint">{rotulo}</span>
      <select
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className="border border-line bg-surface px-3 py-2.5 text-sm text-ink transition-colors duration-200 hover:border-line-strong focus:border-accent focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}
