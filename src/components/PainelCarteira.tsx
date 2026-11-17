"use client";

/* =============================================================================
   CARTEIRA — onde o corretor mexe nos imóveis
   -----------------------------------------------------------------------------
   ⚠ SEM BANCO DE DADOS, O QUE SE EDITA AQUI NÃO CHEGA AO SITE.

   O site publicado lê `src/content/imobiliaria.ts`, um arquivo que só muda
   quando alguém o altera e publica. Este painel não tem como gravar lá: não
   existe servidor de dados, não existe rota de API, não existe autenticação
   de verdade. Fingir que salva seria pior do que não salvar.

   Então ele faz o que dá para fazer com honestidade: guarda as alterações no
   navegador de quem editou, mostra o que mudou em relação ao publicado, e
   EXPORTA. A exportação sai em JSON, pronta para quem mantém o site aplicar
   no conteúdo. É um rascunho com saída.

   QUANDO HOUVER BACKEND, este componente muda pouco: as funções `gravar` e
   `exportar` viram chamadas a uma API, e o resto da tela continua igual.

   Edição de FOTO fica de fora de propósito. Subir arquivo exige onde guardar
   (um bucket, um CDN) e quem autoriza o envio — as duas coisas são o mesmo
   backend que ainda não existe. Um seletor de arquivo que não envia nada não
   é um começo, é uma mentira na tela.
   ============================================================================= */

import { useEffect, useMemo, useState } from "react";
import {
  formatarPreco,
  imoveis,
  tituloImovel,
  type Imovel,
} from "@/content/imobiliaria";

const CHAVE = "tridium:corretor:rascunho";

/** Só o que este painel deixa mexer hoje. Foto e descrição longa pedem
    backend; preço, condomínio, IPTU, situação e selos são campos curtos. */
interface Rascunho {
  preco?: number | null;
  condominio?: number;
  iptu?: number;
  situacao?: string;
  resumo?: string;
}

type Rascunhos = Record<string, Rascunho>;

function ler(): Rascunhos {
  try {
    const cru = window.localStorage.getItem(CHAVE);
    if (!cru) return {};
    const d: unknown = JSON.parse(cru);
    return typeof d === "object" && d !== null && !Array.isArray(d)
      ? (d as Rascunhos)
      : {};
  } catch {
    return {};
  }
}

function gravar(r: Rascunhos) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(r));
  } catch {
    /* Aba anônima ou cota cheia: o rascunho vale enquanto a aba viver. */
  }
}

export function PainelCarteira() {
  const [rascunhos, setRascunhos] = useState<Rascunhos>({});
  const [pronto, setPronto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setRascunhos(ler());
    setPronto(true);
  }, []);

  const alterar = (chave: string, campos: Rascunho) => {
    setRascunhos((atuais) => {
      const novo = { ...atuais, [chave]: { ...atuais[chave], ...campos } };
      /* Imóvel que voltou ao valor publicado sai do rascunho: senão a
         contagem de alterações mentiria. */
      const original = imoveis.find((i) => i.chave === chave);
      if (original && !mudou(original, novo[chave])) delete novo[chave];
      gravar(novo);
      return novo;
    });
  };

  const descartar = (chave: string) => {
    setRascunhos((atuais) => {
      const novo = { ...atuais };
      delete novo[chave];
      gravar(novo);
      return novo;
    });
  };

  const descartarTudo = () => {
    setRascunhos({});
    gravar({});
  };

  const alterados = useMemo(
    () => imoveis.filter((i) => rascunhos[i.chave]),
    [rascunhos]
  );

  const exportar = async () => {
    const saida = alterados.map((i) => ({
      chave: i.chave,
      codigo: i.codigo,
      alteracoes: rascunhos[i.chave],
    }));
    try {
      await navigator.clipboard.writeText(JSON.stringify(saida, null, 2));
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      /* Área de transferência bloqueada: resta o download. */
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(saida, null, 2)], { type: "application/json" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "tridium-imoveis-alteracoes.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!pronto) return <div className="min-h-[20rem]" aria-hidden="true" />;

  return (
    <div>
      {/* ---------- O que este painel é e não é ---------- */}
      <div className="rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] p-6 shadow-[var(--cart-sombra)]">
        <h2 className="t-display-tight fs-card text-[color:var(--ink)]">
          Rascunho da carteira
        </h2>
        <p className="t-body mt-3 max-w-[64ch] text-sm text-[color:var(--ink-muted)]">
          O que você alterar aqui fica <strong>neste navegador</strong> e não
          vai para o site. Ainda não existe banco de dados — quando existir,
          esta mesma tela passa a salvar de verdade. Por enquanto ela serve
          para preparar as alterações e exportar, para quem mantém o site
          aplicar.
        </p>

        <p className="t-body mt-3 max-w-[64ch] text-sm text-[color:var(--ink-muted)]">
          Foto não entra aqui: subir arquivo precisa de um lugar para guardar e
          de quem autorize o envio, que é o mesmo backend que falta. Um botão
          que não envia nada seria pior que nenhum.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[color:var(--cart-card-linha)] pt-5">
          <p aria-live="polite" className="text-sm text-[color:var(--ink-muted)]">
            <strong className="text-[color:var(--cart-preco)]">
              {alterados.length}
            </strong>{" "}
            {alterados.length === 1
              ? "imóvel com alteração"
              : "imóveis com alteração"}
          </p>

          {alterados.length > 0 && (
            <>
              <button
                type="button"
                onClick={exportar}
                className="rounded-xl bg-[color:var(--cart-acao)] px-5 py-2.5 text-sm font-bold text-[color:var(--cart-acao-ink)] transition-opacity duration-200 hover:opacity-90"
              >
                {copiado ? "Copiado ✓" : "Exportar alterações"}
              </button>
              <button
                type="button"
                onClick={descartarTudo}
                className="text-sm text-[color:var(--ink-muted)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-titulo)]"
              >
                Descartar tudo
              </button>
            </>
          )}
        </div>
      </div>

      {/* ---------- A lista ---------- */}
      <ul className="mt-4 space-y-3">
        {imoveis.map((imovel) => (
          <li key={imovel.chave}>
            <LinhaImovel
              imovel={imovel}
              rascunho={rascunhos[imovel.chave]}
              aberto={editando === imovel.chave}
              aoAbrir={() =>
                setEditando(editando === imovel.chave ? null : imovel.chave)
              }
              aoAlterar={(campos) => alterar(imovel.chave, campos)}
              aoDescartar={() => descartar(imovel.chave)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** O rascunho realmente difere do publicado? */
function mudou(original: Imovel, r: Rascunho | undefined): boolean {
  if (!r) return false;
  return (
    (r.preco !== undefined && r.preco !== original.preco) ||
    (r.condominio !== undefined && r.condominio !== original.condominio) ||
    (r.iptu !== undefined && r.iptu !== original.iptu) ||
    (r.situacao !== undefined && r.situacao !== original.situacao) ||
    (r.resumo !== undefined && r.resumo !== original.resumo)
  );
}

function LinhaImovel({
  imovel,
  rascunho,
  aberto,
  aoAbrir,
  aoAlterar,
  aoDescartar,
}: {
  imovel: Imovel;
  rascunho?: Rascunho;
  aberto: boolean;
  aoAbrir: () => void;
  aoAlterar: (campos: Rascunho) => void;
  aoDescartar: () => void;
}) {
  const alterado = mudou(imovel, rascunho);
  const valor = <T,>(campo: keyof Rascunho, original: T): T =>
    (rascunho?.[campo] as T | undefined) ?? original;

  const precoAtual = valor<number | null>("preco", imovel.preco);

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)] ${
        alterado
          ? "border-[color:var(--cart-acao)]"
          : "border-[color:var(--cart-card-linha)]"
      }`}
    >
      <button
        type="button"
        onClick={aoAbrir}
        aria-expanded={aberto}
        aria-controls={`editor-${imovel.chave}`}
        className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4 text-left transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
      >
        <span className="rounded-full bg-[color:var(--cart-pilula)] px-2.5 py-1 font-mono text-[0.6875rem] font-bold text-[color:var(--cart-pilula-ink)]">
          {imovel.codigo}
        </span>

        <span className="min-w-0 flex-1 text-sm font-semibold text-[color:var(--cart-preco)]">
          {tituloImovel(imovel)}
        </span>

        <span className="text-sm font-bold text-[color:var(--cart-preco)]">
          {formatarPreco(precoAtual)}
        </span>

        {alterado && (
          <span className="rounded-full bg-[color:var(--cart-acao)] px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] text-[color:var(--cart-acao-ink)]">
            Alterado
          </span>
        )}

        <span
          aria-hidden="true"
          className={`text-[color:var(--cart-titulo)] transition-transform duration-300 ease-[var(--cart-curva)] ${
            aberto ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {aberto && (
        <div
          id={`editor-${imovel.chave}`}
          className="border-t border-[color:var(--cart-card-linha)] px-6 pb-6 pt-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <CampoNumero
              id={`preco-${imovel.chave}`}
              rotulo="Preço (R$)"
              valor={precoAtual}
              publicado={imovel.preco}
              aoMudar={(v) => aoAlterar({ preco: v })}
              permiteVazio
              dica="Vazio mostra “Sob consulta” no site."
            />
            <CampoNumero
              id={`cond-${imovel.chave}`}
              rotulo="Condomínio (R$)"
              valor={valor<number | undefined>("condominio", imovel.condominio)}
              publicado={imovel.condominio}
              aoMudar={(v) => aoAlterar({ condominio: v ?? undefined })}
            />
            <CampoNumero
              id={`iptu-${imovel.chave}`}
              rotulo="IPTU (R$)"
              valor={valor<number | undefined>("iptu", imovel.iptu)}
              publicado={imovel.iptu}
              aoMudar={(v) => aoAlterar({ iptu: v ?? undefined })}
            />
            <CampoTexto
              id={`sit-${imovel.chave}`}
              rotulo="Situação"
              valor={valor<string>("situacao", imovel.situacao)}
              publicado={imovel.situacao}
              aoMudar={(v) => aoAlterar({ situacao: v })}
            />
          </div>

          <div className="mt-5">
            <CampoTexto
              id={`res-${imovel.chave}`}
              rotulo="Resumo (uma linha, aparece no card)"
              valor={valor<string>("resumo", imovel.resumo)}
              publicado={imovel.resumo}
              aoMudar={(v) => aoAlterar({ resumo: v })}
              area
            />
          </div>

          {alterado && (
            <button
              type="button"
              onClick={aoDescartar}
              className="mt-5 text-sm text-[color:var(--ink-muted)] underline underline-offset-4 transition-colors duration-200 hover:text-[color:var(--cart-titulo)]"
            >
              Descartar as alterações deste imóvel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Os campos mostram o valor publicado quando ele difere do que está digitado:
   sem isso o corretor não sabe de onde partiu nem para o que voltar. */

function Rodape({ mostrar, texto }: { mostrar: boolean; texto: string }) {
  if (!mostrar) return null;
  return (
    <span className="mt-1.5 block text-xs text-[color:var(--ink-faint)]">
      {texto}
    </span>
  );
}

const CLASSES_CAMPO =
  "mt-2 w-full rounded-xl border border-[color:var(--cart-campo-linha)] bg-white px-4 py-3 text-[0.9375rem] text-[color:var(--ink)] focus:border-[color:var(--cart-titulo)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cart-acao)]";

function CampoNumero({
  id,
  rotulo,
  valor,
  publicado,
  aoMudar,
  permiteVazio = false,
  dica,
}: {
  id: string;
  rotulo: string;
  valor: number | null | undefined;
  publicado: number | null | undefined;
  aoMudar: (v: number | null) => void;
  permiteVazio?: boolean;
  dica?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="t-label text-[color:var(--ink-faint)]">{rotulo}</span>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        step={permiteVazio ? 1000 : 1}
        value={valor ?? ""}
        onChange={(e) =>
          aoMudar(e.target.value === "" ? null : Number(e.target.value))
        }
        className={CLASSES_CAMPO}
      />
      <Rodape
        mostrar={valor !== publicado}
        texto={`Publicado: ${
          publicado === null || publicado === undefined
            ? "—"
            : formatarPreco(publicado)
        }`}
      />
      {dica && <Rodape mostrar texto={dica} />}
    </label>
  );
}

function CampoTexto({
  id,
  rotulo,
  valor,
  publicado,
  aoMudar,
  area = false,
}: {
  id: string;
  rotulo: string;
  valor: string;
  publicado: string;
  aoMudar: (v: string) => void;
  area?: boolean;
}) {
  const comum = {
    id,
    value: valor,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      aoMudar(e.target.value),
    className: CLASSES_CAMPO,
  };

  return (
    <label htmlFor={id} className="block">
      <span className="t-label text-[color:var(--ink-faint)]">{rotulo}</span>
      {area ? <textarea rows={3} {...comum} /> : <input type="text" {...comum} />}
      <Rodape
        mostrar={valor !== publicado}
        texto={`Publicado: ${publicado}`}
      />
    </label>
  );
}
