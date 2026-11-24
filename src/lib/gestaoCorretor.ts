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
import { apagarFotosDe } from "./fotosCaptacao";

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
   O MONITORAMENTO
   -----------------------------------------------------------------------------
   Três controles que o corretor mantém por fora do site público:

     REVISÃO DOS PUBLICADOS  anúncio no ar envelhece. Preço que mudou, foto de
                             estação errada e texto desatualizado derrubam a
                             confiança de quem liga. A casa revisa a cada 60
                             dias, e aqui fica o registro de quando foi.
     CAPTAÇÕES               o que ainda não subiu. É a fila entre "visitei"
                             e "está anunciado", e é onde imóvel se perde:
                             sem lista, ninguém lembra do que falta.
     INVESTIDORES            a frente de relacionamento com empresário e
                             investidor, que tem meta própria.

   ⚠ NENHUM DOS TRÊS ACEITA DADO DE CLIENTE enquanto o acesso for conferido no
   navegador. Por isso o campo de investidor se chama `referencia` e não
   `nome`: a tela pede iniciais, codinome ou o código do negócio. Guardar
   "João da Silva, 48 99xxx" num localStorage que qualquer um lê abrindo o
   navegador é o tipo de coisa que a LGPD cobra da empresa, não do corretor.
   ----------------------------------------------------------------------------- */

/** O dia da última revisão de cada imóvel publicado, pela chave do imóvel. */
export type RevisoesDeImovel = Record<string, { em: string; nota?: string }>;

/** De quantos em quantos dias um anúncio no ar precisa ser revisto. */
export const DIAS_ENTRE_REVISOES = 60;

export type StatusCaptacao =
  | "visitada"
  | "autorizacao"
  | "documentos"
  | "fotos"
  | "pronta";

export const rotuloDaCaptacao: Record<StatusCaptacao, string> = {
  visitada: "Visitada",
  autorizacao: "Autorização pendente",
  documentos: "Documentos",
  fotos: "Fotos",
  pronta: "Pronta para publicar",
};

/* A FICHA DA CAPTAÇÃO ESPELHA A DO SITE, campo por campo, e isso é o ponto:
   o que o corretor preenche aqui é exatamente o que falta para o imóvel ser
   publicado. Ficha incompleta aqui é anúncio que não sobe lá.

   Tudo opcional menos `identificacao`: captação nasce com uma linha anotada
   no plantão e vai sendo completada. Exigir a ficha inteira na entrada faria
   o corretor não registrar nada. */
export interface Captacao {
  id: string;
  /** Como a casa chama o imóvel. Rua e tipo bastam — sem nome de dono. */
  identificacao: string;
  status: StatusCaptacao;
  nota?: string;
  /** "AAAA-MM-DD" em que entrou na lista. */
  em: string;

  /* ----- A ficha, nos mesmos campos de `content/imobiliaria.ts` ----- */

  /** Código do anúncio, quando a casa já tiver atribuído um. */
  codigo?: string;
  tipo?: string;
  finalidade?: "venda" | "aluguel";
  /** Nome do condomínio ou empreendimento. */
  empreendimento?: string;
  bairro?: string;
  cidade?: string;
  /** Rua e número, para o mapa. */
  endereco?: string;
  dormitorios?: number;
  suites?: number;
  vagas?: number;
  /** Área privativa em m². */
  area?: number;
  /** Área do terreno em m². */
  areaTerreno?: number;
  /** Em reais. */
  preco?: number;
  condominio?: number;
  iptu?: number;
  /** Mobiliado, aceita permuta, frente mar — o que vira selo no card. */
  selos?: string[];
  /** A manchete do anúncio, quando escrita à mão. */
  titulo?: string;
  /** O parágrafo de abertura do anúncio. */
  resumo?: string;
  /** O texto longo, um parágrafo por linha. */
  descricao?: string;
  /** Um diferencial por linha. */
  diferenciais?: string;
}

export type StatusInvestidor =
  | "a-contatar"
  | "agendada"
  | "realizada"
  | "retorno"
  | "encerrada";

export const rotuloDoInvestidor: Record<StatusInvestidor, string> = {
  "a-contatar": "A contatar",
  agendada: "Visita agendada",
  realizada: "Visita realizada",
  retorno: "Aguardando retorno",
  encerrada: "Encerrada",
};

export interface ContatoInvestidor {
  id: string;
  /** Iniciais, codinome ou código do negócio. NUNCA o nome e o telefone. */
  referencia: string;
  /** Ramo ou tipo de interesse: "incorporação", "renda", "terreno". */
  interesse?: string;
  status: StatusInvestidor;
  /** "AAAA-MM-DD" da visita, quando houver. */
  data?: string;
  nota?: string;
}

/* -----------------------------------------------------------------------------
   A FONTE
   ----------------------------------------------------------------------------- */

/* As caixas em que a gestão guarda coisa. Uma por assunto, porque cada uma
   vira um recurso próprio quando houver API — e não um blobão só. */
type Caixa = "agenda" | "rotina" | "revisoes" | "captacoes" | "investidores";

const CHAVES: Record<Caixa, string> = {
  agenda: "tridium:corretor:agenda",
  rotina: "tridium:corretor:rotina",
  revisoes: "tridium:corretor:revisoes",
  captacoes: "tridium:corretor:captacoes",
  investidores: "tridium:corretor:investidores",
};

/* A fonte é genérica de propósito. Com um par de métodos por caixa seriam
   dez funções para reescrever no dia da API; assim são duas, e cada caixa
   vira uma rota. O tipo volta pelo `vazio`, que também é o que se devolve
   quando não há nada guardado ou quando o que está lá não presta. */
interface FonteDaGestao {
  ler<T>(caixa: Caixa, vazio: T): Promise<T>;
  gravar(caixa: Caixa, valor: unknown): Promise<void>;
}

const fonteLocal: FonteDaGestao = {
  async ler<T>(caixa: Caixa, vazio: T): Promise<T> {
    try {
      const cru = window.localStorage.getItem(CHAVES[caixa]);
      if (!cru) return vazio;
      const d: unknown = JSON.parse(cru);
      /* O formato guardado tem de ser o mesmo do `vazio`: versão anterior
         que gravou outra coisa não derruba a página, começa do zero. */
      if (Array.isArray(vazio)) return Array.isArray(d) ? (d as T) : vazio;
      return typeof d === "object" && d !== null && !Array.isArray(d)
        ? (d as T)
        : vazio;
    } catch {
      /* Aba anônima, armazenamento bloqueado ou registro corrompido. */
      return vazio;
    }
  },
  async gravar(caixa: Caixa, valor: unknown) {
    try {
      window.localStorage.setItem(CHAVES[caixa], JSON.stringify(valor));
    } catch {
      /* Vale enquanto a aba viver. */
    }
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
  const [revisoes, setRevisoes] = useState<RevisoesDeImovel>({});
  const [captacoes, setCaptacoes] = useState<Captacao[]>([]);
  const [investidores, setInvestidores] = useState<ContatoInvestidor[]>([]);
  /* Enquanto `pronto` for false não se sabe o que há guardado: o primeiro
     render acontece no servidor, onde não existe localStorage. */
  const [pronto, setPronto] = useState(false);

  const semana = semanaAtual();
  const dias = useMemo(() => diasDaSemana(), []);

  useEffect(() => {
    let vivo = true;

    void (async () => {
      const [agenda, marcacoes, revisto, captado, investido] = await Promise.all([
        fonte.ler<Compromisso[]>("agenda", []),
        fonte.ler<MarcacoesDaRotina>("rotina", {}),
        fonte.ler<RevisoesDeImovel>("revisoes", {}),
        fonte.ler<Captacao[]>("captacoes", []),
        fonte.ler<ContatoInvestidor[]>("investidores", []),
      ]);
      if (!vivo) return;

      setRevisoes(revisto);
      setCaptacoes(captado.filter((c) => typeof c?.id === "string"));
      setInvestidores(investido.filter((c) => typeof c?.id === "string"));

      /* PODA. A agenda guarda os últimos sessenta dias e o que ainda vem; a
         rotina, as oito últimas semanas. Sem isso o registro cresce para
         sempre, e histórico antigo sem servidor não serve para nada. */
      const limite = new Date();
      limite.setDate(limite.getDate() - 60);
      const corte = emTexto(limite);
      const agendaPodada = agenda
        .filter(
          (c) =>
            typeof c?.id === "string" &&
            typeof c?.data === "string" &&
            typeof c?.titulo === "string"
        )
        .filter((c) => c.data >= corte);

      const semanas = Object.keys(marcacoes).sort().slice(-8);
      const rotinaPodada: MarcacoesDaRotina = {};
      for (const s of semanas) rotinaPodada[s] = marcacoes[s];

      setCompromissos(agendaPodada);
      setRotina(rotinaPodada);
      setPronto(true);

      if (agendaPodada.length !== agenda.length) {
        void fonte.gravar("agenda", agendaPodada);
      }
      if (semanas.length !== Object.keys(marcacoes).length) {
        void fonte.gravar("rotina", rotinaPodada);
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
      const lista = [...atual, { ...novo, id: novoId() }];
      void fonte.gravar("agenda", lista);
      return lista;
    });
  }, []);

  const remover = useCallback((id: string) => {
    setCompromissos((atual) => {
      const lista = atual.filter((c) => c.id !== id);
      void fonte.gravar("agenda", lista);
      return lista;
    });
  }, []);

  /* ---------- Revisão dos imóveis publicados ---------- */

  const revisao = useCallback(
    (imovel: string) => revisoes[imovel],
    [revisoes]
  );

  const registrarRevisao = useCallback((imovel: string, nota?: string) => {
    setRevisoes((atual) => {
      const novo = {
        ...atual,
        [imovel]: { em: emTexto(new Date()), nota: nota?.trim() || undefined },
      };
      void fonte.gravar("revisoes", novo);
      return novo;
    });
  }, []);

  const apagarRevisao = useCallback((imovel: string) => {
    setRevisoes((atual) => {
      const novo = { ...atual };
      delete novo[imovel];
      void fonte.gravar("revisoes", novo);
      return novo;
    });
  }, []);

  /* ---------- Captações ---------- */

  const adicionarCaptacao = useCallback(
    (nova: Omit<Captacao, "id" | "em">) => {
      setCaptacoes((atual) => {
        const lista = [
          ...atual,
          { ...nova, id: novoId(), em: emTexto(new Date()) },
        ];
        void fonte.gravar("captacoes", lista);
        return lista;
      });
    },
    []
  );

  const mudarCaptacao = useCallback(
    (id: string, mudanca: Partial<Omit<Captacao, "id">>) => {
      setCaptacoes((atual) => {
        const lista = atual.map((c) =>
          c.id === id ? { ...c, ...mudanca } : c
        );
        void fonte.gravar("captacoes", lista);
        return lista;
      });
    },
    []
  );

  const removerCaptacao = useCallback((id: string) => {
    setCaptacoes((atual) => {
      const lista = atual.filter((c) => c.id !== id);
      void fonte.gravar("captacoes", lista);
      return lista;
    });
    /* As fotos vivem noutro depósito, o IndexedDB, e não saem junto com a
       linha. Sem isto elas ficariam órfãs lá, ocupando espaço para sempre
       e sem nenhuma tela por onde apagá-las. */
    void apagarFotosDe(id);
  }, []);

  /* ---------- Investidores ---------- */

  const adicionarInvestidor = useCallback(
    (novo: Omit<ContatoInvestidor, "id">) => {
      setInvestidores((atual) => {
        const lista = [...atual, { ...novo, id: novoId() }];
        void fonte.gravar("investidores", lista);
        return lista;
      });
    },
    []
  );

  const mudarInvestidor = useCallback(
    (id: string, mudanca: Partial<Omit<ContatoInvestidor, "id">>) => {
      setInvestidores((atual) => {
        const lista = atual.map((c) =>
          c.id === id ? { ...c, ...mudanca } : c
        );
        void fonte.gravar("investidores", lista);
        return lista;
      });
    },
    []
  );

  const removerInvestidor = useCallback((id: string) => {
    setInvestidores((atual) => {
      const lista = atual.filter((c) => c.id !== id);
      void fonte.gravar("investidores", lista);
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
        void fonte.gravar("rotina", novo);
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
    revisao,
    registrarRevisao,
    apagarRevisao,
    captacoes,
    adicionarCaptacao,
    mudarCaptacao,
    removerCaptacao,
    investidores,
    adicionarInvestidor,
    mudarInvestidor,
    removerInvestidor,
  };
}

/* Identificador de registro novo. Não precisa ser único no mundo — precisa
   ser único nesta lista, neste navegador. Quando houver banco, quem dá o id
   é ele. */
function novoId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* -----------------------------------------------------------------------------
   O RELÓGIO DOS 60 DIAS
   -----------------------------------------------------------------------------
   Sem data de publicação nos dados do imóvel, o único marco confiável é a
   última revisão registrada pelo corretor. Imóvel sem revisão nenhuma não
   recebe prazo inventado: aparece como "nunca revisado", que é verdade e já
   é motivo para olhar.
   ----------------------------------------------------------------------------- */

export interface PrazoDeRevisao {
  /** Nunca revisado: não há de quando contar. */
  nunca: boolean;
  /** Dias desde a última revisão. */
  dias: number;
  /** Já passou dos 60. */
  vencido: boolean;
  /** Falta menos de uma semana para vencer. */
  perto: boolean;
}

export function prazoDeRevisao(em: string | undefined): PrazoDeRevisao {
  if (!em) return { nunca: true, dias: 0, vencido: true, perto: false };

  const quando = new Date(`${em}T12:00:00`);
  if (Number.isNaN(quando.getTime())) {
    return { nunca: true, dias: 0, vencido: true, perto: false };
  }

  const hoje = new Date();
  hoje.setHours(12, 0, 0, 0);
  const dias = Math.max(
    0,
    Math.round((hoje.getTime() - quando.getTime()) / 86400000)
  );

  return {
    nunca: false,
    dias,
    vencido: dias >= DIAS_ENTRE_REVISOES,
    perto: dias >= DIAS_ENTRE_REVISOES - 7 && dias < DIAS_ENTRE_REVISOES,
  };
}
