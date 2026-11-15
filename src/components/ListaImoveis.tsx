"use client";

/* =============================================================================
   CARTEIRA DE IMÓVEIS — busca, filtros e grade
   -----------------------------------------------------------------------------
   Segue a imobiliária de referência que o cliente adotou:

     barra verde no topo — busca livre, finalidade e o botão de ação, e abaixo
     código, bairro, tipo e valor
     cabeçalho de resultados — contagem, ordenação
     grade de cartões

   A BUSCA LIVRE casa contra tudo o que a pessoa poderia digitar: código,
   bairro, cidade, tipo, título e resumo. Quem chega com um código na mão
   digita só ele; quem não tem, digita "lagoa".

   Os FILTROS valem no mesmo instante, sem precisar do botão. O botão existe
   porque a referência tem um e porque ele é o alvo óbvio no celular, onde o
   teclado tapa a lista — ele fecha o teclado e rola até os resultados.

   Tudo roda no navegador, sobre a carteira inteira. Isso aguenta algumas
   centenas de imóveis; passando disso, a lista precisa vir paginada do
   servidor, e é aí que entra o CRM.

   Acessibilidade: a contagem é uma região live, então quem usa leitor de tela
   ouve "7 imóveis" virar "2 imóveis" ao filtrar. Sem isso, a pessoa mexe num
   filtro e nada é anunciado.
   ============================================================================= */

import { useMemo, useRef, useState } from "react";
import {
  categorias,
  opcoesFiltro,
  tituloImovel,
  type Imovel,
} from "@/content/imobiliaria";
import { contato, mensagensWhatsapp, whatsappLink } from "@/content/site";
import { useFavoritos } from "@/lib/favoritos";
import { CardImovel } from "./CardImovel";
import {
  IconeEstrela,
  IconeLupa,
  IconeWhatsapp,
  iconeDaCategoria,
} from "./IconesImovel";

type Ordem = "relevancia" | "menor-preco" | "maior-preco" | "maior-area";

const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "relevancia", rotulo: "Mais relevantes" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "maior-area", rotulo: "Maior área" },
];

/* Faixas redondas, como na referência. O valor é o teto em reais; "" é sem
   teto. Números quebrados ("até R$ 1.340.000") não ajudam ninguém a decidir. */
const FAIXAS: { valor: string; rotulo: string }[] = [
  { valor: "", rotulo: "Valor até" },
  { valor: "500000", rotulo: "R$ 500.000" },
  { valor: "800000", rotulo: "R$ 800.000" },
  { valor: "1200000", rotulo: "R$ 1.200.000" },
  { valor: "2000000", rotulo: "R$ 2.000.000" },
  { valor: "99999999", rotulo: "Acima de R$ 2.000.000" },
];

const SEM_ACENTO = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ListaImoveis({ imoveis }: { imoveis: readonly Imovel[] }) {
  const [busca, setBusca] = useState("");
  const [codigo, setCodigo] = useState("");
  const [finalidade, setFinalidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState("");
  const [teto, setTeto] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("relevancia");
  const [soFavoritos, setSoFavoritos] = useState(false);
  const [categoria, setCategoria] = useState("");

  const favoritos = useFavoritos();
  const resultadosRef = useRef<HTMLDivElement>(null);

  /* As doze categorias da referência, sempre todas na grade. A contagem é
     feita aqui porque a caixa mostra quantos existem em cada uma, e porque
     é ela que decide se a caixa entra acesa ou apagada. */
  const atalhos = useMemo(
    () =>
      categorias.map((c) => ({
        ...c,
        Icone: iconeDaCategoria(c.icone),
        total: imoveis.filter(c.casa).length,
      })),
    [imoveis]
  );

  const categoriaAtiva = categorias.find((c) => c.chave === categoria);


  const filtrados = useMemo(() => {
    const termo = SEM_ACENTO(busca.trim());
    const cod = SEM_ACENTO(codigo.trim());
    const limite = teto ? Number(teto) : null;

    const lista = imoveis.filter((i) => {
      if (soFavoritos && !favoritos.chaves.includes(i.chave)) return false;
      if (categoriaAtiva && !categoriaAtiva.casa(i)) return false;
      if (finalidade && i.finalidade !== finalidade) return false;
      if (bairro && i.bairro !== bairro) return false;
      if (tipo && i.tipo !== tipo) return false;
      if (cod && !SEM_ACENTO(i.codigo).includes(cod)) return false;

      /* Sem preço não é barato nem caro: um teto de valor não diz nada sobre
         ele, então ele sai da lista enquanto o filtro estiver ligado. */
      if (limite !== null) {
        if (i.preco === null) return false;
        if (limite === 99999999 ? i.preco <= 2000000 : i.preco > limite) {
          return false;
        }
      }

      if (termo) {
        const palheiro = SEM_ACENTO(
          [
            i.codigo,
            tituloImovel(i),
            i.tipo,
            i.bairro,
            i.cidade,
            i.empreendimento ?? "",
            i.resumo,
          ].join(" ")
        );
        if (!termo.split(/\s+/).every((p) => palheiro.includes(p))) return false;
      }

      return true;
    });

    /* Imóvel sem preço público vai para o fim das ordens por preço: ele não
       tem como ser comparado, e no topo atrapalharia quem ordenou por valor. */
    const semPreco = (i: Imovel) => i.preco === null;

    return [...lista].sort((a, b) => {
      if (ordem === "maior-area") {
        return (b.areaTerreno ?? b.area) - (a.areaTerreno ?? a.area);
      }
      if (ordem === "menor-preco" || ordem === "maior-preco") {
        if (semPreco(a) && semPreco(b)) return 0;
        if (semPreco(a)) return 1;
        if (semPreco(b)) return -1;
        return ordem === "menor-preco" ? a.preco! - b.preco! : b.preco! - a.preco!;
      }
      return 0;
    });
  }, [
    imoveis,
    busca,
    codigo,
    finalidade,
    bairro,
    tipo,
    teto,
    ordem,
    soFavoritos,
    favoritos.chaves,
    categoriaAtiva,
  ]);

  const temFiltro = Boolean(
    busca || codigo || finalidade || bairro || tipo || teto || soFavoritos || categoria
  );

  const limpar = () => {
    setBusca("");
    setCodigo("");
    setFinalidade("");
    setBairro("");
    setTipo("");
    setTeto("");
    setSoFavoritos(false);
    setCategoria("");
  };

  /* O botão não "aplica" nada — os filtros já valem. Ele fecha o teclado do
     celular e leva o olho até os resultados, que é o que a pessoa quer dele. */
  const irAosResultados = (e: React.FormEvent) => {
    e.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    resultadosRef.current?.scrollIntoView({ block: "start" });
  };

  const nFav = favoritos.chaves.length;

  return (
    <div className="carteira">
      {/* ---------- Telefone e favoritos ----------
          Na referência estes dois ficam no cabeçalho do site. Aqui ficam na
          seção da carteira: o cabeçalho da Tridium é o mesmo nas três
          frentes, e um contador de imóveis favoritados apareceria também em
          Engenharia e no Instituto, onde não significa nada. */}
      <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
        <a
          href={whatsappLink(mensagensWhatsapp.imobiliaria)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] px-4 py-2.5 text-[0.9375rem] font-semibold text-[color:var(--cart-preco)] no-underline shadow-[var(--cart-sombra)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
        >
          <IconeWhatsapp className="h-[1.1rem] w-[1.1rem] text-[color:var(--cart-titulo)]" />
          {contato.whatsappExibicao}
          <span className="sr-only">(abre o WhatsApp em nova aba)</span>
        </a>

        {/* Enquanto o efeito do localStorage não rodou, `pronto` é false e o
            botão não aparece: sem isso ele piscaria "0" em toda visita de
            quem já tem imóveis salvos.

            Ele fica visível com zero favoritos se o filtro estiver LIGADO.
            Sem isso, tirar a estrela do último imóvel sumiria com o botão e
            deixaria a pessoa presa numa lista vazia, sem o que desligar. */}
        {favoritos.pronto && (nFav > 0 || soFavoritos) && (
          <button
            type="button"
            onClick={() => setSoFavoritos((v) => !v)}
            aria-pressed={soFavoritos}
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-[0.9375rem] font-semibold shadow-[var(--cart-sombra)] transition-colors duration-200 ${
              soFavoritos
                ? "border-[color:var(--cart-pilula)] bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
                : "border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] text-[color:var(--cart-preco)] hover:bg-[color:var(--cart-caixa)]"
            }`}
          >
            <IconeEstrela
              cheia
              className={`h-[1.1rem] w-[1.1rem] ${
                soFavoritos ? "" : "text-[color:var(--cart-acao)]"
              }`}
            />
            Favoritos
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold ${
                soFavoritos
                  ? "bg-[color:var(--cart-pilula-ink)] text-[color:var(--cart-pilula)]"
                  : "bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
              }`}
            >
              {nFav}
            </span>
          </button>
        )}
      </div>

      {/* ---------- Barra de busca ---------- */}
      <form
        onSubmit={irAosResultados}
        className="rounded-2xl bg-[color:var(--cart-barra)] p-4 shadow-[var(--cart-sombra-alta)] md:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <IconeLupa className="pointer-events-none absolute left-4 top-1/2 h-[1.15rem] w-[1.15rem] -translate-y-1/2 text-[color:var(--ink-faint)]" />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por código, bairro, tipo ou imóvel..."
              aria-label="Buscar imóvel"
              className="h-12 w-full rounded-xl border-0 bg-[color:var(--cart-campo)] pl-11 pr-4 text-[0.9375rem] text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)]"
            />
          </div>

          <Select
            valor={finalidade}
            aoMudar={setFinalidade}
            rotuloOculto="Finalidade"
            className="md:w-56"
          >
            <option value="">Aluguel / Venda</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </Select>

          <button
            type="submit"
            className="h-12 rounded-xl bg-[color:var(--cart-acao)] px-8 text-[0.9375rem] font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-barra-ink)]"
          >
            Buscar
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código"
            aria-label="Código do imóvel"
            className="h-12 w-full rounded-xl border-0 bg-[color:var(--cart-campo)] px-4 text-[0.9375rem] text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)]"
          />

          <Select valor={bairro} aoMudar={setBairro} rotuloOculto="Bairro">
            <option value="">Bairro</option>
            {opcoesFiltro.bairros.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>

          <Select valor={tipo} aoMudar={setTipo} rotuloOculto="Tipo de imóvel">
            <option value="">Tipo de imóvel</option>
            {opcoesFiltro.tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Select valor={teto} aoMudar={setTeto} rotuloOculto="Valor até">
            {FAIXAS.map((f) => (
              <option key={f.rotulo} value={f.valor}>
                {f.rotulo}
              </option>
            ))}
          </Select>
        </div>
      </form>

      {/* ---------- Caixas de atalho ----------
          As doze categorias que a Tridium Imóveis atende, na ordem da
          referência. Estão todas sempre na grade, inclusive as que ainda não
          têm imóvel: a caixa não é só um filtro, é o que a casa faz. Uma
          categoria vazia entra mais apagada e sem contagem, e quem clica
          nela não bate num muro — a lista abaixo diz que ainda não há nada
          ali e abre conversa no WhatsApp.

          São `aria-pressed`, não links: eles ligam e desligam um filtro
          nesta mesma página, e um link prometeria outra. */}
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {atalhos.map((a) => {
          const ativo = categoria === a.chave;
          const vazio = a.total === 0;
          return (
            <li key={a.chave}>
              <button
                type="button"
                onClick={() => setCategoria(ativo ? "" : a.chave)}
                aria-pressed={ativo}
                className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-[translate,box-shadow,border-color,background-color] duration-[220ms] ease-[var(--cart-curva)] ${
                  ativo
                    ? "border-[color:var(--cart-pilula)] bg-[color:var(--cart-pilula)] text-[color:var(--cart-pilula-ink)]"
                    : vazio
                      ? "border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)]/60 text-[color:var(--ink-faint)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] hover:text-[color:var(--cart-preco)] motion-reduce:hover:translate-y-0"
                      : "border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] text-[color:var(--cart-preco)] shadow-[var(--cart-sombra)] hover:-translate-y-0.5 hover:border-[color:var(--cart-linha-ativa)] hover:shadow-[var(--cart-sombra-alta)] motion-reduce:hover:translate-y-0"
                }`}
              >
                <a.Icone
                  className={`h-6 w-6 ${
                    ativo
                      ? ""
                      : vazio
                        ? "text-[color:var(--cart-titulo)]/45"
                        : "text-[color:var(--cart-titulo)]"
                  }`}
                />
                <span className="text-sm font-semibold leading-tight">
                  {a.rotulo}
                </span>
                {a.total > 0 && (
                  <span
                    className={`text-xs ${
                      ativo ? "opacity-80" : "text-[color:var(--ink-faint)]"
                    }`}
                  >
                    {a.total}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ---------- Cabeçalho de resultados ---------- */}
      <div
        ref={resultadosRef}
        className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 scroll-mt-24 rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] px-5 py-4 shadow-[var(--cart-sombra)]"
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p aria-live="polite" className="text-[0.9375rem] text-[color:var(--ink-muted)]">
            <span className="font-bold text-[color:var(--cart-preco)]">
              {filtrados.length}
            </span>{" "}
            {filtrados.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
          </p>

          {temFiltro && (
            <button
              type="button"
              onClick={limpar}
              className="text-sm text-[color:var(--cart-titulo)] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
            >
              Limpar filtros
            </button>
          )}
        </div>

        <Select
          valor={ordem}
          aoMudar={(v) => setOrdem(v as Ordem)}
          rotuloOculto="Ordenar por"
          className="sm:w-52"
          borda
        >
          {ORDENS.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </Select>
      </div>

      {/* ---------- Grade ---------- */}
      {filtrados.length > 0 ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((imovel, i) => (
            <li key={imovel.chave} className="h-full">
              <CardImovel
                imovel={imovel}
                prioridade={i < 3}
                favorito={favoritos.chaves.includes(imovel.chave)}
                aoFavoritar={favoritos.alternar}
              />
            </li>
          ))}
        </ul>
      ) : (
        /* Quem chegou aqui por uma caixa de categoria vazia merece ouvir o
           nome dela de volta, e não um "nenhum imóvel" genérico: ele soaria
           como erro de busca quando na verdade a carteira é que ainda não
           chegou lá. E, em vez de só oferecer o botão de voltar, a saída é
           o WhatsApp — categoria procurada é procura declarada. */
        <div className="mt-6 rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] px-6 py-16 text-center shadow-[var(--cart-sombra)]">
          <p className="t-display-tight fs-bloco text-[color:var(--ink)]">
            {categoriaAtiva
              ? `Ainda não temos ${categoriaAtiva.rotulo.toLowerCase()} na carteira.`
              : "Nenhum imóvel com esse filtro."}
          </p>
          <p className="t-body mx-auto mt-4 max-w-[48ch] text-[color:var(--ink-muted)]">
            {categoriaAtiva
              ? "A Tridium Imóveis trabalha com essa categoria — ela só não está na carteira hoje. Diga o que procura e avisamos assim que entrar."
              : "A carteira ainda é pequena e cresce toda semana. Diga o que procura e avisamos quando entrar algo no perfil."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappLink(
                categoriaAtiva
                  ? `Olá! Procuro ${categoriaAtiva.rotulo.toLowerCase()} em Florianópolis. Vocês podem me avisar quando entrar algo assim na carteira?`
                  : mensagensWhatsapp.imobiliaria
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[color:var(--cart-pilula)] px-6 py-3 text-[0.9375rem] font-bold text-[color:var(--cart-pilula-ink)] no-underline transition-opacity duration-200 hover:opacity-90"
            >
              <IconeWhatsapp className="h-[1.1rem] w-[1.1rem]" />
              Avise quando entrar
            </a>

            <button
              type="button"
              onClick={limpar}
              className="rounded-xl border border-[color:var(--cart-campo-linha)] px-6 py-3 text-[0.9375rem] font-semibold text-[color:var(--cart-preco)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* A seta nativa do <select> é cinza-sistema e destoa no campo branco sobre o
   verde. Trocada por um chevron em SVG embutido, com a cor da tinta. */
const SETA =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235c665a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")";

function Select({
  valor,
  aoMudar,
  rotuloOculto,
  children,
  className = "",
  borda = false,
}: {
  valor: string;
  aoMudar: (v: string) => void;
  rotuloOculto: string;
  children: React.ReactNode;
  className?: string;
  /** No cabeçalho de resultados o campo fica sobre branco e precisa de fio. */
  borda?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="sr-only">{rotuloOculto}</span>
      <select
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        style={{
          backgroundImage: SETA,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.9rem center",
          backgroundSize: "1.1rem",
        }}
        className={`h-12 w-full appearance-none rounded-xl bg-[color:var(--cart-campo)] pl-4 pr-11 text-[0.9375rem] text-[color:var(--ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)] ${
          borda
            ? "border border-[color:var(--cart-campo-linha)]"
            : "border-0"
        }`}
      >
        {children}
      </select>
    </label>
  );
}
