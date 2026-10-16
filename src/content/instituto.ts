/* =============================================================================
   INSTITUTO TRIDIUM — conteúdo
   -----------------------------------------------------------------------------
   ⚠ FRENTE EM ESTRUTURAÇÃO. Boa parte do conteúdo é PROVISÓRIA.

   COMO ADICIONAR UM PROJETO NOVO
   Todo projeto do Instituto segue a mesma estrutura, na ordem abaixo:

       nome e resumo  →  sobre o projeto + ficha  →  história em destaque
       →  fotos e vídeos  →  números  →  como apoiar ESTE projeto

   Para criar um projeto novo, copie um bloco inteiro do array `projetos` e
   troque os valores. A página se monta sozinha: não é preciso editar nenhum
   componente nem a página. A ordem do array é a ordem em que aparecem.

   Marcadores: [CONTEÚDO PENDENTE] no texto, `pendente: true` na mídia.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   MÍDIA
   Uma foto ou um vídeo do projeto. Enquanto `pendente` for true, o site mostra
   um painel dizendo o que precisa ser produzido — nunca uma imagem de banco.
   ----------------------------------------------------------------------------- */
export interface Midia {
  tipo: "foto" | "video";
  /** O que esta mídia mostra. Aparece na legenda e, se pendente, no painel. */
  descricao: string;
  /** true enquanto não houver arquivo real. */
  pendente?: boolean;
  /** Foto: caminho em /public. Vídeo: caminho do arquivo ou ID do YouTube. */
  src?: string;
  /** Vídeo: de onde vem. */
  fonte?: "arquivo" | "youtube";
  /** Vídeo: imagem de capa. */
  poster?: string;
  /** Foto: texto alternativo. Obrigatório quando houver src. */
  alt?: string;
  /** Ocupa duas colunas na grade. Use para a foto mais forte do conjunto. */
  destaque?: boolean;
  /** object-position do recorte, ex: "center 38%". Use quando o assunto não
      estiver no centro e a foto for cortada por um contêiner largo. */
  posicao?: string;
}

export interface FormaDeApoio {
  titulo: string;
  texto: string;
  acao: string;
  /** Mensagem que abre no WhatsApp. Cite o projeto pelo nome. */
  mensagem: string;
  /** [CONTEÚDO PENDENTE] o que falta definir para esta forma de apoio. */
  pendencia?: string;
}

export interface Projeto {
  chave: string;
  nome: string;
  /** Uma linha. Aparece sob o nome e no índice de projetos. */
  resumo: string;
  /** Ficha rápida. Use "[PENDENTE]" no que ainda não estiver definido. */
  ficha: { rotulo: string; valor: string }[];
  /** Parágrafos sobre o projeto. */
  sobre: string[];
  /** Pessoa ou família em destaque. Opcional. */
  destaque?: {
    nome: string;
    papel: string;
    texto: string;
    midia: Midia;
  };
  /** Fotos e vídeos do projeto. */
  registro: Midia[];
  numeros?: { valor: string; rotulo: string }[];
  apoio: FormaDeApoio[];
  /** Mostra a jornada em capítulos (hoje só o Moradia Digna tem). */
  temJornada?: boolean;
}

/* -----------------------------------------------------------------------------
   DESTAQUES — o carrossel do topo
   Cada slide é uma chamada: uma foto forte, uma frase e uma ação. É o lugar
   de colocar o que está acontecendo AGORA — a obra em andamento, a turma que
   abriu, a campanha do mês. A ordem do array é a ordem dos slides.
   ----------------------------------------------------------------------------- */

export interface Destaque {
  chave: string;
  /** Categoria acima do título. Normalmente o nome do projeto. */
  eyebrow: string;
  titulo: string;
  texto: string;
  acao: { rotulo: string; href: string; externo?: boolean };
  /** Foto de fundo. Enquanto pendente, entra o painel de foto pendente. */
  midia: Midia;
  /** Lado do texto. Escolha o oposto de onde estão as pessoas na foto —
      senão o painel cobre justamente o assunto. Padrão: esquerda. */
  textoEm?: "esquerda" | "direita";
}

export const destaques: Destaque[] = [
  {
    chave: "dona-tereza",
    eyebrow: "Moradia Digna",
    titulo: "A primeira casa foi a da dona Tereza.",
    texto:
      "[CONTEÚDO PENDENTE] Uma frase sobre a casa dela — o que estava em risco e o que mudou. Esta é a chamada mais forte que o Instituto tem.",
    acao: { rotulo: "Conhecer o projeto", href: "#moradia-digna" },
    /* Dona Tereza e o engenheiro estão à esquerda do quadro: o texto vai para
       a direita, sobre a parede de tábuas. */
    textoEm: "direita",
    midia: {
      tipo: "foto",
      src: "/img/instituto/tereza-visita.webp",
      alt: "Dona Tereza conversa com um engenheiro da Tridium na porta de casa",
      descricao: "A visita técnica à casa da dona Tereza",
      posicao: "center 45%",
    },
  },
  {
    chave: "capoeira",
    eyebrow: "Capoeira",
    titulo: "[CONTEÚDO PENDENTE] A chamada do núcleo de capoeira.",
    texto:
      "[CONTEÚDO PENDENTE] Uma frase sobre as aulas: quem participa, onde acontece e o que muda para essas crianças e jovens.",
    acao: { rotulo: "Conhecer o projeto", href: "#capoeira" },
    midia: {
      tipo: "foto",
      pendente: true,
      descricao:
        "Roda de capoeira em movimento. Foto horizontal, aberta, que mostre o grupo inteiro.",
    },
  },
  {
    chave: "apoiar",
    eyebrow: "Como entrar",
    titulo: "Nem todo apoio é dinheiro.",
    texto:
      "Tempo, material, equipamento, um espaço emprestado, uma indicação. Há uma forma de ajudar que cabe no que você tem.",
    acao: {
      rotulo: "Falar com a gente",
      href: "https://wa.me/5548991149253",
      externo: true,
    },
    midia: {
      tipo: "foto",
      src: "/img/instituto/tereza-equipe.webp",
      alt: "Equipe do Instituto Tridium reunida com a dona Tereza na porta de casa",
      descricao: "A equipe com a dona Tereza",
      posicao: "center 38%",
    },
  },
];

/* -----------------------------------------------------------------------------
   ATUALIZAÇÕES — o que está acontecendo
   É o que mantém o Instituto vivo entre uma obra e outra: mutirão realizado,
   turma nova, família atendida, parceria fechada. Item novo entra no topo.
   ----------------------------------------------------------------------------- */

export interface Atualizacao {
  chave: string;
  /** Nome do projeto, ou "Instituto" para avisos gerais. */
  categoria: string;
  titulo: string;
  resumo: string;
  /** Data em ISO (AAAA-MM-DD). Usada para ordenar e para o <time>. */
  data: string;
  /** Link opcional: post no Instagram, matéria, formulário. */
  href?: string;
}

/* [CONTEÚDO PENDENTE] Nenhuma atualização real ainda. Os itens abaixo são
   exemplos do formato e devem ser substituídos — ou removidos, deixando o
   array vazio, caso a seção não vá ao ar na primeira versão. */
export const atualizacoes: Atualizacao[] = [
  {
    chave: "exemplo-1",
    categoria: "Moradia Digna",
    titulo: "[CONTEÚDO PENDENTE] Título da atualização",
    resumo:
      "Duas ou três linhas sobre o que aconteceu. Exemplo: mutirão concluído na casa da família X, com tantos voluntários, e o que foi feito.",
    data: "[PENDENTE]",
  },
  {
    chave: "exemplo-2",
    categoria: "Capoeira",
    titulo: "[CONTEÚDO PENDENTE] Título da atualização",
    resumo:
      "Exemplo: turma nova aberta, quantas vagas, onde e quando acontecem as aulas.",
    data: "[PENDENTE]",
  },
  {
    chave: "exemplo-3",
    categoria: "Instituto",
    titulo: "[CONTEÚDO PENDENTE] Título da atualização",
    resumo:
      "Exemplo: parceria firmada com uma empresa fornecedora, e o que ela viabiliza.",
    data: "[PENDENTE]",
  },
];

/* -----------------------------------------------------------------------------
   OS PROJETOS
   ----------------------------------------------------------------------------- */

export const projetos: Projeto[] = [
  {
    chave: "moradia-digna",
    nome: "Moradia Digna",
    resumo:
      "Recupera casas que deixaram de ser seguras para quem mora nelas.",
    ficha: [
      { rotulo: "Onde", valor: "Florianópolis e Grande Florianópolis" },
      { rotulo: "Desde", valor: "[PENDENTE]" },
      { rotulo: "Atende", valor: "Famílias em situação de vulnerabilidade" },
      { rotulo: "Como entra na fila", valor: "Indicação + visita técnica" },
    ],
    sobre: [
      "O Moradia Digna é o projeto mais antigo do Instituto e o que mais se parece com o trabalho do grupo: é obra. A diferença é o critério de entrada — não é quem pode pagar, é quem corre risco dentro da própria casa.",
      "Cada casa recebe levantamento, projeto de intervenção assinado e execução acompanhada por responsável técnico. A prioridade segue sempre a mesma ordem: estrutura, cobertura, instalação elétrica, água e esgoto, e só então acabamento.",
      "[CONTEÚDO PENDENTE] Histórico do projeto, equipe envolvida e critérios completos de elegibilidade.",
    ],
    destaque: {
      nome: "Dona Tereza",
      papel: "Primeira família atendida",
      texto:
        "[CONTEÚDO PENDENTE] A história da dona Tereza: como a casa chegou até o projeto, o que foi encontrado na visita técnica, o que foi feito e como ela vive hoje. Este é o relato mais importante da página — é ele que mostra o que o Instituto faz, com nome e rosto, em vez de explicar em tese.",
      midia: {
        tipo: "foto",
        src: "/img/instituto/tereza-retrato.webp",
        alt: "Dona Tereza de pé na porta de casa, olhando para a câmera",
        descricao: "Dona Tereza na porta de casa",
      },
    },
    registro: [
      {
        tipo: "foto",
        destaque: true,
        src: "/img/instituto/tereza-diagnostico.webp",
        alt: "Seis registros do interior da casa: piso apodrecido, armário deteriorado, infiltração e umidade",
        descricao:
          "O que a visita técnica encontrou: piso apodrecido, armário deteriorado, umidade e improviso elétrico.",
      },
      {
        tipo: "foto",
        src: "/img/instituto/tereza-equipe.webp",
        alt: "Equipe do Instituto Tridium reunida com a dona Tereza na porta de casa",
        descricao: "A equipe na casa da dona Tereza, no dia da visita.",
        posicao: "center 38%",
      },
      {
        tipo: "foto",
        src: "/img/instituto/tereza-visita.webp",
        alt: "Dona Tereza conversa com um engenheiro da Tridium na porta de casa",
        descricao: "A conversa que abre todo atendimento: ouvir quem mora ali.",
        posicao: "center 45%",
      },
      {
        tipo: "video",
        pendente: true,
        descricao:
          "Depoimento da dona Tereza falando da casa. Vídeo curto, de celular mesmo, com áudio limpo.",
      },
      {
        tipo: "foto",
        pendente: true,
        descricao:
          "A casa depois da reforma — de preferência no mesmo enquadramento das fotos do diagnóstico.",
      },
      {
        tipo: "foto",
        pendente: true,
        descricao: "Entrega da chave à família, na porta da casa pronta.",
      },
    ],
    numeros: [
      { valor: "[N]", rotulo: "casas reformadas" },
      { valor: "[N]", rotulo: "pessoas atendidas" },
      { valor: "[N]", rotulo: "voluntários mobilizados" },
      { valor: "[N]", rotulo: "famílias na fila" },
    ],
    apoio: [
      {
        titulo: "Doar material",
        texto:
          "Cimento, telha, fiação, tinta. Material doado entra direto na próxima casa da fila.",
        acao: "Quero doar material",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de doar material para o projeto Moradia Digna.",
        pendencia: "Lista do que é mais necessário e onde entregar.",
      },
      {
        titulo: "Doar dinheiro",
        texto:
          "Vira material e mão de obra especializada — a parte que voluntário não consegue fazer.",
        acao: "Quero doar",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de fazer uma doação para o projeto Moradia Digna.",
        pendencia: "Chave Pix, dados bancários e emissão de recibo.",
      },
      {
        titulo: "Ser voluntário na obra",
        texto:
          "Não precisa saber construir. Há frente para quem levanta parede e para quem organiza, cozinha ou transporta.",
        acao: "Quero ser voluntário",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de ser voluntário no projeto Moradia Digna.",
        pendencia: "Calendário dos mutirões e formulário de cadastro.",
      },
      {
        titulo: "Indicar uma família",
        texto:
          "Conhece uma casa em risco? A indicação passa por visita técnica e avaliação social antes de entrar na fila.",
        acao: "Quero indicar",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de indicar uma família para o projeto Moradia Digna.",
        pendencia: "Critérios de elegibilidade e fluxo de triagem.",
      },
    ],
    temJornada: true,
  },

  {
    chave: "capoeira",
    nome: "Capoeira",
    resumo:
      "[CONTEÚDO PENDENTE] Uma linha sobre o que o núcleo de capoeira faz e para quem.",
    ficha: [
      { rotulo: "Onde", valor: "[PENDENTE] endereço ou bairro" },
      { rotulo: "Quando", valor: "[PENDENTE] dias e horários" },
      { rotulo: "Desde", valor: "[PENDENTE]" },
      { rotulo: "Atende", valor: "[PENDENTE] faixa etária e perfil" },
    ],
    sobre: [
      "[CONTEÚDO PENDENTE] O que é o núcleo de capoeira do Instituto: como começou, quem conduz as aulas, quantas crianças e jovens participam e o que o projeto representa para o bairro.",
      "[CONTEÚDO PENDENTE] Como alguém entra: inscrição, idade mínima, se há custo, o que é preciso levar.",
    ],
    registro: [
      {
        tipo: "foto",
        pendente: true,
        destaque: true,
        descricao:
          "Roda de capoeira em andamento, com os alunos. Foto aberta, que mostre o grupo e o espaço.",
      },
      {
        tipo: "video",
        pendente: true,
        descricao:
          "Trecho de uma aula ou de uma roda. Vídeo curto — capoeira é movimento e som, foto sozinha não dá conta.",
      },
      {
        tipo: "foto",
        pendente: true,
        descricao: "Retrato de um aluno ou do mestre que conduz as aulas.",
      },
    ],
    numeros: [
      { valor: "[N]", rotulo: "alunos ativos" },
      { valor: "[N]", rotulo: "aulas por semana" },
      { valor: "[N]", rotulo: "anos de projeto" },
    ],
    apoio: [
      {
        titulo: "Apoiar o núcleo",
        texto:
          "[CONTEÚDO PENDENTE] O que o projeto precisa: instrumentos, uniformes, espaço, transporte.",
        acao: "Quero apoiar",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de apoiar o projeto de capoeira do Instituto.",
        pendencia: "Lista de necessidades do núcleo.",
      },
      {
        titulo: "Matricular",
        texto:
          "[CONTEÚDO PENDENTE] Como inscrever uma criança ou jovem nas aulas.",
        acao: "Quero matricular",
        mensagem:
          "Olá! Vim pelo site do Grupo Tridium e gostaria de saber como matricular nas aulas de capoeira do Instituto.",
        pendencia: "Processo de matrícula, vagas e horários.",
      },
    ],
  },
];

/* -----------------------------------------------------------------------------
   PÁGINA
   ----------------------------------------------------------------------------- */

export const instituto = {
  nome: "Instituto Tridium",
  nomeCurto: "Instituto",
  tipo: "Braço social do Grupo Tridium",
  missao:
    "Ninguém transforma a própria vida sozinho — e quase sempre falta estrutura, não vontade.",

  hero: {
    eyebrow: "Projetos sociais · Florianópolis",
    titulo: ["Transformar", "vidas também", "é construir."],
    lead: "O Instituto Tridium leva projetos sociais a quem não tem como contratá-los: moradia digna, capoeira, esporte, lazer, cultura e formação técnica em ofícios da construção. É a competência do grupo aplicada fora da obra.",
    /* [FOTO PENDENTE] imagem provisória de banco de imagens */
    imagem: "/img/instituto/hero.webp",
    imagemAlt: "Moradora e voluntário levantando a estrutura do telhado",
    imagemProvisoria: true,
  },

  /* Abre a seção de atualizações. */
  atualizacoesIntro: {
    titulo: "O Instituto não para entre uma obra e outra.",
    texto:
      "Mutirão concluído, turma nova, família atendida, parceria fechada. O que acontece no dia a dia dos projetos aparece aqui.",
  },

  /* Abre a lista de projetos. */
  projetosIntro: {
    rotulo: "Os projetos",
    titulo: "Cada frente tem nome, rosto e endereço.",
    texto:
      "O Instituto não é uma ideia guarda-chuva. É um conjunto de projetos que acontecem em lugares concretos, com pessoas concretas. Abaixo, cada um deles — o que é, quem atende e como você pode entrar.",
  },

  /* --- Jornada em capítulos (usada dentro do Moradia Digna) -------------
     A ordem é narrativa e deliberada: o problema, o método, o resultado.
     [CONTEÚDO PENDENTE] textos e fotos reais a serem enviados. */
  jornada: {
    rotulo: "Como funciona",
    titulo: "De uma casa a um lar.",
    texto: "Quatro etapas, na ordem em que acontecem. Nenhuma pode ser pulada.",
  },

  capitulos: [
    {
      chave: "diagnostico",
      indice: "Capítulo um",
      titulo: "O que a gente encontra",
      texto:
        "Infiltração que virou mofo, telhado que cede, instalação elétrica improvisada, piso de chão batido. Problemas que começam construtivos e terminam no posto de saúde.",
      nota: "[CONTEÚDO PENDENTE] substituir por relato real de diagnóstico.",
      imagem: "/img/instituto/tereza-diagnostico.webp",
      imagemAlt:
        "Seis registros do interior da casa da dona Tereza mostrando piso apodrecido, umidade e improviso",
      imagemProvisoria: false,
    },
    {
      chave: "projeto",
      indice: "Capítulo dois",
      titulo: "Projeto, não remendo",
      texto:
        "Cada casa recebe um levantamento e um projeto de intervenção assinado. A prioridade é sempre a mesma ordem: estrutura, cobertura, instalação elétrica, água e esgoto, e só então acabamento.",
      nota: "[CONTEÚDO PENDENTE] detalhar critério técnico de priorização.",
      imagem: "/img/instituto/capitulo-02.webp",
      imagemAlt: "[FOTO PENDENTE] Registro da etapa de projeto",
      imagemProvisoria: true,
    },
    {
      chave: "mutirao",
      indice: "Capítulo três",
      titulo: "A obra acontece junto",
      texto:
        "Equipe técnica da Tridium, voluntários e a própria família trabalhando na mesma obra. Quem mora participa das decisões — é a casa dela, não um presente.",
      nota: "[CONTEÚDO PENDENTE] descrever a dinâmica real do mutirão.",
      imagem: "/img/instituto/capitulo-03.webp",
      imagemAlt: "[FOTO PENDENTE] Registro do mutirão de obra",
      imagemProvisoria: true,
    },
    {
      chave: "entrega",
      indice: "Capítulo quatro",
      titulo: "A chave devolvida",
      texto:
        "A entrega é o fim da obra e o começo do acompanhamento. Voltamos depois para verificar se o que foi feito se manteve — reforma social que não é revisitada costuma virar problema de novo.",
      nota: "[CONTEÚDO PENDENTE] incluir história real de família atendida.",
      imagem: "/img/instituto/hero.webp",
      imagemAlt: "[FOTO PENDENTE] Registro da entrega da casa reformada",
      imagemProvisoria: true,
    },
  ],

  /* --- Transparência ---------------------------------------------------- */
  transparencia: {
    titulo: "Prestação de contas",
    texto:
      "[CONTEÚDO PENDENTE] Espaço reservado para relatório de transparência, CNPJ da instituição, destinação de recursos e prestação de contas por projeto.",
  },

  cta: {
    titulo: "Nem todo apoio é dinheiro.",
    texto:
      "Tempo, material, equipamento, um espaço emprestado, uma indicação. Fale com a gente e descubra qual forma de ajudar cabe no que você tem.",
    botao: "Falar no WhatsApp",
  },
} as const;
