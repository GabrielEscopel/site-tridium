/* =============================================================================
   TRIDIUM IMOBILIÁRIA — conteúdo
   -----------------------------------------------------------------------------
   ⚠ FRENTE EM ESTRUTURAÇÃO.
   Praticamente todo o conteúdo desta página é PROVISÓRIO e existe apenas para
   sustentar o layout. O cliente ainda enviará: nome oficial da imobiliária,
   CRECI, textos, carteira real de imóveis e fotografia própria.

   Marcadores usados: [CONTEÚDO IMOBILIÁRIA PENDENTE] e [FOTO PENDENTE].
   ============================================================================= */

/* -----------------------------------------------------------------------------
   MODELO DE IMÓVEL
   Formato único da carteira. Hoje o array é escrito à mão; quando vier de um
   CRM, basta a fonte devolver objetos neste mesmo formato.
   ----------------------------------------------------------------------------- */

export interface FotoImovel {
  src: string;
  alt: string;
  /** Imagem de banco no lugar da foto real. Mostra o selo na tela. */
  provisoria?: boolean;
}

export interface Imovel {
  chave: string;
  tipo: string;
  finalidade: "venda" | "aluguel";
  situacao: string;
  bairro: string;
  cidade: string;
  /** Texto de busca do mapa. Rua e bairro bastam. */
  endereco: string;
  dormitorios: number;
  suites?: number;
  vagas: number;
  /** Área privativa em m². */
  area: number;
  /** Em reais. `null` mostra "Sob consulta". */
  preco: number | null;
  condominio?: number;
  iptu?: number;
  selos?: string[];
  resumo: string;
  descricao: string[];
  diferenciais: string[];
  /** A avaliação técnica da engenharia do grupo — o diferencial da casa. */
  laudo?: string;
  fotos: FotoImovel[];
}

/** R$ 1.100.000, ou "Sob consulta" quando não houver preço público. */
export function formatarPreco(valor: number | null): string {
  if (valor === null) return "Sob consulta";
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

/** "Apartamento · 2 quartos · 93 m² · 1 vaga" — usado em alt e em SEO. */
export function resumirImovel(imovel: Imovel): string {
  const partes = [imovel.tipo];
  if (imovel.dormitorios > 0) {
    partes.push(`${imovel.dormitorios} quarto${imovel.dormitorios > 1 ? "s" : ""}`);
  }
  partes.push(`${imovel.area} m²`);
  if (imovel.vagas > 0) {
    partes.push(`${imovel.vagas} vaga${imovel.vagas > 1 ? "s" : ""}`);
  }
  return partes.join(" · ");
}

/* --- Carteira ----------------------------------------------------------
   [CONTEÚDO IMOBILIÁRIA PENDENTE]
   Os registros abaixo são FICTÍCIOS e existem só para a estrutura ficar
   navegável. Substituir pela carteira real.

   COMO ADICIONAR UM IMÓVEL
   Copie um bloco e troque os valores. A lista, os filtros e a página de
   cada imóvel se montam sozinhos — nenhum componente precisa mudar. Os
   filtros derivam dos próprios dados: bairro novo vira opção nova.

   Quando a carteira crescer, este array é o ponto de troca para um CRM:
   basta que a fonte devolva objetos neste formato. */
export const imoveis: Imovel[] = [
  {
    chave: "apartamento-centro-01",
    tipo: "Apartamento",
    finalidade: "venda",
    situacao: "Pronto para morar",
    bairro: "Centro",
    cidade: "Florianópolis",
    /* Vira a busca do mapa. Rua e bairro bastam — não precisa do número. */
    endereco: "Centro, Florianópolis, SC",
    dormitorios: 2,
    suites: 1,
    vagas: 1,
    area: 93,
    preco: 1100000,
    condominio: 1180,
    iptu: 1065,
    selos: ["Mobiliado"],
    resumo:
      "[CONTEÚDO PENDENTE] Uma linha sobre o imóvel, o que ele tem de melhor.",
    descricao: [
      "[CONTEÚDO PENDENTE] Descrição do imóvel: posição no andar, estado de conservação, o que foi reformado e quando.",
    ],
    diferenciais: ["Elevador", "Portaria 24h", "Salão de festas"],
    /* O que distingue a Tridium de qualquer imobiliária: a avaliação
       técnica de quem constrói. [CONTEÚDO PENDENTE] */
    laudo:
      "[CONTEÚDO PENDENTE] O que a engenharia do grupo encontrou na vistoria — estrutura, instalações, infiltração, o que precisa de intervenção e a estimativa de custo.",
    fotos: [
      {
        src: "/img/imobiliaria/imovel-01.webp",
        alt: "Sala de estar ampla com janelas do piso ao teto",
        provisoria: true,
      },
      {
        src: "/img/imobiliaria/imovel-02.webp",
        alt: "Ambiente integrado de cozinha e sala",
        provisoria: true,
      },
    ],
  },
  {
    chave: "casa-lagoa-01",
    tipo: "Casa",
    finalidade: "venda",
    situacao: "Pronto para morar",
    bairro: "Lagoa da Conceição",
    cidade: "Florianópolis",
    endereco: "Lagoa da Conceição, Florianópolis, SC",
    dormitorios: 3,
    suites: 1,
    vagas: 2,
    area: 180,
    preco: 2450000,
    selos: ["Exclusivo"],
    resumo:
      "[CONTEÚDO PENDENTE] Uma linha sobre o imóvel, o que ele tem de melhor.",
    descricao: [
      "[CONTEÚDO PENDENTE] Descrição do imóvel.",
    ],
    diferenciais: ["Quintal", "Churrasqueira", "Vista"],
    laudo: "[CONTEÚDO PENDENTE] Avaliação técnica da engenharia do grupo.",
    fotos: [
      {
        src: "/img/imobiliaria/imovel-03.webp",
        alt: "Fachada de casa com área externa",
        provisoria: true,
      },
    ],
  },
  {
    chave: "terreno-rio-tavares-01",
    tipo: "Terreno",
    finalidade: "venda",
    situacao: "Disponível",
    bairro: "Rio Tavares",
    cidade: "Florianópolis",
    endereco: "Rio Tavares, Florianópolis, SC",
    dormitorios: 0,
    vagas: 0,
    area: 450,
    preco: null,
    resumo:
      "[CONTEÚDO PENDENTE] Uma linha sobre o terreno e o que cabe nele.",
    descricao: [
      "[CONTEÚDO PENDENTE] Descrição do terreno: topografia, zoneamento, o que o plano diretor permite construir ali.",
    ],
    diferenciais: ["Plano", "Documentação regular"],
    laudo:
      "[CONTEÚDO PENDENTE] Estudo de viabilidade construtiva: o que o zoneamento permite e o que o terreno comporta.",
    fotos: [
      {
        src: "/img/imobiliaria/imovel-04.webp",
        alt: "Terreno com vegetação ao fundo",
        provisoria: true,
      },
    ],
  },
];

export const imobiliaria = {
  marca: "Tridium Imóveis", // [CONTEÚDO IMOBILIÁRIA PENDENTE] confirmar nome oficial
  creci: "[CRECI PENDENTE]",
  posicionamento: "Quem vende conhece a estrutura por dentro.",

  hero: {
    eyebrow: "Florianópolis · SC",
    titulo: ["Imóvel", "avaliado por", "quem constrói."],
    lead: "A mesma equipe técnica que executa obra avalia o que entra na carteira. É uma vantagem simples e difícil de copiar: sabemos o que procurar atrás do acabamento.",
    /* [FOTO PENDENTE] imagem provisória de banco de imagens */
    imagem: "/img/imobiliaria/hero.webp",
    imagemAlt: "Fachada de edifício residencial contemporâneo ao entardecer",
    imagemProvisoria: true,
  },

  /* --- Diferenciais ------------------------------------------------------ */
  diferenciais: [
    {
      titulo: "Laudo técnico antes do anúncio",
      texto:
        "Todo imóvel da carteira passa por avaliação da engenharia do grupo. O que está errado é informado antes da visita, não depois da escritura.",
    },
    {
      titulo: "Reforma orçada na proposta",
      texto:
        "Se o imóvel precisa de intervenção, você recebe o orçamento da Tridium Engenharia junto com o valor de venda. Dá para decidir com o custo total à vista.",
    },
    {
      titulo: "Um grupo, um interlocutor",
      texto:
        "Compra, reforma e regularização resolvidas pelo mesmo time. Você não precisa costurar corretor, engenheiro e despachante.",
    },
    {
      titulo: "Foco em Florianópolis",
      texto:
        "Atuação concentrada na Ilha e na Grande Florianópolis. Conhecimento de bairro, de vizinhança e de restrição construtiva local.",
    },
  ],

  /* --- Serviços ao cliente ---------------------------------------------- */
  servicos: [
    { titulo: "Compra", texto: "Busca orientada por perfil, visita acompanhada e análise técnica do imóvel." },
    { titulo: "Venda", texto: "Avaliação, preparo do imóvel para venda e divulgação. [CONTEÚDO IMOBILIÁRIA PENDENTE]" },
    { titulo: "Locação", texto: "[CONTEÚDO IMOBILIÁRIA PENDENTE] confirmar se a frente atuará com locação." },
    { titulo: "Regularização", texto: "Averbação, habite-se e adequação documental com apoio da engenharia do grupo." },
  ],

  cta: {
    titulo: "Agende uma visita.",
    texto:
      "Diga o bairro, o perfil e o orçamento. Retornamos com o que existe hoje na carteira — e com o que evitaríamos comprar.",
    botao: "Falar no WhatsApp",
  },
} as const;


/* -----------------------------------------------------------------------------
   FILTROS
   As opções saem da própria carteira: bairro novo vira filtro novo sozinho.
   Nada para manter em paralelo.
   ----------------------------------------------------------------------------- */

function unicos(valores: string[]): string[] {
  return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export const opcoesFiltro = {
  tipos: unicos(imoveis.map((i) => i.tipo)),
  bairros: unicos(imoveis.map((i) => i.bairro)),
  /** Faixas fixas: intervalos redondos leem melhor que um controle deslizante. */
  dormitorios: [1, 2, 3, 4],
};

export function buscarImovel(chave: string): Imovel | undefined {
  return imoveis.find((i) => i.chave === chave);
}
