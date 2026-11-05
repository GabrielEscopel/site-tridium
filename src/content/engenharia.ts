/* =============================================================================
   TRIDIUM ENGENHARIA — conteúdo
   -----------------------------------------------------------------------------
   Frente com dados oficiais já confirmados pelo cliente.
   Pendências restantes: fotos reais dos cases e números de obra.
   ============================================================================= */

import type { CaseItem } from "@/components/GaleriaCases";

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
        /* Entrou quando a demolição de Santo Antônio virou case: o serviço
           aparecia no portfólio e não na lista, e quem procurasse por ele
           não achava. */
        "Demolição e remoção de entulho",
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
    { valor: "+2.000", rotulo: "obras entregues" },
    { valor: "+100.000 m²", rotulo: "construídos e reformados" },
    { valor: "[N]", rotulo: "projetos especiais executados" },
  ],

  cta: {
    titulo: "Faça seu orçamento sem compromisso.",
    texto:
      "Conte o que você precisa construir ou reformar. Respondemos com um diagnóstico honesto — inclusive quando a resposta é que a obra não vale a pena agora.",
    botao: "Falar no WhatsApp",
  },
} as const;

/* --- Portfólio --------------------------------------------------------
   Cada obra tem as suas fotos, na ordem em que a obra aconteceu. A primeira
   abre o card no portfólio e, quando não há `capa` própria, é também a que
   vai para a capa da página. As demais aparecem pelas setas, dentro do card.
   Três ou quatro funcionam bem; acima disso o contador vira ruído.

   TODAS AS OBRAS AQUI SÃO REAIS, com registro fotográfico da Tridium. Havia
   quatro de demonstração — skatepark, marquise, playground e totens — com
   imagem de banco e o selo de foto provisória; saíram quando as reais
   chegaram, porque passaram a ocupar espaço mostrando o que não é da casa.

   Obra nova entra com foto própria. Enquanto a foto não existir, `fotos: []`
   e `descricaoFoto` com a pauta do que precisa ser fotografado: o card mostra
   um painel dizendo o que falta, em vez de uma imagem emprestada.

   Se alguma precisar mesmo de imagem de banco, `provisoria: true` acende o
   selo por cima — é o que impede uma foto genérica de passar despercebida na
   revisão e ir ao ar como se fosse o projeto.

   O array está fora do objeto `engenharia` de propósito: com `as const`, o
   TypeScript cria um tipo literal por obra e as que não usam todos os campos
   opcionais deixam de encaixar em CaseItem. */
export const cases: CaseItem[] = [
  /* --- Floripa Shopping ---------------------------------------------
     ÚNICA OBRA COM REGISTRO FOTOGRÁFICO REAL ATÉ AQUI, e por isso abre o
     portfólio e a capa da página: é o case que o visitante de Florianópolis
     reconhece de imediato.

     O texto abaixo foi escrito a partir do que as fotos mostram e do que o
     cliente informou (reforma da praça de alimentação e pintura do teto).
     [A CONFIRMAR] com o cliente antes de considerar fechado: o ano, a área
     intervinda, se a obra correu com o shopping em operação (e, nesse caso,
     o regime de trabalho noturno) e o nome do contratante. */
  {
    chave: "floripa-shopping",
    nome: "Floripa Shopping",
    categoria: "Reforma",
    tipo: "Praça de alimentação e cobertura",
    local: "Florianópolis, SC",
    destaque: true,
    resumo:
      "Reforma da praça de alimentação e pintura da estrutura metálica da cobertura, num shopping em funcionamento.",
    descricao:
      "Duas frentes no mesmo contrato: a praça de alimentação, refeita do piso ao forro, e a estrutura metálica do vão livre acima dela, repintada em altura. Obra em prédio que recebe público todo dia — o canteiro convive com a operação.",
    escopo: [
      "Praça de alimentação",
      "Pintura de estrutura metálica",
      "Trabalho em altura",
      "Obra em prédio em operação",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-floripa-shopping.webp",
        alt: "Fachada do Floripa Shopping vista do alto, com os morros ao fundo",
      },
      {
        src: "/img/engenharia/obra-floripa-shopping-02.webp",
        alt: "Praça de alimentação reformada: piso claro, mobiliário novo e iluminação linear no forro",
        posicao: "center 62%",
      },
      {
        src: "/img/engenharia/obra-floripa-shopping-03.webp",
        alt: "Estrutura metálica da cobertura repintada, vista de baixo",
        posicao: "center 40%",
      },
    ],
  },
  /* --- Hotel Porto da Ilha -------------------------------------------
     Segunda obra com registro real. Faz par com o Floripa Shopping: as duas
     aconteceram em prédio que recebe público, e é isso que as duas provam
     junto — a Tridium trabalha sem fechar o lugar.

     O texto saiu do que as fotos mostram: a fachada em recuperação sob lona,
     o operador em rapel tratando fissuras já mapeadas em branco, e a entrada
     pronta. [A CONFIRMAR] com o cliente: o ano, a área de fachada, a altura
     do prédio, se a obra correu com o hotel em operação e se o contrato
     permite nomear o Porto da Ilha. */
  {
    chave: "hotel-porto-da-ilha",
    nome: "Hotel Porto da Ilha",
    categoria: "Reforma",
    tipo: "Recuperação e pintura de fachada",
    local: "Florianópolis, SC",
    destaque: true,
    resumo:
      "Recuperação e pintura da fachada de um hotel no centro, com acesso por corda — sem andaime subindo pela rua.",
    descricao:
      "Fachada de edifício alto: as fissuras são mapeadas uma a uma, tratadas e só então a pintura entra. O acesso é por corda, com o operador descendo em rapel — o que dispensa andaime, libera a calçada e encurta o tempo em que o hóspede convive com a obra.",
    escopo: [
      "Tratamento de fissuras",
      "Pintura de fachada",
      "Acesso por corda",
      "Obra em prédio em operação",
    ],
    /* A capa continua sendo o corpo do edifício: é deitada e aguenta o corte
       panorâmico. A entrada, que abre o card, é mais fechada e na capa
       perderia a marquise. */
    capa: {
      src: "/img/engenharia/obra-porto-da-ilha.webp",
      alt: "Fachada do hotel em recuperação, com lona de proteção sobre parte do edifício",
    },
    fotos: [
      {
        src: "/img/engenharia/obra-porto-da-ilha-03.webp",
        alt: "Entrada do Hotel Porto da Ilha, com a marquise e a sinalização",
      },
      {
        src: "/img/engenharia/obra-porto-da-ilha.webp",
        alt: "Fachada do hotel em recuperação, com lona de proteção sobre parte do edifício",
      },
      {
        src: "/img/engenharia/obra-porto-da-ilha-02.webp",
        alt: "Operador em rapel na fachada, tratando as fissuras já mapeadas em branco",
      },
    ],
  },
  /* --- Demolição em Santo Antônio ------------------------------------
     Terceira obra com registro real, e a que mostra o serviço menos óbvio do
     portfólio: derrubar sem atingir quem está ao lado.

     ORDEM DAS FOTOS: o cliente marcou a foto final como a do carrossel, e ela
     é mesmo a melhor capa — mostra o terreno limpo com as divisas de pé. Como
     a foto 1 abre também o card, o card fica em ordem editorial (resultado,
     depois o processo) e não cronológica. Para ficar cronológico, a capa teria
     de ser a do começo. Os textos alternativos dizem a etapa de cada uma.

     [A CONFIRMAR] com o cliente: o ano, a área do terreno, o prazo, se é
     Santo Antônio de Lisboa e o destino do entulho — demolição tem exigência
     de descarte, e dizer para onde foi o material é diferencial de verdade. */
  {
    chave: "demolicao-santo-antonio",
    nome: "Demolição em Santo Antônio",
    categoria: "Demolição",
    tipo: "Três casas em lote urbano",
    local: "Santo Antônio, Florianópolis, SC",
    destaque: true,
    resumo:
      "Três casas derrubadas num lote cercado de vizinhos — com as construções ao lado em pé e a rua funcionando.",
    descricao:
      "Numa demolição urbana o que define a obra não é o que cai: é o que precisa continuar em pé. Aqui havia casas ocupadas encostadas nas duas divisas e uma via movimentada à frente. A cobertura sai primeiro, depois a estrutura, e a máquina trabalha de dentro para fora, puxando o material para o centro do terreno.",
    escopo: [
      "Demolição mecanizada",
      "Remoção seletiva de cobertura",
      "Preservação das divisas",
      "Remoção de entulho",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-demolicao-santo-antonio.webp",
        alt: "Terreno limpo ao fim da demolição, com a escavadeira removendo o entulho e os muros dos vizinhos intactos",
      },
      {
        src: "/img/engenharia/obra-demolicao-santo-antonio-02.webp",
        alt: "Começo da demolição: as coberturas sendo retiradas, com a baía ao fundo",
      },
      {
        src: "/img/engenharia/obra-demolicao-santo-antonio-03.webp",
        alt: "Demolição em andamento, entre as casas vizinhas que permanecem de pé",
      },
    ],
  },
  /* --- Escritório Tridium --------------------------------------------
     A única obra em que a Tridium foi a própria cliente — e o endereço que
     está no rodapé do site. Quem quiser conferir o acabamento vai até lá.

     Quatro fotos: é o case que mais ganha com a sequência, porque o assunto
     aqui é justamente o detalhe.

     [A CONFIRMAR] com o cliente: o ano, a área e se a marcenaria foi
     executada pela equipe ou por terceiro — o texto diz "sob medida", que
     vale nos dois casos, mas se foi pela equipe dá para dizer melhor. */
  {
    chave: "escritorio-tridium",
    nome: "Escritório Tridium",
    categoria: "Obra própria",
    tipo: "Projeto, execução e interiores",
    local: "Agronômica, Florianópolis, SC",
    destaque: true,
    resumo:
      "A sede da Tridium, construída pela Tridium: projeto, obra e acabamento pela mesma equipe que atende o cliente.",
    descricao:
      "Num escritório próprio não há cliente para negociar o acabamento para baixo — o que fica de pé é o padrão que a empresa escolheu para si. Fachada em tijolo, marcenaria sob medida com iluminação embutida, escada caracol e sala de reunião resolvidas no mesmo projeto. É também o endereço da Tridium: dá para ir ver de perto.",
    escopo: [
      "Projeto arquitetônico",
      "Execução",
      "Marcenaria sob medida",
      "Interiores e detalhamento",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-escritorio.webp",
        alt: "Fachada do escritório da Tridium, em tijolo, com a vitrine e a placa da empresa",
      },
      {
        src: "/img/engenharia/obra-escritorio-02.webp",
        alt: "Recepção: banco curvo em marcenaria sob medida, com iluminação embutida, e prateleira com capacetes da equipe",
      },
      {
        src: "/img/engenharia/obra-escritorio-03.webp",
        alt: "Vista do mezanino sobre a recepção, com a escada caracol ao centro",
      },
      {
        src: "/img/engenharia/obra-escritorio-04.webp",
        alt: "Sala de reunião com parede em verde cimentício e marcenaria em madeira",
      },
    ],
  },

  /* --- Alpinismo civil ----------------------------------------------- */
  {
    chave: "alpinismo-civil",
    nome: "Alpinismo civil",
    categoria: "Trabalho em altura",
    tipo: "Fachada e vidros por corda",
    local: "Florianópolis, SC",
    resumo:
      "Manutenção de fachada em edifício alto pendurado em corda — sem andaime e sem interditar a calçada.",
    descricao:
      "Montar andaime num prédio alto custa semanas, ocupa a calçada e incomoda quem mora ou trabalha ali. O acesso por corda troca isso por operadores descendo em rapel: chega-se ao mesmo ponto no mesmo dia, o térreo continua livre e o prédio não para. A técnica exige certificação específica e plano de resgate — não é escalada, é procedimento.",
    escopo: [
      "Acesso por corda",
      "Fachada e vidros",
      "Trabalho em altura",
      "Obra em prédio em operação",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-alpinismo-civil.webp",
        alt: "Fachada de vidro vista de baixo, com os pontos de ancoragem no topo",
      },
      {
        src: "/img/engenharia/obra-alpinismo-civil-02.webp",
        alt: "Edifício alto com operador descendo pela fachada em corda",
      },
      {
        src: "/img/engenharia/obra-alpinismo-civil-03.webp",
        alt: "Operador em rapel trabalhando na fachada, com a cidade ao fundo",
      },
    ],
  },

  /* --- Gabinete do Prefeito ------------------------------------------
     [A CONFIRMAR] nomear a Prefeitura de Florianópolis como cliente. O
     brasão aparece na foto 3, então ou se confirma ou a foto sai. */
  {
    chave: "gabinete-prefeito",
    nome: "Gabinete do Prefeito",
    categoria: "Reforma",
    tipo: "Gabinete e salas de reunião",
    local: "Centro, Florianópolis, SC",
    destaque: true,
    resumo:
      "Gabinete e salas de reunião da Prefeitura de Florianópolis, de frente para a baía.",
    descricao:
      "Reforma de ambientes de representação, onde o acabamento é parte do trabalho: é ali que a cidade recebe visita. Piso, forro, iluminação e marcenaria resolvidos no mesmo projeto, num prédio público que seguiu funcionando durante a obra.",
    escopo: [
      "Marcenaria sob medida",
      "Piso e forro",
      "Iluminação",
      "Obra em prédio em operação",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-gabinete-prefeito.webp",
        alt: "Sala de reunião envidraçada com vista para a ponte e a baía",
      },
      {
        src: "/img/engenharia/obra-gabinete-prefeito-02.webp",
        alt: "Sala de trabalho com mesa, poltronas e parede de vidro",
      },
      {
        src: "/img/engenharia/obra-gabinete-prefeito-03.webp",
        alt: "Gabinete com painel da Prefeitura de Florianópolis e vista para o mar",
      },
    ],
  },

  /* --- Hotel no Centro ------------------------------------------------
     [A CONFIRMAR] o nome do hotel. Sem ele, o case fica genérico. */
  {
    chave: "hotel-centro-floripa",
    nome: "Hotel no Centro",
    categoria: "Reforma",
    tipo: "Sala de apoio e convivência",
    local: "Centro, Florianópolis, SC",
    resumo:
      "Carpete fora, piso novo e parede ripada numa sala de hotel que não podia ficar fechada.",
    descricao:
      "Reforma de ambiente interno em hotel: remoção do carpete antigo, piso novo, marcenaria ripada e pintura. Obra curta por necessidade — cada dia de sala fechada é receita que não volta —, o que empurra o planejamento para antes e deixa pouca margem para improviso no canteiro.",
    escopo: [
      "Remoção de carpete",
      "Piso novo",
      "Marcenaria ripada",
      "Obra em prédio em operação",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-hotel-centro-floripa.webp",
        alt: "Sala pronta, com piso de madeira e parede ripada",
      },
      {
        src: "/img/engenharia/obra-hotel-centro-floripa-02.webp",
        alt: "A mesma sala durante a obra, com o carpete removido e lona de proteção",
      },
      {
        src: "/img/engenharia/obra-hotel-centro-floripa-03.webp",
        alt: "Vista da sala concluída a partir da entrada",
      },
    ],
  },

  /* --- Centro Pastoral São Paulo --------------------------------------
     A faixa na foto identifica a Igreja São Paulo Apóstolo e o Centro de
     Pastoral. [A CONFIRMAR] o local — não dá para ler nas fotos, e chutar
     cidade num case nomeado seria pior do que deixar pendente. */
  {
    chave: "centro-pastoral-sao-paulo",
    nome: "Centro Pastoral São Paulo",
    categoria: "Construção",
    tipo: "Estrutura de concreto em curva",
    local: "[LOCAL A CONFIRMAR]",
    destaque: true,
    resumo:
      "Estrutura curva de concreto para o centro de pastoral da Igreja São Paulo Apóstolo.",
    descricao:
      "Parede em curva não se resolve com fôrma de prateleira: o escoramento é desenhado para aquele raio, montado em madeira no próprio canteiro e conferido antes da concretagem. É o tipo de obra em que o trabalho que ninguém vê — a fôrma — define o que todo mundo vai ver.",
    escopo: [
      "Projeto executivo",
      "Fôrma e escoramento",
      "Estrutura de concreto",
      "Alvenaria",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-igreja-sao-paulo.webp",
        alt: "Vista geral da obra, com a estrutura curva e o escoramento em madeira",
      },
      {
        src: "/img/engenharia/obra-igreja-sao-paulo-02.webp",
        alt: "Prancha do projeto aberta em frente à obra",
      },
      {
        src: "/img/engenharia/obra-igreja-sao-paulo-03.webp",
        alt: "Escoramento de madeira acompanhando a curva da estrutura",
      },
      {
        src: "/img/engenharia/obra-igreja-sao-paulo-04.webp",
        alt: "Detalhe do escoramento e das fôrmas, visto de perto",
      },
    ],
    /* A foto 1 é em pé e na capa apareceria uma faixa estreita; a 3 é
       deitada e mostra a obra inteira. */
    capa: {
      src: "/img/engenharia/obra-igreja-sao-paulo-03.webp",
      alt: "Escoramento de madeira acompanhando a curva da estrutura",
    },
  },

  /* --- Parede decorativa ---------------------------------------------- */
  {
    chave: "parede-decorativa",
    nome: "Parede decorativa",
    categoria: "Acabamento",
    tipo: "Parede ripada em sala de reunião",
    local: "Florianópolis, SC",
    resumo:
      "Parede ripada preta numa sala de reunião, executada com a empresa trabalhando em volta.",
    descricao:
      "Ripado é acabamento que denuncia erro de base: se a parede não estiver no prumo, o desalinho aparece em cada régua. O preparo leva mais tempo que a instalação — e é ele que decide o resultado.",
    escopo: [
      "Preparo de base",
      "Marcenaria ripada",
      "Pintura",
      "Obra em prédio em operação",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-parede-decorativa.webp",
        alt: "Sala de reunião com mesa longa, antes da parede nova",
      },
      {
        src: "/img/engenharia/obra-parede-decorativa-02.webp",
        alt: "A parede em preparo, com proteção no piso",
      },
      {
        src: "/img/engenharia/obra-parede-decorativa-03.webp",
        alt: "A parede ripada preta concluída",
      },
    ],
  },

  /* --- Reforma em Jurerê ---------------------------------------------- */
  {
    chave: "reforma-jurere",
    nome: "Reforma em Jurerê",
    categoria: "Reforma",
    tipo: "Residencial",
    local: "Jurerê, Florianópolis, SC",
    resumo:
      "Casa de praia reformada por dentro: acabamento claro, marcenaria e iluminação.",
    descricao:
      "Reforma residencial com o repertório que a orla pede — branco, madeira clara, luz indireta. O que não aparece na foto pronta é o que mais importa na praia: maresia come ferragem e esquadria, e a escolha de material tem de contar com isso.",
    escopo: ["Pintura", "Marcenaria", "Iluminação", "Acabamento"],
    fotos: [
      {
        src: "/img/engenharia/obra-reforma-jurere.webp",
        alt: "Sala de estar com parede ripada branca e arandelas",
      },
      {
        src: "/img/engenharia/obra-reforma-jurere-02.webp",
        alt: "Vista da sala e da copa a partir da escada",
      },
      {
        src: "/img/engenharia/obra-reforma-jurere-03.webp",
        alt: "Ambiente durante a obra, com piso protegido e parede em pintura",
      },
    ],
  },

  /* --- Casa no Santa Mônica -------------------------------------------- */
  {
    chave: "casa-santa-monica",
    nome: "Casa no Santa Mônica",
    categoria: "Reforma",
    tipo: "Área externa e piscina",
    local: "Santa Mônica, Florianópolis, SC",
    resumo:
      "Área de lazer refeita: piso antigo demolido, nova pavimentação e o entorno da piscina resolvido.",
    descricao:
      "Obra de área externa começa quebrando. O piso antigo sai, o contrapiso é refeito com a caída certa — em área de piscina, caimento errado é poça parada — e só então entra o revestimento novo. O jardim e a borda entram no mesmo projeto, para não virar remendo depois.",
    escopo: [
      "Demolição de piso",
      "Pavimentação",
      "Área de piscina",
      "Paisagismo",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-casa-santa-monica.webp",
        alt: "Área da piscina durante a obra, com material espalhado no piso",
      },
      {
        src: "/img/engenharia/obra-casa-santa-monica-02.webp",
        alt: "Operador demolindo o piso antigo com rompedor",
      },
      {
        src: "/img/engenharia/obra-casa-santa-monica-03.webp",
        alt: "Área de lazer concluída, com a piscina e o paisagismo",
      },
    ],
  },

  /* --- Sala comercial no Centro ---------------------------------------- */
  {
    chave: "sala-comercial-centro",
    nome: "Sala comercial no Centro",
    categoria: "Reforma",
    tipo: "Laje corporativa",
    local: "Centro, Florianópolis, SC",
    resumo:
      "Uma laje comercial inteira, do vazio à entrega: instalações, forro, pintura e piso.",
    descricao:
      "Reforma de andar corporativo completo. A ordem manda: instalação elétrica e de ar antes do forro, forro antes da pintura, pintura antes do piso. Inverter qualquer uma significa refazer. As fotos acompanham essa sequência.",
    escopo: ["Instalações", "Forro de gesso", "Pintura", "Piso"],
    fotos: [
      {
        src: "/img/engenharia/obra-sala-comercial-centro.webp",
        alt: "Assentamento do piso, com o ambiente já pintado",
      },
      {
        src: "/img/engenharia/obra-sala-comercial-centro-03.webp",
        alt: "Andar aberto durante a obra, com o forro sendo fechado",
      },
      {
        src: "/img/engenharia/obra-sala-comercial-centro-05.webp",
        alt: "Ambiente pronto, branco e com a janela corrida",
      },
      {
        src: "/img/engenharia/obra-sala-comercial-centro-07.webp",
        alt: "Circulação concluída, com as portas instaladas",
      },
    ],
    /* A foto 1 é em pé; a 3 é deitada e mostra o andar inteiro. */
    capa: {
      src: "/img/engenharia/obra-sala-comercial-centro-03.webp",
      alt: "Andar aberto durante a obra, com o forro sendo fechado",
    },
  },

  /* --- Teste de cor -----------------------------------------------------
     Não é obra: é método. Entra no portfólio a pedido do cliente, e vale,
     porque mostra uma prática que quem já se decepcionou com cor reconhece
     na hora. */
  {
    chave: "teste-de-cor",
    nome: "Teste de cor",
    categoria: "Método",
    tipo: "Amostra aprovada no próprio ambiente",
    local: "Florianópolis, SC",
    resumo:
      "A cor é decidida em amostra, na luz do próprio ambiente — não no catálogo da loja.",
    descricao:
      "A mesma tinta muda conforme a luz do lugar, a hora do dia e o que está na parede ao lado. Por isso a escolha não é feita no leque: são pintadas placas de verdade, deixadas no ambiente, e o cliente decide vendo. Custa uma tarde e evita repintar um andar inteiro.",
    escopo: [
      "Amostra em placa",
      "Avaliação na luz do ambiente",
      "Aprovação do cliente",
    ],
    fotos: [
      {
        src: "/img/engenharia/obra-teste-de-cor.webp",
        alt: "Três placas pintadas em tons diferentes, dispostas no chão com as latas de tinta",
      },
      {
        src: "/img/engenharia/obra-teste-de-cor-02.webp",
        alt: "As placas vistas de perto, lado a lado para comparação",
      },
      {
        src: "/img/engenharia/obra-teste-de-cor-03.webp",
        alt: "Placas e material de pintura preparados no local",
      },
      {
        src: "/img/engenharia/obra-teste-de-cor-04.webp",
        alt: "Rolos e latas das cores em teste",
      },
    ],
  },

  /* --- Voss Engenharia --------------------------------------------------
     [A CONFIRMAR] a marca de um terceiro aparece na parede da foto 2. Se o
     contrato não permitir, essa foto sai. */
  {
    chave: "voss-engenharia",
    nome: "Voss Engenharia",
    categoria: "Reforma",
    tipo: "Andar corporativo",
    local: "Florianópolis, SC",
    resumo:
      "Recepção, convivência e circulação de um andar corporativo, refeitos.",
    descricao:
      "Escritório de empresa não é só mesa: é recepção que recebe cliente, área de convivência que segura equipe e circulação que aguenta movimento o dia inteiro. Cada um pede um acabamento diferente, e os três foram resolvidos no mesmo contrato.",
    escopo: ["Marcenaria", "Pintura", "Piso", "Obra em prédio em operação"],
    fotos: [
      {
        src: "/img/engenharia/obra-voss-engenharia.webp",
        alt: "Recepção e área de convivência do andar corporativo",
      },
      {
        src: "/img/engenharia/obra-voss-engenharia-02.webp",
        alt: "Área de convivência com painel de madeira e parede azul",
      },
      {
        src: "/img/engenharia/obra-voss-engenharia-03.webp",
        alt: "Circulação com marcenaria escura e piso contínuo",
      },
    ],
  },
];
