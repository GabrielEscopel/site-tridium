"use client";

/* =============================================================================
   GESTÃO DO CORRETOR — agenda própria e marcação da rotina
   -----------------------------------------------------------------------------
   ESTE ARQUIVO É O PONTO DE TROCA. Tudo que a tela de gestão lê ou grava passa
   por `fonte`, e `fonte` hoje é o navegador. Quando o login de verdade e o
   banco de dados chegarem, troca-se UMA LINHA — `const fonte = fonteLocal` —
   por uma fonte que fala com a API, e nenhum componente muda.

   Por isso as funções são ASSÍNCRONAS mesmo sendo locais: ler do localStorage
   é instantâneo e não precisaria de promessa nenhuma, mas ler do servidor
   precisa. Escrever a assinatura já no formato final evita reescrever a tela
   depois — foi de propósito, não enfeite.

   ⚠ ENQUANTO FOR ASSIM, FICA NO NAVEGADOR DE QUEM MARCOU. O gestor não vê, e
   trocar de computador começa do zero. É também o motivo de existir o botão
   que copia o fechamento da semana: enquanto o número não chega sozinho à
   gestão, o corretor manda o texto. Quando houver banco, o mesmo texto se
   monta sozinho do outro lado.

   O que NÃO está aqui, de propósito: a rotina da casa e as premiações. São
   regra da casa, iguais para todos, e vivem em content/corretor.ts.
   ============================================================================= */

import { useCallback, useEffect, useMemo, useState } from "react";
import { semanaAtual } from "./metasCorretor";

export type TipoCompromisso =
  | "visita"
  | "plantao"
  | "reuniao"
  | "ligacao"
  | "vistoria"
  | "outro";

export const rotuloDoTipo: Record<TipoCompromisso, string> = {
  visita: "Visita",
  plantao: "Plantão",
  reuniao: "Reunião",
  ligacao: "Ligação",
  vistoria: "Vistoria",
  outro: "Outro",
};

export interface Compromisso {
  id: string;
  /** "AAAA-MM-DD", dia local — não ISO com fuso: a agenda é do dia, não do
      instante, e converter para UTC jogaria compromisso da manhã para o dia
      anterior em quem está a oeste de Greenwich. */
  data: string;
  /** "14:30". Opcional: "visita em algum momento de quinta" é compromisso. */
  hora?: string;
  tipo: TipoCompromisso;
  titulo: string;
  local?: string;
}

/** { "2026-W48": { "prospeccao-portais": 7 } } */
export type MarcacoesDaRotina = Record<string, Record<string, number>>;

/* -----------------------------------------------------------------------------
   A FONTE
   ----------------------------------------------------------------------------- */

interface FonteDaGestao {
  lerCompromissos(): Promise<Compromisso[]>;
  gravarCompromissos(lista: Compromisso[]): Promise<void>;
  lerRotina(): Promise<MarcacoesDaRotina>;
  gravarRotina(marcacoes: MarcacoesDaRotina): Promise<void>;
}

const CHAVE_AGENDA = "tridium:corretor:agenda";
const CHAVE_ROTINA = "tridium:corretor:rotina";

function lerLista(): Compromisso[] {
  try {
    const cru = window.localStorage.getItem(CHAVE_AGENDA);
    if (!cru) return [];
    const d: unknown = JSON.parse(cru);
    return Array.isArray(d) ? (d as Compromisso[]) : [];
  } catch {
    /* Aba anônima, cota cheia ou registro corrompido por versão anterior:
       começa vazio em vez de derrubar a página. */
    return [];
  }
}

function lerMapa(): MarcacoesDaRotina {
  try {
    const cru = window.localStorage.getItem(CHAVE_ROTINA);
    if (!cru) return {};
    const d: unknown = JSON.parse(cru);
    return typeof d === "object" && d !== null && !Array.isArray(d)
      ? (d as MarcacoesDaRotina)
      : {};
  } catch {
    return {};
  }
}

function gravarCru(chave: string, valor: unknown) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* Vale enquanto a aba viver. */
  }
}

const fonteLocal: FonteDaGestao = {
  async lerCompromissos() {
    return lerLista().filter(
      (c) =>
        typeof c?.id === "string" &&
        typeof c?.data === "string" &&
        typeof c?.titulo === "string"
    );
  },
  async gravarCompromissos(lista) {
    gravarCru(CHAVE_AGENDA, lista);
  },
  async lerRotina() {
    return lerMapa();
  },
  async gravarRotina(marcacoes) {
    gravarCru(CHAVE_ROTINA, marcacoes);
  },
};

/* A LINHA QUE MUDA quando o banco entrar. */
const fonte: FonteDaGestao = fonteLocal;

/* -----------------------------------------------------------------------------
   OS DIAS DA SEMANA CORRENTE
   -----------------------------------------------------------------------------
   Segunda a domingo, como a semana ISO que as metas já usam. O dia de hoje
   vem marcado: é nele que a tela abre com o olho.
   ----------------------------------------------------------------------------- */

export interface DiaDaSemana {
  /** Dia ISO: 1 segunda … 7 domingo. */
  iso: number;
  /** "AAAA-MM-DD" local. */
  data: string;
  /** "24/11". */
  curta: string;
  hoje: boolean;
}

/** Data local em "AAAA-MM-DD". `toISOString` não serve: converte para UTC. */
function emTexto(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function diasDaSemana(referencia = new Date()): DiaDaSemana[] {
  const hojeTexto = emTexto(referencia);
  const diaIso = referencia.getDay() || 7;
  const segunda = new Date(referencia);
  segunda.setDate(referencia.getDate() - diaIso + 1);

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(segunda);
    d.setDate(segunda.getDate() + i);
    const data = emTexto(d);
    return {
      iso: i + 1,
      data,
      curta: `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`,
      hoje: data === hojeTexto,
    };
  });
}

/* -----------------------------------------------------------------------------
   O GANCHO
   ----------------------------------------------------------------------------- */

export function useGestaoCorretor() {
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [rotina, setRotina] = useState<MarcacoesDaRotina>({});
  /* Enquanto `pronto` for false não se sabe o que há guardado: o primeiro
     render acontece no servidor, onde não existe localStorage. */
  const [pronto, setPronto] = useState(false);

  const semana = semanaAtual();
  const dias = useMemo(() => diasDaSemana(), []);

  useEffect(() => {
    let vivo = true;

    void (async () => {
      const [agenda, marcacoes] = await Promise.all([
        fonte.lerCompromissos(),
        fonte.lerRotina(),
      ]);
      if (!vivo) return;

      /* PODA. A agenda guarda os últimos sessenta dias e o que ainda vem; a
         rotina, as oito últimas semanas. Sem isso o registro cresce para
         sempre, e histórico antigo sem servidor não serve para nada. */
      const limite = new Date();
      limite.setDate(limite.getDate() - 60);
      const corte = emTexto(limite);
      const agendaPodada = agenda.filter((c) => c.data >= corte);

      const semanas = Object.keys(marcacoes).sort().slice(-8);
      const rotinaPodada: MarcacoesDaRotina = {};
      for (const s of semanas) rotinaPodada[s] = marcacoes[s];

      setCompromissos(agendaPodada);
      setRotina(rotinaPodada);
      setPronto(true);

      if (agendaPodada.length !== agenda.length) {
        void fonte.gravarCompromissos(agendaPodada);
      }
      if (semanas.length !== Object.keys(marcacoes).length) {
        void fonte.gravarRotina(rotinaPodada);
      }
    })();

    return () => {
      vivo = false;
    };
  }, []);

  /* As escritas atualizam a tela primeiro e mandam para a fonte depois. Com o
     localStorage a diferença é invisível; com servidor, é o que impede a tela
     de travar a cada clique. */

  const adicionar = useCallback((novo: Omit<Compromisso, "id">) => {
    setCompromissos((atual) => {
      const lista = [
        ...atual,
        {
          ...novo,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        },
      ];
      void fonte.gravarCompromissos(lista);
      return lista;
    });
  }, []);

  const remover = useCallback((id: string) => {
    setCompromissos((atual) => {
      const lista = atual.filter((c) => c.id !== id);
      void fonte.gravarCompromissos(lista);
      return lista;
    });
  }, []);

  const doDia = useCallback(
    (data: string) =>
      compromissos
        .filter((c) => c.data === data)
        /* Sem hora vai para o fim do dia: o que tem horário marcado é o que
           organiza o dia de quem lê. */
        .sort((a, b) => (a.hora ?? "99:99").localeCompare(b.hora ?? "99:99")),
    [compromissos]
  );

  const feitoNaRotina = useCallback(
    (tarefa: string) => rotina[semana]?.[tarefa] ?? 0,
    [rotina, semana]
  );

  const marcarRotina = useCallback(
    (tarefa: string, quantidade: number) => {
      setRotina((atual) => {
        const daSemana = { ...(atual[semana] ?? {}) };
        if (quantidade <= 0) delete daSemana[tarefa];
        else daSemana[tarefa] = quantidade;
        const novo = { ...atual, [semana]: daSemana };
        void fonte.gravarRotina(novo);
        return novo;
      });
    },
    [semana]
  );

  return {
    pronto,
    dias,
    semana,
    doDia,
    adicionar,
    remover,
    feitoNaRotina,
    marcarRotina,
  };
}
