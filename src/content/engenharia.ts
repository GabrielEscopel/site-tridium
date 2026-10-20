/* =============================================================================
   TRIDIUM ENGENHARIA — conteúdo
   -----------------------------------------------------------------------------
   Frente com dados oficiais já confirmados pelo cliente.
   Pendências restantes: fotos reais dos cases e números de obra.
   ============================================================================= */

export const engenharia = {
  marca: "Tridium Engenharia",
  posicionamento: "Engenharia, construção, arquitetura e reforma.",

  hero: {
    eyebrow: "Florianópolis · SC",
    titulo: ["Engenharia", "que assume", "a obra inteira."],
    lead: "Projeto, execução e reforma sob uma mesma responsabilidade técnica. Sem repasse de culpa entre projetista e construtor — a Tridium responde pelas duas pontas.",
    /* A capa de tela inteira saiu: quem abre a página vê obra no carrossel,
       não uma foto de prancheta. `/img/engenharia/hero.webp` continua em uso
       como imagem de compartilhamento (site.ts e lib/seo.ts). */
  },

  /* --- Serviços --------------------------------------------------------- */
  servicos: [
    {
      chave: "construcao",
      titulo: "Construção",
      resumo: "Obra nova, do gabarito à entrega.",
      descricao:
        "Execução completa de residências, edifícios e espaços comerciais. Cronograma físico-financeiro fechado antes da primeira concretagem, com medição por etapa.",
      itens: [
        "Residencial unifamiliar e multifamiliar",
        "Comercial e corporativo",
        "Gerenciamento e fiscalização de obra",
        "Regularização e documentação",
      ],
    },
    {
      chave: "reforma",
      titulo: "Reforma",
      resumo: "Intervenção em imóvel ocupado ou vazio.",
      descricao:
        "Reformas estruturais e de acabamento, com avaliação prévia do que pode ser mantido. O diagnóstico vem antes do orçamento — não o contrário.",
      itens: [
        "Reforma estrutural e reforço",
        "Retrofit de fachada e cobertura",
        "Ampliação e mudança de layout",
        "Laudo técnico e patologia construtiva",
      ],
    },
    {
      chave: "arquitetura",
      titulo: "Arquitetura & Projetos",
      resumo: "Projeto executivo pensado para ser construído.",
      descricao:
        "Arquitetura, estrutural, elétrico, hidrossanitário e detalhamento executivo. Projetos compatibilizados entre si antes de ir para a obra.",
      itens: [
        "Projeto arquitetônico e executivo",
        "Projetos complementares compatibilizados",
        "Aprovação em prefeitura e corpo de bombeiros",
        "Interiores e detalhamento de marcenaria",
      ],
    },
    {
      chave: "especiais",
      titulo: "Projetos Especiais",
      resumo: "O que não cabe no catálogo.",
      descricao:
        "Estruturas que exigem cálculo e execução fora do padrão: pistas de skate, marquises de grande vão, playgrounds, totens e mobiliário urbano.",
      itens: [
        "Pistas de skate e equipamento esportivo",
        "Marquises e coberturas metálicas",
        "Playgrounds e brinquedotecas",
        "Totens, fachadas e comunicação visual",
      ],
    },
  ],

  /* --- Portfólio --------------------------------------------------------
     [FOTO PENDENTE] Nenhum case tem registro fotográfico real da Tridium.

     As imagens abaixo são de BANCO e não mostram as obras da Tridium: são
     um skatepark, uma treliça metálica, um playground e um totem quaisquer,
     escolhidos só porque o tipo de estrutura bate. Entraram a pedido do
     cliente, para o carrossel ficar navegável antes das fotos reais.

     Por isso `imagemProvisoria: true` em todas: o selo aparece na tela em
     cima da foto, no carrossel e na galeria. É o que impede que uma foto
     genérica passe despercebida na revisão e vá ao ar como se fosse o
     projeto. Ao trocar pela foto real, apague a linha do selo.

     `descricaoFoto` continua valendo: é a pauta do que precisa ser
     fotografado em cada obra. */
  cases: [
    {
      chave: "rhinno",
      nome: "Rhinno Skatepark",
      categoria: "Projeto especial",
      tipo: "Pista de skate",
      local: "Florianópolis, SC",
      ano: "[ANO PENDENTE]",
      resumo:
        "Pista de skate em concreto moldado in loco, com transições contínuas e raios calculados para uso profissional.",
      descricao:
        "Estrutura que não aceita junta aparente nem tolerância de acabamento comum: cada transição foi conferida em gabarito antes da concretagem. O piso é a peça técnica principal do projeto.",
      escopo: ["Projeto executivo", "Cálculo estrutural", "Execução", "Acabamento"],
      imagem: "/img/engenharia/obra-rhinno.webp",
      imagemAlt: "Bowl de concreto de uma pista de skate, com ponte ao fundo",
      imagemProvisoria: true,
      /* A foto é vertical e o bowl está no terço de baixo: centralizada, o
         slide mostraria só céu. */
      imagemPosicao: "center 72%",
      descricaoFoto:
        "Pista concluída em uso: transições, bowl e corrimãos. Horizontal, luz do fim da tarde.",
    },
    {
      chave: "marquise",
      nome: "Marquise Floripa",
      categoria: "Estrutura metálica",
      tipo: "Coberturas e marquises",
      local: "Florianópolis, SC",
      ano: "[ANO PENDENTE]",
      resumo:
        "Coberturas e marquises de grande vão em estrutura metálica, dimensionadas para o vento de orla.",
      descricao:
        "Projetos de cobertura em que o vão livre é o requisito e a carga de vento litorânea é o limite. Cálculo, fabricação e montagem acompanhados pela mesma equipe.",
      escopo: ["Cálculo estrutural", "Fabricação", "Montagem", "Tratamento anticorrosivo"],
      imagem: "/img/engenharia/obra-marquise.webp",
      imagemAlt:
        "Treliça metálica vista de baixo contra o céu, no fim da tarde",
      imagemProvisoria: true,
      imagemPosicao: "center 62%",
      descricaoFoto:
        "Marquise instalada vista de baixo, mostrando o vão livre e a estrutura metálica.",
    },
    {
      chave: "brincademia",
      nome: "Brincademia",
      categoria: "Projeto especial",
      tipo: "Playground e brinquedoteca",
      local: "Florianópolis, SC",
      ano: "[ANO PENDENTE]",
      resumo:
        "Playground e brinquedoteca executados sob norma de segurança infantil, do piso amortecedor à altura de queda.",
      descricao:
        "Espaço em que a norma de segurança define a geometria antes da estética. Materiais, quinas, alturas de queda e superfície de impacto verificados item a item.",
      escopo: ["Projeto", "Adequação normativa", "Execução", "Mobiliário"],
      imagem: "/img/engenharia/obra-brincademia.webp",
      imagemAlt:
        "Playground com escorregador e painéis coloridos sobre piso amortecedor",
      imagemProvisoria: true,
      /* Única das quatro na horizontal: o centro já é o enquadramento certo. */
      imagemPosicao: "center",
      descricaoFoto:
        "Playground montado com crianças em uso, e um detalhe do piso amortecedor.",
    },
    {
      chave: "totens",
      nome: "Totens",
      categoria: "Mobiliário urbano",
      tipo: "Comunicação visual estrutural",
      local: "Florianópolis, SC",
      ano: "[ANO PENDENTE]",
      resumo:
        "Totens e elementos de comunicação visual com fundação, estrutura e acabamento resolvidos no mesmo projeto.",
      descricao:
        "Peça que parece design gráfico e é, na prática, estrutura: fundação dimensionada, perfil calculado e acabamento que precisa durar ao tempo.",
      escopo: ["Projeto", "Fundação", "Fabricação", "Instalação"],
      imagem: "/img/engenharia/obra-totens.webp",
      imagemAlt: "Totem de sinalização instalado em caminho de parque",
      imagemProvisoria: true,
      /* Enquadra o topo da peça: no centro, a placa é tomada por texto em
         tailandês, que numa página brasileira salta aos olhos. */
      imagemPosicao: "center 6%",
      descricaoFoto:
        "Totem instalado no local, de corpo inteiro, com a fundação e o entorno visíveis.",
    },
  ],

  /* --- Processo ---------------------------------------------------------
     Aqui a numeração é legítima: é uma sequência real e a ordem importa. */
  processo: [
    {
      passo: "01",
      titulo: "Conversa e visita",
      texto:
        "Entendemos o que você quer construir e vamos até o local. Sem custo e sem compromisso.",
    },
    {
      passo: "02",
      titulo: "Diagnóstico técnico",
      texto:
        "Levantamento do que existe, do que pode ser aproveitado e do que precisa ser refeito. É o que impede surpresa de orçamento no meio da obra.",
    },
    {
      passo: "03",
      titulo: "Projeto e orçamento",
      texto:
        "Projeto compatibilizado e orçamento aberto por etapa, com prazo e escopo definidos por escrito.",
    },
    {
      passo: "04",
      titulo: "Execução acompanhada",
      texto:
        "Obra com responsável técnico presente e medição por etapa concluída. Você acompanha o avanço, não só o resultado.",
    },
    {
      passo: "05",
      titulo: "Entrega e garantia",
      texto:
        "Vistoria final, manual do proprietário e garantia formal sobre os serviços executados.",
    },
  ],

  /* --- Provas / números ------------------------------------------------- */
  /* [CONTEÚDO PENDENTE] números reais a confirmar com o cliente */
  numeros: [
    { valor: "10 anos", rotulo: "de atuação em Florianópolis" },
    { valor: "[N]", rotulo: "obras entregues" },
    { valor: "[N] m²", rotulo: "construídos e reformados" },
    { valor: "[N]", rotulo: "projetos especiais executados" },
  ],

  cta: {
    titulo: "Faça seu orçamento sem compromisso.",
    texto:
      "Conte o que você precisa construir ou reformar. Respondemos com um diagnóstico honesto — inclusive quando a resposta é que a obra não vale a pena agora.",
    botao: "Falar no WhatsApp",
  },
} as const;
