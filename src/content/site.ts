/* =============================================================================
   CONTEÚDO GLOBAL DO GRUPO TRIDIUM
   -----------------------------------------------------------------------------
   Ponto único de edição para dados institucionais. Nenhum componente escreve
   telefone, endereço ou link social diretamente.

   [CONFIRMADO]  dado oficial já validado com o cliente
   [PENDENTE]    aguardando envio do cliente
   ============================================================================= */

export const SITE_URL = "https://www.grupotridium.com.br"; // [PENDENTE] domínio definitivo

export const grupo = {
  nome: "Grupo Tridium",
  nomeCurto: "Tridium",

  /* O símbolo são três galões empilhados sobre uma base sólida — três frentes,
     uma fundação. Essa leitura guia toda a direção de arte do site. */
  assinatura: "Três frentes. Uma fundação.",

  descricao:
    "O Grupo Tridium reúne engenharia, mercado imobiliário e impacto social em torno de uma mesma ideia: o lugar onde alguém vive, trabalha ou brinca é responsabilidade de quem o constrói.",

  cidade: "Florianópolis",
  estado: "SC",
  pais: "BR",

  /* [PENDENTE] endereço completo com número e CEP */
  endereco: {
    logradouro: "[ENDEREÇO PENDENTE]",
    bairro: "[BAIRRO PENDENTE]",
    cidade: "Florianópolis",
    uf: "SC",
    cep: "[CEP PENDENTE]",
    completo: "Florianópolis, Santa Catarina",
  },

  /* [PENDENTE] CNPJ do grupo e das empresas */
  cnpj: "[CNPJ PENDENTE]",

  /* Coordenadas aproximadas de Florianópolis — [PENDENTE] ajustar para a sede */
  geo: { lat: -27.5954, lng: -48.548 },
} as const;

/* -----------------------------------------------------------------------------
   CONTATO — [CONFIRMADO]
   ----------------------------------------------------------------------------- */

export const contato = {
  whatsappNumero: "5548991149253",
  whatsappExibicao: "(48) 99114-9253",
  instagram: "https://www.instagram.com/tridium.engenharia/",
  instagramHandle: "@tridium.engenharia",
  email: "[E-MAIL PENDENTE]",
} as const;

/** Monta o link do WhatsApp com mensagem pré-preenchida por contexto. */
export function whatsappLink(mensagem?: string): string {
  const texto = mensagem ?? mensagensWhatsapp.padrao;
  return `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(texto)}`;
}

export const mensagensWhatsapp = {
  padrao:
    "Olá! Vim pelo site do Grupo Tridium e gostaria de fazer um orçamento sem compromisso.",
  engenharia:
    "Olá! Vim pelo site da Tridium Engenharia e gostaria de fazer um orçamento sem compromisso para o meu projeto.",
  imobiliaria:
    "Olá! Vim pelo site do Grupo Tridium e gostaria de falar com a Imobiliária sobre um imóvel.",
  instituto:
    "Olá! Vim pelo site do Grupo Tridium e gostaria de apoiar o Instituto Tridium.",
  orcamento:
    "Olá! Gostaria de solicitar um orçamento sem compromisso com a Tridium Engenharia.",
} as const;

export const CTA_PRINCIPAL = "Faça seu orçamento sem compromisso.";

/* -----------------------------------------------------------------------------
   AS TRÊS FRENTES
   Os verbos (Construir / Morar / Acolher) são a chave de leitura do grupo:
   cada frente é uma relação diferente com o mesmo edifício.
   ----------------------------------------------------------------------------- */

export type FrontId = "engenharia" | "imobiliaria" | "instituto";

export interface Front {
  id: FrontId;
  verbo: string;
  nome: string;
  marca: string;
  href: string;
  resumo: string;
  descricao: string;
  imagem: string;
  imagemAlt: string;
  /** Espelha --accent-{id} em globals.css. Usado pelo canvas WebGL. */
  accent: string;
  status: "ativa" | "em-estruturacao";
}

export const frentes: Front[] = [
  {
    id: "engenharia",
    verbo: "Construir",
    nome: "Engenharia & Arquitetura",
    marca: "Tridium Engenharia",
    href: "/engenharia",
    resumo: "Engenharia, construção, arquitetura e reforma.",
    descricao:
      "Do projeto executivo à entrega das chaves. Obras residenciais, comerciais e estruturas especiais em Florianópolis e na Grande Florianópolis.",
    imagem: "/img/engenharia/hero.webp",
    imagemAlt:
      "Estrutura de concreto aparente de uma obra em fase de acabamento",
    accent: "#02b030",
    status: "ativa",
  },
  {
    id: "imobiliaria",
    verbo: "Morar",
    nome: "Imobiliária",
    marca: "Tridium Imobiliária",
    href: "/imobiliaria",
    resumo: "Empreendimentos e imóveis com a engenharia do grupo por trás.",
    descricao:
      "Curadoria de imóveis e empreendimentos avaliados pela mesma equipe técnica que constrói. Quem vende conhece a estrutura por dentro.",
    imagem: "/img/imobiliaria/hero.webp",
    imagemAlt:
      "Fachada de edifício residencial contemporâneo ao entardecer",
    accent: "#b08a02",
    status: "em-estruturacao",
  },
  {
    id: "instituto",
    verbo: "Acolher",
    nome: "Instituto Tridium",
    marca: "Instituto Tridium",
    href: "/instituto",
    resumo: "Reforma e reconstrução de moradias para famílias em vulnerabilidade.",
    descricao:
      "O braço social do grupo. Mão de obra, material e projeto técnico direcionados a casas que precisam voltar a ser seguras.",
    imagem: "/img/instituto/hero.webp",
    imagemAlt:
      "Moradora e voluntário levantando a estrutura do telhado de uma casa",
    accent: "#c4522c",
    status: "em-estruturacao",
  },
];

export function getFront(id: FrontId): Front {
  const f = frentes.find((x) => x.id === id);
  if (!f) throw new Error(`Frente desconhecida: ${id}`);
  return f;
}

/* -----------------------------------------------------------------------------
   NAVEGAÇÃO
   ----------------------------------------------------------------------------- */

/* `verbo` é o rótulo secundário do menu. Não é enfeite: repete a chave de
   leitura do site (construir / morar / acolher), que é o que diferencia uma
   frente da outra. Uma numeração 01–04 no lugar não diria nada — a navegação
   não é uma sequência. */
export const navegacao = [
  { rotulo: "Grupo", href: "/", verbo: "Início" },
  { rotulo: "Engenharia", href: "/engenharia", verbo: "Construir" },
  { rotulo: "Imobiliária", href: "/imobiliaria", verbo: "Morar" },
  { rotulo: "Instituto", href: "/instituto", verbo: "Acolher" },
];

/* -----------------------------------------------------------------------------
   LOGOS — arquivos oficiais entregues pelo cliente
   ----------------------------------------------------------------------------- */

/* Nomenclatura dos arquivos originais: "FUNDO-ESCURO" = versão para aplicar
   SOBRE fundo escuro (lettering osso). "FUNDO-CLARO" = para fundo claro
   (lettering verde-mata). Todos com fundo transparente. */
export const logos = {
  horizSobreEscuro: "/logos/FUNDO-ESCURO-H_1.png",
  horizSobreClaro: "/logos/FUNDO-CLARO-H_1.png",
  vertSobreEscuro: "/logos/FUNDO-ESCURO-V.png",
  vertSobreClaro: "/logos/FUNDO-CLARO-V.png",
  iconeSobreEscuro: "/logos/ICONE-FUNDO-ESCURO.png",
  iconeSobreClaro: "/logos/ICONE-FUNDO-CLARO.png",
} as const;
