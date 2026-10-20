/* =============================================================================
   CONTEÚDO GLOBAL DO GRUPO TRIDIUM
   -----------------------------------------------------------------------------
   Ponto único de edição para dados institucionais. Nenhum componente escreve
   telefone, endereço ou link social diretamente.

   [CONFIRMADO]  dado oficial já validado com o cliente
   [PENDENTE]    aguardando envio do cliente
   ============================================================================= */

/* Endereço canônico do site. Alimenta metadataBase (URLs canônicas e imagens
   de Open Graph), robots.txt, sitemap.xml e todos os @id de schema.org.

   Sem "www": é a forma registrada na Hostinger e a única que existe no DNS.
   Se um dia o www for criado, ele deve REDIRECIONAR para esta — e não servir
   o site em paralelo, o que dividiria a autoridade do domínio na busca. */
export const SITE_URL = "https://grupotridium.com.br";

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

  endereco: {
    logradouro: "Rua São Vicente de Paula, 161 — Loja 01",
    bairro: "Agronômica",
    cidade: "Florianópolis",
    uf: "SC",
    cep: "88025-330",
    completo:
      "Rua São Vicente de Paula, 161 — Loja 01, Agronômica, Florianópolis · SC, 88025-330",
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
  email: "contato@grupotridium.com.br",
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
    "Olá! Vim pelo site do Grupo Tridium e gostaria de falar com a Tridium Imóveis sobre um imóvel.",
  instituto:
    "Olá! Vim pelo site do Grupo Tridium e gostaria de apoiar o Instituto Tridium.",
  orcamento:
    "Olá! Gostaria de solicitar um orçamento sem compromisso com a Tridium Engenharia.",
} as const;

export const CTA_PRINCIPAL = "Faça seu orçamento sem compromisso.";

/** Mensagem do WhatsApp adequada à rota em que o usuário está. */
export function mensagemPorRota(pathname: string): string {
  if (pathname.startsWith("/engenharia")) return mensagensWhatsapp.engenharia;
  if (pathname.startsWith("/imobiliaria")) return mensagensWhatsapp.imobiliaria;
  if (pathname.startsWith("/instituto")) return mensagensWhatsapp.instituto;
  return mensagensWhatsapp.padrao;
}

/* Rótulo do botão de contato, por frente.
   O verbo muda com o negócio: quem procura a Engenharia quer um orçamento de
   obra; quem procura a Tridium Imóveis quer falar com um corretor. Um rótulo
   para as três faria o botão prometer a coisa errada em duas delas.

   `curto` é o botão do cabeçalho; `longo`, o rótulo do botão flutuante, que
   tem mais espaço. */
export const ctaContato = {
  padrao: { curto: "Orçamento", longo: "Fazer orçamento" },
  engenharia: { curto: "Orçamento", longo: "Fazer orçamento" },
  imobiliaria: { curto: "Agendar visita", longo: "Agendar visita" },
  instituto: { curto: "Apoiar", longo: "Apoiar o Instituto" },
} as const;

export function ctaPorRota(pathname: string): { curto: string; longo: string } {
  if (pathname.startsWith("/engenharia")) return ctaContato.engenharia;
  if (pathname.startsWith("/imobiliaria")) return ctaContato.imobiliaria;
  if (pathname.startsWith("/instituto")) return ctaContato.instituto;
  return ctaContato.padrao;
}

/* -----------------------------------------------------------------------------
   AS TRÊS FRENTES
   `verbo` é a palavra grande de cada faixa do portal na home e o rótulo
   secundário do menu.
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
  /* Descreve a maturidade da frente. Deixou de ser exibido como selo nas
     faixas do portal, mas segue aqui porque continua verdadeiro e porque as
     páginas de Imóveis e Instituto ainda trazem o aviso de conteúdo
     provisório. Para voltar a mostrar o selo, basta ler este campo. */
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
    verbo: "Imóveis",
    nome: "Imóveis",
    marca: "Tridium Imóveis",
    href: "/imobiliaria",
    resumo: "Empreendimentos e imóveis com a engenharia do grupo por trás.",
    descricao:
      "Curadoria de imóveis e empreendimentos avaliados pela mesma equipe técnica que constrói. Quem vende conhece a estrutura por dentro.",
    /* A mesma foto que abre a aba de imóveis: quem vê a faixa no portal e
       clica reconhece onde chegou. */
    imagem: "/img/imobiliaria/imovel-01.webp",
    imagemAlt:
      "Rua de casas brancas de alto padrão com telhados de cerâmica",
    accent: "#b08a02",
    status: "em-estruturacao",
  },
  {
    id: "instituto",
    verbo: "Instituto Tridium",
    nome: "Instituto Tridium",
    marca: "Instituto Tridium",
    href: "/instituto",
    resumo:
      "Os projetos sociais do grupo: moradia, capoeira, esporte, cultura e formação técnica.",
    descricao:
      "O braço social da Tridium, e a casa de mais de um projeto: o Moradia Digna, que devolve segurança a casas em risco, o núcleo de capoeira e a formação técnica em ofícios da construção. Outras frentes entram conforme o Instituto cresce.",
    imagem: "/img/instituto/tereza-visita.webp",
    imagemAlt:
      "Dona Tereza conversa com um engenheiro da Tridium na porta de casa",
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

/* `verbo` é o rótulo secundário do menu, e repete a palavra grande que a
   frente usa no portal da home. Uma numeração 01–04 no lugar não diria nada:
   a navegação não é uma sequência. */
export const navegacao = [
  { rotulo: "Grupo", href: "/", verbo: "Início" },
  { rotulo: "Engenharia", href: "/engenharia", verbo: "Construir" },
  { rotulo: "Imóveis", href: "/imobiliaria", verbo: "Tridium Imóveis" },
  { rotulo: "Instituto", href: "/instituto", verbo: "Instituto Tridium" },
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
