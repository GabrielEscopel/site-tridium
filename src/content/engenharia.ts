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
    /* [FOTO PENDENTE] substituir por foto real de obra própria da Tridium.
       Imagem atual é provisória, de banco de imagens. */
    imagem: "/img/engenharia/hero.webp",
    imagemAlt:
      "Estrutura de concreto aparente em obra, com escadaria e vãos amplos",
    imagemProvisoria: true,
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
     [FOTO PENDENTE] Nenhum case tem registro fotográfico real ainda. Em vez de
     ilustrar com banco de imagens (que passaria por foto do projeto na hora de
     publicar), cada card mostra um painel de foto pendente com a descrição do
     que precisa ser produzido. Basta preencher `imagem` para o painel sumir. */
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
      imagem: null,
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
      imagem: null,
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
      imagem: null,
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
      imagem: null,
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
    { valor: "[N] anos", rotulo: "de atuação em Florianópolis" },
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
