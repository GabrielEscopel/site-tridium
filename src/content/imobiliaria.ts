/* =============================================================================
   TRIDIUM IMOBILIÁRIA — conteúdo
   -----------------------------------------------------------------------------
   ⚠ FRENTE EM ESTRUTURAÇÃO.
   Praticamente todo o conteúdo desta página é PROVISÓRIO e existe apenas para
   sustentar o layout. O cliente ainda enviará: nome oficial da imobiliária,
   CRECI, textos, carteira real de imóveis e fotografia própria.

   Marcadores usados: [CONTEÚDO IMOBILIÁRIA PENDENTE] e [FOTO PENDENTE].
   ============================================================================= */

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

  /* --- Empreendimentos / carteira ---------------------------------------
     [CONTEÚDO IMOBILIÁRIA PENDENTE]
     Estes registros são fictícios e servem só de esqueleto de layout.
     Substituir integralmente pela carteira real (ou plugar num CRM/XML). */
  empreendimentos: [
    {
      chave: "placeholder-01",
      nome: "[CONTEÚDO IMOBILIÁRIA PENDENTE]",
      tipo: "Apartamento",
      status: "Em obra",
      bairro: "[BAIRRO]",
      cidade: "Florianópolis",
      dormitorios: "—",
      vagas: "—",
      area: "—",
      preco: "Sob consulta",
      resumo:
        "Espaço reservado para um empreendimento da carteira. Texto e ficha técnica serão enviados pelo cliente.",
      imagem: "/img/imobiliaria/imovel-01.webp",
      imagemAlt: "[FOTO PENDENTE] Imagem provisória de empreendimento",
      imagemProvisoria: true,
      destaque: true,
    },
    {
      chave: "placeholder-02",
      nome: "[CONTEÚDO IMOBILIÁRIA PENDENTE]",
      tipo: "Casa",
      status: "Pronto para morar",
      bairro: "[BAIRRO]",
      cidade: "Florianópolis",
      dormitorios: "—",
      vagas: "—",
      area: "—",
      preco: "Sob consulta",
      resumo:
        "Espaço reservado para um imóvel da carteira. Texto e ficha técnica serão enviados pelo cliente.",
      imagem: "/img/imobiliaria/imovel-02.webp",
      imagemAlt: "[FOTO PENDENTE] Imagem provisória de imóvel",
      imagemProvisoria: true,
      destaque: false,
    },
    {
      chave: "placeholder-03",
      nome: "[CONTEÚDO IMOBILIÁRIA PENDENTE]",
      tipo: "Cobertura",
      status: "Lançamento",
      bairro: "[BAIRRO]",
      cidade: "Florianópolis",
      dormitorios: "—",
      vagas: "—",
      area: "—",
      preco: "Sob consulta",
      resumo:
        "Espaço reservado para um lançamento. Texto e ficha técnica serão enviados pelo cliente.",
      imagem: "/img/imobiliaria/imovel-03.webp",
      imagemAlt: "[FOTO PENDENTE] Imagem provisória de lançamento",
      imagemProvisoria: true,
      destaque: false,
    },
    {
      chave: "placeholder-04",
      nome: "[CONTEÚDO IMOBILIÁRIA PENDENTE]",
      tipo: "Terreno",
      status: "Disponível",
      bairro: "[BAIRRO]",
      cidade: "Florianópolis",
      dormitorios: "—",
      vagas: "—",
      area: "—",
      preco: "Sob consulta",
      resumo:
        "Espaço reservado para um terreno da carteira. Texto e ficha técnica serão enviados pelo cliente.",
      imagem: "/img/imobiliaria/imovel-04.webp",
      imagemAlt: "[FOTO PENDENTE] Imagem provisória de terreno",
      imagemProvisoria: true,
      destaque: false,
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
