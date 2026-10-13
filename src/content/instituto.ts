/* =============================================================================
   INSTITUTO TRIDIUM — conteúdo
   -----------------------------------------------------------------------------
   ⚠ FRENTE EM ESTRUTURAÇÃO.
   Todo o conteúdo é PROVISÓRIO e existe para sustentar o layout.

   O nome está isolado nas constantes abaixo: `nome` é a forma completa, usada
   em títulos, SEO e dados estruturados; `nomeCurto` é a forma de prosa corrida
   e do menu. Trocar aqui propaga para o site inteiro (a rota /instituto e a
   pasta public/img/instituto também precisariam ser renomeadas).

   Marcador usado: [CONTEÚDO PENDENTE]
   ============================================================================= */

export const instituto = {
  nome: "Instituto Tridium",
  nomeCurto: "Instituto",
  tipo: "Projeto social do Grupo Tridium",
  missao: "Toda família merece uma casa que não ameace quem mora nela.",

  hero: {
    eyebrow: "Projeto social · Florianópolis",
    titulo: ["Uma casa", "não deveria", "ser um risco."],
    lead: "O Instituto Tridium leva projeto técnico, material e mão de obra a moradias que perderam a segurança. É a engenharia do grupo aplicada onde não existe orçamento para contratá-la.",
    /* [FOTO PENDENTE] imagem provisória de banco de imagens */
    imagem: "/img/instituto/hero.webp",
    imagemAlt: "Moradora e voluntário levantando a estrutura do telhado",
    imagemProvisoria: true,
  },

  /* --- Jornada em capítulos (scrollytelling) ----------------------------
     A ordem é narrativa e deliberada: o problema, o método, o resultado.
     [CONTEÚDO PENDENTE] textos e fotos reais a serem enviados. */
  capitulos: [
    {
      chave: "diagnostico",
      indice: "Capítulo um",
      titulo: "O que a gente encontra",
      texto:
        "Infiltração que virou mofo, telhado que cede, instalação elétrica improvisada, piso de chão batido. Problemas que começam construtivos e terminam no posto de saúde.",
      nota: "[CONTEÚDO PENDENTE] substituir por relato real de diagnóstico.",
      imagem: "/img/instituto/capitulo-01.webp",
      imagemAlt: "Casa popular em obra, com moradores pintando a fachada",
      imagemProvisoria: true,
    },
    {
      chave: "projeto",
      indice: "Capítulo dois",
      titulo: "Projeto, não remendo",
      texto:
        "Cada casa recebe um levantamento e um projeto de intervenção assinado. A prioridade é sempre a mesma ordem: estrutura, cobertura, instalação elétrica, água e esgoto, e só então acabamento.",
      nota: "[CONTEÚDO PENDENTE] detalhar critério técnico de priorização.",
      imagem: "/img/instituto/capitulo-02.webp",
      imagemAlt: "Equipe executando a cobertura de uma casa popular",
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
      imagemAlt: "Moradora e voluntário trabalhando juntos na obra da casa",
      imagemProvisoria: true,
    },
    {
      chave: "entrega",
      indice: "Capítulo quatro",
      titulo: "A chave devolvida",
      texto:
        "A entrega é o fim da obra e o começo do acompanhamento. Voltamos depois para verificar se o que foi feito se manteve — reforma social que não é revisitada costuma virar problema de novo.",
      nota: "[CONTEÚDO PENDENTE] incluir história real de família atendida.",
      imagem: null,
      descricaoFoto:
        "Entrega das chaves à família, na porta da casa pronta. Foto de pessoas, não de fachada.",
    },
  ],

  /* --- Números de impacto ---
     [CONTEÚDO PENDENTE] todos os números precisam ser fornecidos e auditados
     antes de ir ao ar. Nunca publicar número estimado em projeto social. */
  impacto: [
    { valor: "[N]", rotulo: "casas reformadas" },
    { valor: "[N]", rotulo: "pessoas atendidas" },
    { valor: "[N]", rotulo: "voluntários mobilizados" },
    { valor: "[N]", rotulo: "empresas parceiras" },
  ],

  /* --- Como ajudar ------------------------------------------------------ */
  comoAjudar: [
    {
      chave: "doar",
      titulo: "Doar",
      resumo: "Dinheiro ou material de construção.",
      texto:
        "Doação financeira vira material e mão de obra especializada. Doação de material entra direto na próxima obra da fila.",
      acao: "Quero doar",
      detalhe: "[CONTEÚDO PENDENTE] dados bancários, chave Pix e recibo de doação.",
    },
    {
      chave: "voluntario",
      titulo: "Ser voluntário",
      resumo: "Na obra ou fora dela.",
      texto:
        "Há frente para quem sabe levantar parede e para quem sabe organizar planilha, fotografar, cozinhar ou dirigir. Não é preciso experiência em construção.",
      acao: "Quero ser voluntário",
      detalhe: "[CONTEÚDO PENDENTE] formulário de cadastro e calendário de mutirões.",
    },
    {
      chave: "parceiro",
      titulo: "Ser parceiro",
      resumo: "Empresas, fornecedores e instituições.",
      texto:
        "Fornecimento de material, cessão de equipamento, transporte ou patrocínio de uma casa inteira. A contrapartida é definida caso a caso.",
      acao: "Quero ser parceiro",
      detalhe: "[CONTEÚDO PENDENTE] plano de parceria e contrapartidas.",
    },
    {
      chave: "indicar",
      titulo: "Indicar uma família",
      resumo: "Conhece uma casa que precisa?",
      texto:
        "As indicações passam por visita técnica e avaliação social antes de entrar na fila. O critério é risco à moradia, não urgência de quem indica.",
      acao: "Quero indicar",
      detalhe: "[CONTEÚDO PENDENTE] critérios de elegibilidade e fluxo de triagem.",
    },
  ],

  /* --- Transparência ---------------------------------------------------- */
  transparencia: {
    titulo: "Prestação de contas",
    texto:
      "[CONTEÚDO PENDENTE] Espaço reservado para relatório de transparência, CNPJ da instituição, destinação de recursos e prestação de contas por obra.",
  },

  cta: {
    titulo: "Ajude a próxima casa a sair do papel.",
    texto:
      "Existe uma fila e ela não anda sozinha. Fale com a gente e descubra qual é a forma de ajudar que cabe no seu tempo.",
    botao: "Falar no WhatsApp",
  },
} as const;
