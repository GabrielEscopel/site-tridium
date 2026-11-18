/* =============================================================================
   ÁREA DO CORRETOR — acesso e procedimentos
   -----------------------------------------------------------------------------
   Duas coisas moram aqui: a credencial de teste e o mapa de procedimentos da
   imobiliária.

   ⚠ A CREDENCIAL NÃO É SEGURANÇA. Ela é conferida no navegador, e tudo o que
   o navegador recebe pode ser lido por quem abrir o código-fonte da página.
   Serve para montar e testar o fluxo — a porta, a chave e o que tem do outro
   lado — não para guardar nada. Enquanto for assim, NADA DE VALOR REAL entra
   aqui: sem dado de cliente, sem proposta, sem documento, sem valor de
   comissão. O texto dos procedimentos é processo interno, não é sigiloso.

   Para virar segurança de verdade são necessários, nesta ordem: um banco de
   dados, usuários com senha guardada em hash, sessão assinada no servidor e
   as páginas do painel renderizadas só depois da sessão conferida lá. O site
   roda em Node na Hostinger, então isso cabe — é trabalho de outra etapa.
   ============================================================================= */

/* [TESTE] Trocar antes de qualquer uso real. Ver o aviso acima. */
export const credencialTeste = {
  usuario: "admin",
  senha: "admin",
} as const;

/* -----------------------------------------------------------------------------
   MAPA DE PROCEDIMENTOS
   -----------------------------------------------------------------------------
   As etapas pelas quais um imóvel passa, da captação ao pós-venda, mais as
   frentes que correm em paralelo (administrativo, jurídico). Cada etapa tem
   tópicos; cada tópico tem o passo a passo e, quando couber, o que a lei
   exige.

   `cards` é onde entram os materiais que forem sendo produzidos — modelo de
   contrato, roteiro de visita, planilha de comissão. Enquanto estiver vazio,
   o tópico mostra só o passo a passo.
   ----------------------------------------------------------------------------- */

export interface CardProcedimento {
  chave: string;
  titulo: string;
  /** O que este material é e quando se usa. */
  descricao: string;
  /** "modelo" (documento a preencher), "guia" (como fazer), "ferramenta". */
  tipo: "modelo" | "guia" | "ferramenta";
  /** Arquivo em /public ou link externo. Sem isso, o card aparece como a
      produzir — é o mesmo princípio das fotos pendentes do resto do site. */
  href?: string;
}

/* -----------------------------------------------------------------------------
   BLOCOS DE AULA
   -----------------------------------------------------------------------------
   Um topico pode ser duas coisas diferentes, e elas pedem formas diferentes:

     PROCEDIMENTO  o passo a passo de uma tarefa. Lista numerada, e a ordem
                   carrega informacao. E o caso de quase todos os modulos.
     AULA          materia para estudar: secoes com titulo, linha do tempo,
                   definicoes. Lista numerada aqui viraria uma parede de
                   itens sem hierarquia.

   Topico com `conteudo` e aula e se desenha assim; sem ele, e procedimento e
   usa `passos`. Os dois convivem no mesmo array, e nenhum modulo precisa
   escolher um formato so.
   ----------------------------------------------------------------------------- */

export type BlocoAula =
  /** Paragrafo solto, para abrir ou fechar a aula. */
  | { tipo: "texto"; texto: string }
  /** Secao com titulo, texto opcional e lista opcional. */
  | {
      tipo: "secao";
      titulo: string;
      texto?: string;
      itens?: string[];
      /** De onde veio a informacao desta secao. */
      fonte?: string;
    }
  /** Linha do tempo. `ano` aparece em destaque ao lado do texto. */
  | {
      tipo: "linha";
      titulo?: string;
      marcos: {
        ano: string;
        titulo: string;
        texto: string;
        /** Marca o acontecimento que divide a historia em antes e depois. */
        marco?: boolean;
      }[];
    }
  /** Caixa de fecho: a ideia que a aula quer deixar. */
  | { tipo: "fecho"; titulo: string; texto: string }
  /** Imagem no meio da aula. `legenda` aparece embaixo, quando houver. */
  | {
      tipo: "imagem";
      src: string;
      alt: string;
      legenda?: string;
      /** Proporcao do arquivo, para a moldura nao cortar o que importa.
          Cards desenhados com texto dentro nao podem ser cortados. */
      formato?: "deitada" | "quadrada";
    };

export interface TopicoProcedimento {
  chave: string;
  titulo: string;
  resumo: string;
  /** O passo a passo, na ordem em que acontece. Vazio numa aula. */
  passos: string[];
  /** Materia de estudo, quando o topico for aula e nao procedimento. */
  conteudo?: BlocoAula[];
  /** De onde veio o conteudo, quando couber citar. */
  fontes?: { rotulo: string; href: string }[];
  /** Exigência legal ou de conselho, com a fonte. */
  exigencia?: string;
  /** Erro comum que custa caro. */
  atencao?: string;
  cards?: CardProcedimento[];
}

export interface EtapaProcedimento {
  chave: string;
  numero: string;
  titulo: string;
  /** Nome curto, para a trilha de modulos. Tres titulos nao cabem nela por
      extenso e empurravam a fileira inteira para alem da tela; o titulo
      completo continua aparecendo na abertura do modulo. Sem este campo,
      vale o `titulo`. */
  tituloCurto?: string;
  resumo: string;
  /** O que o corretor tem de SABER FAZER ao fim do módulo. É isto que
      transforma a lista de procedimentos num treinamento: sem um objetivo
      verificável, a pessoa lê os passos e não sabe se aprendeu. */
  objetivo: string;
  /** Nome do ícone em IconesImovel.ICONES_CATEGORIA, ou um dos próprios. */
  icone: string;
  /** Imagem de abertura do módulo. Enquanto não houver arquivo, o módulo
      mostra um painel dizendo o que precisa ser produzido — a mesma regra
      do resto do site: nunca uma imagem de banco no lugar da real. */
  imagem?: {
    src?: string;
    alt: string;
    descricao: string;
    credito?: string;
    /** "quadrada" entra ao lado do texto; "deitada", como faixa em cima.
        Card desenhado, com texto dentro, tem de ser deitado: espremido
        num quadrado ele perde metade do que diz. */
    formato?: "deitada" | "quadrada";
  };
  topicos: TopicoProcedimento[];
}

export const procedimentos: EtapaProcedimento[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    chave: "historia",
    numero: "01",
    titulo: "História",
    tituloCurto: "História",
    resumo:
      "De onde vem a profissão, o que a lei manda o corretor fazer e como ele é pago. Corretagem não nasceu com os portais — é um ofício antigo, regulamentado, com conselho e código de ética próprios.",
    objetivo:
      "Explicar por que corretor é profissão regulamentada, dizer o que é e o que não é função sua, e saber em que momento a comissão passa a ser devida — inclusive quando o negócio cai no fim.",
    icone: "casa",
    /* Colagem sobre a historia da corretagem: a metade esquerda em sepia —
       caravela, casario colonial, homens de cartola sobre uma planta, pena e
       tinteiro — e a direita em cor, com arranha-ceus, casa moderna, corretor
       com clientes e laptop. Diz o que a aula diz, numa olhada.

       Sem `credito`: a versao anterior era uma peca do CRECI-SC, com a marca
       gravada no rodape, e a etiqueta de credito acompanhava. Esta e material
       proprio da casa, entao nao ha a quem creditar — e deixar o nome de um
       terceiro numa imagem que nao e dele seria atribuicao errada, nao
       cortesia.

       Quadrada, 800x800. Por isso ela entra ao LADO do texto, nao como
       faixa deitada: numa faixa 21:9 o corte comeria a caravela em cima e a
       mesa com a planta embaixo, que e justamente a passagem do tempo que a
       imagem conta. */
    imagem: {
      src: "/img/treinamento/historia-corretagem-colagem.webp",
      alt: "Colagem: a corretagem do passado, em sepia, dando lugar ao mercado atual",
      descricao: "A corretagem, do passado ao presente",
    },
    topicos: [
      {
        chave: "historia-corretagem",
        titulo: "História da corretagem",
        resumo:
          "Da Mesopotâmia ao CRECI: como a necessidade de negociar terra virou profissão regulamentada.",
        /* Aula, nao procedimento: por isso `conteudo` e nao `passos`. */
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "A profissão de corretor de imóveis é muito mais antiga do que parece. Ela nasceu de uma necessidade humana que nunca deixou de existir: comprar, vender, trocar e negociar terra. A atividade começou há milhares de anos — muito antes de existirem imobiliárias, prédios e CRECI.",
          },
          {
            tipo: "secao",
            titulo: "1. Onde tudo começou",
            texto:
              "A negociação de terras existe desde as primeiras civilizações. Não havia profissão regulamentada, mas já havia quem fizesse o papel de intermediário.",
            itens: [
              "Por volta de 3.000 a.C., na Mesopotâmia, já existiam registros escritos de compra, venda e transferência de terras.",
              "Na Grécia Antiga, intermediários ajudavam pessoas a encontrar propriedades e a fechar negócio.",
              "No Império Romano, a propriedade privada ganhou peso e as negociações imobiliárias se desenvolveram.",
            ],
          },
          {
            tipo: "secao",
            titulo: "2. Como surgiu o corretor moderno",
            texto:
              "Entre os séculos XVIII e XIX, com o crescimento das cidades e do comércio, comprar, vender e alugar imóvel virou coisa frequente. É aí que aparecem as primeiras empresas especializadas em intermediar esses negócios, e a função ganha contorno próprio: aproximar comprador e vendedor, avaliar oportunidades e conduzir a negociação.",
          },
          {
            tipo: "secao",
            titulo: "3. E no Brasil",
            texto:
              "A atividade ganhou força no início do século XX. Com a urbanização e a expansão das construções, cresceu a necessidade de quem conhecesse terrenos, casas e oportunidades. No começo era tudo informal — e foi o próprio tamanho do mercado que acabou exigindo organização e regra.",
          },
          {
            tipo: "linha",
            titulo: "4. As datas que marcaram a profissão no Brasil",
            marcos: [
              {
                ano: "1808",
                titulo: "A chegada da família real",
                texto:
                  "O CRECI-DF relaciona o início da atividade no país à procura de moradia para a corte portuguesa recém-chegada. É história de tradição do conselho, contada como origem simbólica, não como registro documental.",
              },
              {
                ano: "1937",
                titulo: "O primeiro sindicato",
                texto:
                  "Criado no Rio de Janeiro o primeiro Sindicato dos Corretores de Imóveis.",
              },
              {
                ano: "1957",
                titulo: "O primeiro Congresso Nacional",
                texto:
                  "Corretores de vários estados se reúnem para reivindicar reconhecimento e regulamentação da profissão.",
              },
              {
                ano: "1962",
                titulo: "A primeira regulamentação",
                texto:
                  "Em 27 de agosto é promulgada a Lei nº 4.116, que regulamenta a profissão e marca a criação dos conselhos. É por causa dela que 27 de agosto é o Dia Nacional do Corretor de Imóveis.",
                marco: true,
              },
              {
                ano: "1978",
                titulo: "A lei que vale hoje",
                texto:
                  "A Lei nº 6.530, de 12 de maio, dá nova regulamentação à profissão e é a base até hoje. O Decreto nº 81.871, de 29 de junho, a regulamenta.",
                marco: true,
              },
              {
                ano: "1980–1990",
                titulo: "Consolidação",
                texto:
                  "Os conselhos regionais se espalham pelo país e a fiscalização se fortalece.",
              },
              {
                ano: "2000–hoje",
                titulo: "A virada digital",
                texto:
                  "Portais imobiliários, redes sociais, marketing digital, fotografia profissional, vídeo e visita virtual passam a fazer parte do ofício.",
              },
            ],
          },
          {
            tipo: "secao",
            titulo: "5. O que são CRECI e COFECI",
            itens: [
              "CRECI — Conselho Regional de Corretores de Imóveis. Fiscaliza o exercício da profissão em cada região e emite a carteira profissional.",
              "COFECI — Conselho Federal de Corretores de Imóveis. Coordena e orienta o sistema dos conselhos regionais.",
              "Para exercer legalmente é preciso ter a formação exigida — o TTI, Técnico em Transações Imobiliárias — e registro ativo no CRECI.",
            ],
          },
          {
            tipo: "secao",
            titulo: "6. A profissão hoje",
            texto:
              "O corretor deixou de ser quem abre a porta do imóvel. Hoje precisa dominar:",
            itens: [
              "Mercado imobiliário da região em que atua.",
              "Documentação de imóveis — matrícula, certidões, o que trava cartório.",
              "Técnicas de venda e negociação.",
              "Financiamento imobiliário.",
              "Marketing e divulgação.",
              "Atendimento e relacionamento com o cliente.",
              "Avaliação e características construtivas do imóvel.",
            ],
          },
          {
            tipo: "secao",
            titulo: "7. Uma curiosidade",
            texto:
              "O Dia do Corretor de Imóveis é 27 de agosto por causa da primeira lei que regulamentou a profissão, em 1962. A data não foi escolhida por conveniência: ela marca uma conquista que a categoria levou anos reivindicando.",
          },
          {
            tipo: "fecho",
            titulo: "Por que isso importa para quem vende imóvel hoje",
            texto:
              "A corretagem nasceu de uma necessidade que nunca deixou de existir: as pessoas sempre precisaram de um lugar para morar, trabalhar e formar patrimônio. Para quem compra, o imóvel raramente é só uma construção — é a primeira casa própria, a independência, um investimento. Saber de onde vem a profissão é o que separa quem mostra imóvel de quem responde, com segurança, por que merece a confiança do cliente.",
          },
        ],
        exigencia:
          "Exercer a profissão sem registro no CRECI é exercício ilegal (Lei 6.530/78). A comissão de quem não tem registro não é exigível em juízo — o conselho existe também para proteger quem trabalha direito.",
        atencao:
          "Uma fonte do próprio sistema COFECI-CRECI diz que a Lei 4.116/62 foi declarada inconstitucional por inteiro; outra, que a inconstitucionalidade atingiu apenas o art. 7º. A revogação pela Lei 6.530/78 é consenso. Em prova ou conversa técnica, fique na revogação, que ninguém contesta.",
        fontes: [
          {
            rotulo: "CRECI-DF — História do corretor de imóveis",
            href: "https://crecidf.gov.br/historia-do-corretor-de-imoveis/",
          },
          {
            rotulo: "CRECI-SP — História da profissão",
            href: "https://crecisp.gov.br/o-creci/historia/1978",
          },
          {
            rotulo: "Câmara dos Deputados — Lei nº 6.530/1978",
            href: "https://www2.camara.leg.br/legin/fed/lei/1970-1979/lei-6530-12-maio-1978-365766-norma-pl.html",
          },
          {
            rotulo: "COFECI — A evolução da profissão",
            href: "https://www.cofeci.gov.br/post/a-evolu%C3%A7%C3%A3o-da-profiss%C3%A3o-de-corretor-de-im%C3%B3veis",
          },
        ],
      },
      {
        chave: "funcoes",
        titulo: "As funções do corretor",
        resumo:
          "O que a lei manda o corretor fazer, o que ela não manda, e onde termina o ofício dele.",
        passos: [
          "A função central é a INTERMEDIAÇÃO: aproximar quem compra de quem vende, ou quem aluga de quem loca, até o negócio fechar. Compra, venda, permuta e locação.",
          "Opinar sobre a comercialização: preço, condições, o momento de vender. É função prevista em lei, não favor.",
          "Informar. O Código Civil manda prestar ao cliente, por conta própria, tudo o que possa influir no resultado do negócio — inclusive o que atrapalha a venda.",
          "Agir com diligência e prudência: conferir documento, visitar o imóvel, checar o que o cliente afirma.",
          "Acompanhar até o fim: proposta, contrato, cartório, chaves. Intermediação não termina no aperto de mão.",
          "O QUE NÃO É FUNÇÃO DO CORRETOR: redigir parecer jurídico, representar parte em juízo, assinar laudo de engenharia, fazer avaliação judicial sem CNAI. Reconhecer o limite e encaminhar é parte do ofício.",
        ],
        exigencia:
          "A corretagem está no Capítulo XIII do Código Civil, arts. 722 a 729. O art. 722 define o contrato; o 723 traz os deveres de diligência e de informação, e quem os descumpre responde por perdas e danos. A Lei 6.530/78 define as atribuições profissionais.",
        atencao:
          "O dever de informar vale TAMBÉM para o que derruba o negócio: vazamento conhecido, processo na matrícula, obra vizinha aprovada. Omitir para fechar mais rápido é o caminho mais curto para devolver a comissão em juízo.",
      },
      {
        chave: "comissoes",
        titulo: "As comissões",
        resumo:
          "Quando a comissão é devida, quanto é, quem paga e o que a lei garante mesmo quando o negócio cai.",
        passos: [
          "A comissão nasce do RESULTADO ÚTIL: conseguido o resultado previsto, ela é devida — ainda que o negócio não se efetive por arrependimento das partes (art. 725).",
          "Sem percentual combinado, ele é arbitrado pela natureza do negócio e pelos usos do lugar (art. 724). Combinar por escrito evita a discussão.",
          "Com exclusividade, a comissão é devida mesmo que o negócio seja fechado sem o corretor — salvo se ficar provada a inércia dele (art. 726).",
          "Negócio fechado DEPOIS do prazo, mas por efeito do trabalho do corretor: a comissão continua devida (art. 727).",
          "Mais de um corretor na mesma intermediação: a remuneração se divide entre eles, salvo ajuste diferente (art. 728).",
          "Os percentuais de referência são os da tabela do CRECI de cada estado. Dentro da casa, a comissão ainda se reparte entre captador, vendedor e imobiliária.",
          "Quem paga, em regra, é quem contratou o corretor — normalmente o vendedor. O que vale é o que estiver escrito na autorização.",
          "Comissão recebida se declara e se nota-fisca. Combinado de boca vira prejuízo de um dos dois lados.",
        ],
        exigencia:
          "Arts. 724 a 728 do Código Civil tratam da remuneração. A corretagem é obrigação de resultado, não de meio: não se paga pelo esforço, paga-se pela aproximação útil. Quem não tem registro no CRECI não tem comissão exigível em juízo.",
        atencao:
          "A redação literal dos artigos foi conferida por resumo, não palavra por palavra. Antes de citar num contrato ou numa cobrança, confira o texto no site do Planalto — e lembre que a jurisprudência do STJ sobre resultado útil se move.",
        cards: [
          {
            chave: "tabela-comissao",
            titulo: "Tabela de comissão e divisão interna",
            descricao:
              "Os percentuais de referência do CRECI-SC e como a casa divide entre captador, vendedor e imobiliária.",
            tipo: "ferramenta",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    chave: "apresentacao",
    numero: "02",
    titulo: "Apresentação pessoal",
    tituloCurto: "Apresentação",
    /* Frase de impacto, nao descricao: o numero e o conteudo. Nao sao tres
       segundos nem sete — e o que a pesquisa de Princeton mediu. */
    resumo:
      "Não são três segundos. Nem sete. São 100 MILISSEGUNDOS — um décimo de segundo — para o cliente decidir se confia em você.",
    objetivo:
      "Apresentar-se em trinta segundos de um jeito que dê vontade de continuar a conversa, chegar à visita dentro do padrão da casa — da camisa ao porta-malas — e manter um perfil público que ajude em vez de atrapalhar.",
    icone: "aluguel",
    /* Mesma moldura do modulo 01: quadrada, ao lado do texto. Recorte do
       proprio card da casa, no TAMANHO NATIVO — a versao anterior juntava
       os corretores e o carro num quadrado so, esticando os dois para
       caber, e saia borrada. Com um assunto so, o recorte cabe sem
       deformar. O carro aparece inteiro na aula 03, onde e o tema. */
    imagem: {
      src: "/img/treinamento/apresentacao-corretores.webp",
      alt: "Corretor e corretora de camisa oficial da Tridium Imoveis, com cordao e cracha de identificacao",
      descricao: "O padrao de apresentacao da casa",
    },
    topicos: [
      {
        chave: "imagem-profissional",
        titulo: "Imagem profissional",
        resumo:
          "O cuidado pessoal que o cliente registra antes de ouvir a primeira frase.",
        passos: [],
        conteudo: [
          {
            tipo: "fecho",
            titulo: "Um décimo de segundo",
            texto:
              "Não são três segundos, nem sete. Um estudo de Princeton mostrou que bastam 100 MILISSEGUNDOS de exposição a um rosto para alguém formar julgamento de confiabilidade, competência e simpatia — e que dar mais tempo quase não muda o julgamento, só aumenta a confiança de quem julga. De todos os traços medidos, CONFIABILIDADE foi o que se formou mais rápido e com mais concordância. Quando o cliente abre a porta, a impressão já está formada. Dá para revertê-la, com trabalho; sair na frente custa menos.",
          },
          {
            tipo: "imagem",
            src: "/img/treinamento/apresentacao-corretor.webp",
            alt: "Corretor e corretora de camisa oficial da Tridium Imóveis, ao lado das listas de imagem profissional e vestuário",
            legenda: "O padrão de apresentação da Tridium Imóveis.",
          },
          {
            tipo: "secao",
            titulo: "O básico, todo dia",
            itens: [
              "Cabelo cortado e bem cuidado.",
              "Barba feita ou bem aparada.",
              "Higiene pessoal em dia.",
              "Unhas limpas e aparência organizada.",
              "Uso moderado de perfume — em carro fechado e imóvel sem ventilação, excesso incomoda.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Por que isso pesa mais aqui do que em outras profissões",
            texto:
              "O cliente vai entregar a um desconhecido a negociação do maior bem que tem, e muitas vezes vai recebê-lo dentro de casa. Na falta de outra informação, ele usa o que vê. Cuidado com a aparência não é vaidade: é o primeiro sinal de que a pessoa cuida também do que não se vê — do contrato, do prazo, da documentação.",
          },
        ],
        fontes: [
          {
            rotulo:
              "Willis & Todorov (2006), Psychological Science — First Impressions: Making Up Your Mind After a 100-ms Exposure to a Face",
            href: "https://collaborate.princeton.edu/en/publications/first-impressions-making-up-your-mind-after-a-100-ms-exposure-to-/",
          },
          {
            rotulo: "Princeton — Snap judgments decide a face's character",
            href: "https://princeton.edu/news/2006/08/22/snap-judgments-decide-faces-character-psychologist-finds",
          },
        ],
      },
      {
        chave: "vestuario",
        titulo: "Vestuário e identificação",
        resumo:
          "A camisa da casa e o cracha. Quem recebe um desconhecido em casa precisa saber, de longe, quem é aquela pessoa.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "O uniforme da casa",
            itens: [
              "Camisa oficial da imobiliária.",
              "Cracha de identificação visível — no peito, não no bolso.",
              "Roupas limpas, alinhadas e em bom estado.",
              "Calçado social ou casual, alinhado e limpo.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que levar junto",
            texto:
              "Identificação não é só o que se veste. O material que o corretor carrega diz a mesma coisa.",
            itens: [
              "Cartão com o número do CRECI.",
              "Documento com foto.",
              "Carregador de celular e água — visita longa acontece.",
              "Pasta ou prancheta para a ficha do imóvel e a proposta.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O cracha não é formalidade",
            texto:
              "É o que separa o corretor de qualquer um que bate à porta. Vale mais para quem vai abrir do que para quem vai entrar — e por isso ele fica à vista desde a calçada, não depois do cumprimento.",
          },
        ],
        exigencia:
          "O número de inscrição no CRECI é obrigatório no material de identificação e em toda peça publicitária do corretor (Lei 6.530/78; Resolução COFECI 492/2007).",
      },
      {
        chave: "carro",
        titulo: "Carro",
        resumo:
          "Em muitas visitas ele é a primeira sala de reunião, e às vezes a única.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/apresentacao-veiculo.webp",
            alt: "Veículo da Tridium Imóveis com a marca aplicada na porta, ao lado da lista de cuidados com o carro",
            legenda: "O padrão de veículo da Tridium Imóveis.",
          },
          {
            tipo: "secao",
            titulo: "O padrão",
            itens: [
              "Limpo por dentro e por fora.",
              "Organizado e sem objetos soltos.",
              "Manutenção em dia: revisões, pneus e itens de segurança.",
              "Transmite cuidado, credibilidade e profissionalismo.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Na prática",
            itens: [
              "Banco do carona livre antes de buscar o cliente.",
              "Temperatura ajustada e som baixo ou desligado — a conversa é o trabalho.",
              "Tanque com folga: parar no posto no meio do roteiro passa desorganização.",
              "Combustivel e estacionamento entram no custo da visita, não no bolso do cliente.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O trajeto também é atendimento",
            texto:
              "Entre um imóvel e outro há quinze, vinte minutos com o cliente sentado ao lado. É o momento em que ele conta o que não disse na ficha: o prazo real, quem decide junto, o que já viu e por que não gostou. Carro bagunçado encurta essa conversa.",
          },
        ],
        atencao:
          "Carro com a marca da imobiliária é peça de divulgação circulando. Dirigir mal nele custa mais caro que dirigir mal em carro sem adesivo.",
      },
      {
        chave: "comportamento",
        titulo: "Comportamento e relacionamento",
        resumo:
          "Como o corretor chega, conduz e volta. O que acontece depois da primeira impressão.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "A apresentação em trinta segundos",
            texto:
              "O que dizer quando perguntam o que você faz. Treinada, sai natural; improvisada, sai confusa.",
            itens: [
              "Nome, o que faz e onde atua, em uma frase.",
              "O diferencial da casa em outra: avaliação técnica de quem constrói.",
              "Uma pergunta no fim, que devolve a palavra ao outro.",
              "Treinar em voz alta até sair sem pensar — decorado soa decorado, sabido soa natural.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Durante a visita",
            itens: [
              "Chegar antes do horário combinado, sempre.",
              "Celular no silencioso e fora da mão.",
              "Deixar o cliente andar sozinho em algum momento — o silêncio faz parte.",
              "Ouvir mais do que falar: a objeção dele vale mais que o argumento seu.",
              "Não prometer o que depende de terceiro: banco, cartório, proprietário.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Depois",
            itens: [
              "Retorno em 24 horas, mesmo quando não há novidade.",
              "Registrar o que foi dito — prazo, perfil, o que comparou.",
              "Avisar quando entrar imóvel no perfil dele, ainda que meses depois.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Nas redes",
            texto:
              "O cliente procura o nome do corretor antes de responder à mensagem. O que ele acha conta.",
            itens: [
              "Perfil público com foto profissional, cidade de atuação e CRECI na bio.",
              "Perfil pessoal separado do profissional.",
              "Mesma informação do anúncio — preço diferente em dois lugares derruba a confiança.",
              "Responder mensagem de rede no mesmo prazo do WhatsApp.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Relação longa vale mais que venda rápida",
            texto:
              "Quem compra imóvel compra poucas vezes na vida, mas indica muitas. A maior parte da carteira de um corretor experiente vem de indicação — e indicação nasce de quem foi bem tratado inclusive quando o negócio não fechou.",
          },
        ],
        atencao:
          "Opinião política, religiosa ou de time no perfil profissional afasta metade dos clientes possíveis, e nunca se sabe qual metade.",
        cards: [
          {
            chave: "modelo-pitch",
            titulo: "Modelo de apresentação",
            descricao:
              "A estrutura das três partes, com exemplos para visita, telefone e evento.",
            tipo: "modelo",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 06 */
  {
    chave: "captacao",
    numero: "03",
    titulo: "Agenciamento",
    tituloCurto: "Agenciamento",
    resumo:
      "Trazer o imóvel para a carteira. Cada tipo pede uma conversa diferente, uma documentação diferente e um caminho diferente até o anúncio.",
    objetivo:
      "Saber a quem procurar e o que pedir em cada tipo de imóvel — lançamento de construtora, apartamento usado, terreno, casa — e manter cada um no grupo certo, para a carteira não virar uma lista só.",
    icone: "casa",
    /* Mesmo padrao dos modulos 01 e 02: foto quadrada a esquerda, texto a
       direita. Recorte do card da casa no tamanho nativo. Antes aqui havia
       o infografico dos quatro grupos, em faixa, e o modulo abria diferente
       dos outros dois. */
    imagem: {
      src: "/img/treinamento/agenciamento-recepcao.webp",
      alt: "Corretor da Tridium Imoveis cumprimentando um cliente na entrada de um empreendimento",
      descricao: "A recepcao do cliente no empreendimento",
    },
    topicos: [
      {
        chave: "construtoras",
        titulo: "Empreendimentos de construtoras",
        resumo:
          "Lançamentos e imóveis na planta: como achar, como fotografar e como organizar o grupo do bairro.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Aqui o imóvel não tem dono ainda — tem incorporadora. A conversa é com a área comercial da construtora, não com proprietário, e quase tudo que o corretor precisa já vem pronto: tabela, planta e material de venda. O trabalho é encontrar o empreendimento antes dos outros e deixar o registro arrumado.",
          },
          {
            tipo: "imagem",
            src: "/img/treinamento/agenciamento-construtoras.webp",
            alt: "Card da Tridium Imóveis com o passo a passo da captação de empreendimentos e o padrão do grupo de WhatsApp",
            legenda:
              "O passo a passo e o padrão do grupo. Vale consultar antes de criar um grupo novo.",
          },
          {
            tipo: "linha",
            titulo: "O passo a passo",
            marcos: [
              {
                ano: "01",
                titulo: "Pesquisa nos portais",
                texto:
                  "Levantamento dos empreendimentos nos portais e na internet.",
              },
              {
                ano: "02",
                titulo: "Vistoria in loco",
                texto:
                  "Ir até o empreendimento e conferir pessoalmente. Portal mostra render; a rua mostra o que foi construído.",
              },
              {
                ano: "03",
                titulo: "Foto padrão da capa",
                texto:
                  "Fachada frontal, seguindo o padrão da casa descrito abaixo.",
                marco: true,
              },
              {
                ano: "04",
                titulo: "Identificar contatos",
                texto: "Nome da construtora, WhatsApp e e-mail do comercial.",
              },
              {
                ano: "05",
                titulo: "Visita à construtora",
                texto:
                  "Quando houver abertura, ir buscar o material do empreendimento — tabela, plantas, memorial e peças de divulgação.",
              },
              {
                ano: "06",
                titulo: "Documentação e ficha de agenciamento",
                texto:
                  "Solicitar à construtora a documentação do empreendimento e preencher a ficha de agenciamento. É o passo que fecha a captação: sem ele o imóvel está achado, não agenciado.",
                marco: true,
              },
            ],
          },
          {
            tipo: "secao",
            titulo: "O grupo de WhatsApp",
            texto:
              "Cada bairro tem o seu grupo, e o nome segue sempre o mesmo molde, para qualquer um achar sem perguntar:",
            itens: [
              "CAP — EP — Bairro, Cidade",
              "Exemplo: CAP - EP - Trindade, Florianópolis",
            ],
            fonte:
              "CAP é captação, EP é empreendimento. O grupo é genérico da região — um por bairro, não um por prédio.",
          },
          {
            tipo: "secao",
            titulo: "O padrão da foto de capa",
            texto:
              "A foto do grupo é a fachada do empreendimento, e ela segue quatro regras:",
            itens: [
              "Foto da fachada, de frente.",
              "Um pouco da calçada — dá escala e mostra o acesso.",
              "Bem iluminada.",
              "Bom contraste.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Ajuste da imagem",
            texto:
              "Depois de fotografar, a imagem passa por um tratamento para ficar no padrão:",
            itens: [
              "Deixar a foto com iluminação solar.",
              "Remover veículos, pessoas, cabos e qualquer coisa na frente do empreendimento.",
            ],
          },
          {
            tipo: "secao",
            titulo: "A documentação do empreendimento",
            texto:
              "O que pedir ao comercial da construtora, e sem o que não se anuncia:",
            itens: [
              "Registro de incorporação averbado na matrícula — é ele que autoriza a venda de unidade na planta.",
              "Memorial descritivo: o que está incluído em cada unidade e com que acabamento.",
              "Plantas e quadro de áreas, com área privativa e total por tipologia.",
              "Tabela de vendas vigente, com a data — ela muda a cada fase da obra.",
              "Alvará de construção e previsão de entrega, com a tolerância contratual.",
              "Condições de pagamento e o banco que financia o empreendimento.",
              "Autorização de comercialização, com o percentual e o prazo da comissão.",
              "Material de divulgação liberado, e por escrito o que pode ser publicado.",
            ],
            fonte:
              "O registro de incorporação é exigência da Lei 4.591/64, art. 32: sem ele a incorporadora não pode negociar unidades. Pedir o número do registro, e não a palavra de quem atende, é o que protege o corretor.",
          },
          {
            tipo: "secao",
            titulo: "A ficha de agenciamento",
            texto:
              "Toda captação termina numa ficha preenchida. É ela que transforma o que o corretor viu e ouviu em registro da casa — e o que permite a outro corretor atender aquele imóvel sem começar do zero.",
            itens: [
              "Identificação do empreendimento e da construtora, com os contatos.",
              "Endereço, bairro e o grupo de WhatsApp a que pertence.",
              "Tipologias, áreas, preços e condições, com a data da tabela.",
              "Situação da obra e previsão de entrega.",
              "Documentação recebida e o que ficou pendente.",
              "Quem captou e quando — é por aqui que a comissão de captação se prova depois.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Até onde vai o tratamento",
            texto:
              "Tirar carro estacionado, pedestre e fio solto limpa a foto sem mudar o imóvel — isso é tratamento. Apagar o poste que fica na frente da sacada, o prédio vizinho que tapa a vista ou a fiação que cruza a varanda já é outra coisa: o cliente chega na visita e encontra o que a foto negou. A linha é simples — some com o que estava passando, não com o que fica.",
          },
        ],
        atencao:
          "Propaganda que omite característica relevante do produto é publicidade enganosa (CDC, art. 37). Numa foto de imóvel, o que está fixo na paisagem — poste, fiação, vizinho, muro — conta como característica.",
        cards: [
          {
            chave: "ficha-agenciamento",
            titulo: "Ficha de agenciamento",
            descricao:
              "O formulário padrão da casa, preenchido ao fim de toda captação: empreendimento, contatos, tipologias, documentação recebida e quem captou.",
            tipo: "modelo",
          },
          {
            chave: "padrao-foto-empreendimento",
            titulo: "Padrão de foto de empreendimento",
            descricao:
              "O enquadramento da fachada, o horário de luz e o que pode e o que não pode sair da imagem no tratamento.",
            tipo: "guia",
          },
        ],
      },
      {
        chave: "apartamentos-usados",
        titulo: "Apartamentos usados",
        resumo:
          "Imóveis de revenda, captados direto com o proprietário.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "É o agenciamento clássico: do outro lado há uma pessoa, com expectativa de preço, pressa ou falta dela, e uma documentação que ninguém conferiu há anos. O trabalho começa bem antes do anúncio.",
          },
          {
            tipo: "secao",
            titulo: "Na conversa com o proprietário",
            itens: [
              "Confirmar quem são todos os proprietários e se todos concordam em vender.",
              "Entender o motivo da venda e o prazo — eles definem a margem de negociação.",
              "Apresentar preço com comparaveis vendidos, não anunciados.",
              "Registrar por escrito o preço autorizado e a comissão.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Documentação que trava o fechamento",
            itens: [
              "Matrícula atualizada — emitida há menos de 30 dias.",
              "IPTU do ano e situação de débito.",
              "Declaração de quitação do condomínio.",
              "Estado civil dos proprietários e anuência do cônjuge.",
            ],
            fonte:
              "Penhora, usufruto, hipoteca e alienação fiduciária aparecem na matrícula. Descobrir na análise do banco custa semanas.",
          },
          {
            tipo: "fecho",
            titulo: "O diferencial da casa",
            texto:
              "Em usado, o comprador compra também os problemas que não vê. A avaliação técnica da Tridium Engenharia — estrutura, cobertura, elétrica, infiltração — é o que nenhuma outra imobiliária de Florianópolis entrega, e serve aos dois lados: dá segurança a quem compra e justifica o preço de quem vende.",
          },
        ],
      },
      {
        chave: "terrenos-casas",
        titulo: "Terrenos e casas",
        resumo:
          "Lotes, terrenos e casas à venda, e as oportunidades que aparecem por bairro.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Terreno: o que define o valor",
            texto:
              "Em lote, quase tudo que vale está fora da foto. O preço por metro muda com o que se pode construir ali.",
            itens: [
              "Zoneamento e índices de aproveitamento — quantos pavimentos, qual recuo, qual taxa de ocupação.",
              "Topografia e necessidade de contenção. Em Florianópolis, aclive e declive mudam o custo da obra.",
              "Infraestrutura na rua: água, esgoto, energia, pavimentação.",
              "Restrições ambientais, área de preservação e faixa de marinha.",
              "Matrícula: se o lote está individualizado ou ainda é fração de uma gleba.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Casa: o que olhar na visita",
            itens: [
              "Idade da construção e estado de estrutura, cobertura e instalações.",
              "Habite-se e averbação da construção na matrícula.",
              "Ampliações feitas sem projeto — muito comuns e um problema no financiamento.",
              "Sinais de infiltração, recalque e improviso elétrico.",
            ],
            fonte:
              "Construção não averbada impede financiamento bancário. É o tipo de coisa que precisa ser dita ao proprietário na captação, não na proposta.",
          },
          {
            tipo: "fecho",
            titulo: "Onde a oportunidade aparece",
            texto:
              "Terreno e casa são os tipos em que o corretor que conhece o bairro ganha do portal. Obra começando na rua, lote que muda de mão, casa antiga de família que vai a inventário — isso não está em nenhum site, está na rua.",
          },
        ],
      },
      {
        chave: "apartamentos-regiao",
        titulo: "Apartamentos por região",
        resumo:
          "Um grupo para cada bairro. Quem conhece a rua responde o que o portal não responde.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O último grupo não separa por tipo, separa por lugar. É o que permite responder em minutos a quem procura \"um dois quartos na Agronômica\" — e saber, sem consultar nada, quanto vale o metro naquela quadra.",
          },
          {
            tipo: "secao",
            titulo: "Os bairros da casa",
            itens: [
              "Agronômica — onde fica o escritório do grupo.",
              "Trindade.",
              "Rio Vermelho.",
            ],
            fonte:
              "A lista cresce conforme a carteira. Bairro novo vira grupo novo quando houver imóvel suficiente para justificar.",
          },
          {
            tipo: "secao",
            titulo: "O que saber de cada bairro",
            itens: [
              "Faixa de preço por metro, por tipologia.",
              "Os prédios e os construtores com boa e má fama na região.",
              "Acesso, transporte, escola, mercado, saúde.",
              "Barulho, sol da tarde, enchente, vaga de rua — o que só quem mora ali conta.",
              "Obras aprovadas na vizinhança que vão mudar vista ou trânsito.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Por que separar por bairro e não por preço",
            texto:
              "Quem procura imóvel raramente começa pelo valor: começa pelo lugar onde quer viver, e só depois descobre o que cabe no bolso. Organizar a carteira do mesmo jeito que o cliente pensa encurta o caminho entre a pergunta e a resposta.",
          },
        ],
      },
    ],
  },
  {
    chave: "divulgacao",
    numero: "04",
    titulo: "Divulgação",
    tituloCurto: "Divulgação",
    resumo:
      "Colocar o imóvel onde o comprador procura. Cada canal pede um formato, e o mesmo anúncio em todos rende menos do que parece.",
    objetivo:
      "Publicar um imóvel em todos os canais da casa com a informação certa em cada um — site, redes, portais, tráfego pago, placa e WhatsApp — sem repetir o mesmo texto e sem esquecer o que a lei exige na peça.",
    icone: "lancamento",
    /* Mesmo padrao dos modulos anteriores: foto quadrada a esquerda, texto
       a direita. Recorte do card de midias, no tamanho nativo. */
    imagem: {
      src: "/img/treinamento/divulgacao-midias.webp",
      alt: "Celular filmando a sala de um imovel, segurado na horizontal",
      descricao: "As midias do imovel",
    },
    topicos: [
      {
        chave: "site",
        titulo: "Site",
        resumo:
          "A vitrine própria. É o único canal em que a casa manda em tudo e não paga por contato.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "No portal, o imóvel aparece ao lado dos concorrentes e cada contato tem custo. No site da Tridium Imóveis ele aparece sozinho, do jeito que a casa quer, e quem chega ali já procurou a marca. Por isso o site é o primeiro lugar a publicar, não o último.",
          },
          {
            tipo: "secao",
            titulo: "A ficha do imóvel",
            itens: [
              "Título no padrão: tipo, dormitórios, suítes e bairro ou empreendimento.",
              "Código do imóvel — é por ele que a conversa começa no telefone.",
              "Áreas, vagas, condomínio e IPTU, com os valores do mês.",
              "O que está incluso e o que sai com o proprietário.",
              "Laudo da engenharia, quando houver — é o que nenhum concorrente tem.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O texto do anúncio",
            texto:
              "Texto honesto filtra visita perdida. Omitir defeito só adia a conversa difícil para o dia em que o cliente estiver dentro do imóvel.",
            itens: [
              "Descrever o que a foto não mostra: posição solar, barulho, acesso, vizinhança.",
              "Falar do bairro, não só do imóvel — quem procura escolhe o lugar primeiro.",
              "Revisar preço, metragem e bairro antes de publicar: errado ali vira processo.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O site trabalha enquanto ninguém olha",
            texto:
              "Anúncio em portal expira e post em rede some do feed em horas. A página do imóvel no site fica, é encontrada pela busca do Google e pode ser mandada por link em qualquer conversa. É o único canal que acumula.",
          },
        ],
        exigencia:
          "Toda peça publicitária precisa trazer o número de inscrição no CRECI (Lei 6.530/78, art. 4º; Resolução COFECI 492/2007). Vale para site, portal, placa, folder e post.",
        atencao:
          "PENDENTE: o número do CRECI da Tridium Imóveis ainda não aparece em nenhuma página do site.",
      },
      {
        chave: "redes-portais",
        titulo: "Redes sociais e portais",
        resumo:
          "Instagram, YouTube e Facebook buscam audiência; o portal vende contato. São trabalhos diferentes.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Rede social e portal costumam ser tratados como a mesma coisa, e não são. Na rede, o corretor constrói audiência ao longo do tempo e o contato vem de graça, mas devagar. No portal, o contato vem rápido e custa dinheiro. Os dois cabem — o erro é esperar da rede a velocidade do portal, ou do portal a lealdade da rede.",
          },
          {
            tipo: "secao",
            titulo: "Instagram",
            itens: [
              "Perfil profissional com foto, cidade de atuação e CRECI na bio.",
              "Feed: o imóvel bem fotografado, com o código na legenda.",
              "Stories: bastidor, visita, o bairro — é onde a pessoa conhece o corretor.",
              "Reels: tour curto, vertical, com a primeira cena no melhor ambiente.",
              "Responder direct no mesmo prazo do WhatsApp.",
            ],
          },
          {
            tipo: "secao",
            titulo: "YouTube",
            itens: [
              "Tour completo do imóvel, na ordem em que se anda nele.",
              "Vídeo de bairro: o que tem em volta, acesso, comércio, escola.",
              "Título e descrição com bairro e cidade — o YouTube também é busca.",
              "Link da página do imóvel no site, na descrição.",
            ],
            fonte:
              "Vídeo longo não compete com Reels: ele atende quem já está decidindo e quer ver tudo antes de marcar visita. São momentos diferentes do mesmo cliente.",
          },
          {
            tipo: "secao",
            titulo: "Facebook",
            itens: [
              "Página da imobiliária com os anúncios em dia.",
              "Grupos de bairro e de compra e venda da região — ler as regras de cada um antes de publicar.",
              "Marketplace, onde o público local ainda procura imóvel.",
              "Público mais velho que o do Instagram, e isso muda o imóvel que faz sentido anunciar.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Portais — Viva Real e os demais",
            itens: [
              "A ficha completa, com todas as fotos: portal ranqueia anúncio incompleto para baixo.",
              "Responder em minutos — o lead do portal está falando com mais três imobiliárias ao mesmo tempo.",
              "Acompanhar quais anúncios geram contato e quais só geram visualização.",
              "Tirar do ar o que vendeu, no mesmo dia.",
            ],
            fonte:
              "Portal cobra por plano ou por destaque, então cada anúncio parado é dinheiro parado. É o canal que mais exige disciplina de manutenção.",
          },
          {
            tipo: "fecho",
            titulo: "Antes de pagar por lead, olhe para dentro",
            texto:
              "Cruzar a carteira de clientes com o imóvel novo costuma fechar antes do portal, e sem custo por contato. Quem já procurou algo parecido é o primeiro a saber — é o primeiro movimento, não o último.",
          },
        ],
      },
      {
        chave: "trafego-pago",
        titulo: "Tráfego pago",
        resumo:
          "Anúncio pago para acelerar o que o orgânico faria devagar — e para encontrar quem ainda não procurava.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Onde anunciar",
            itens: [
              "Meta Ads: Instagram e Facebook, para alcance por interesse e região.",
              "Google Ads: aparece para quem JÁ está procurando — intenção mais quente, clique mais caro.",
              "Remarketing: voltar para quem já visitou a página do imóvel no site.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Antes de subir a campanha",
            itens: [
              "Definir o público: bairro, faixa de renda, momento de vida.",
              "Definir o destino: página do imóvel no site ou conversa no WhatsApp.",
              "Definir o orçamento e o prazo — campanha sem fim não se avalia.",
              "Conferir que a peça traz o CRECI. Anúncio pago é peça publicitária como qualquer outra.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que medir",
            itens: [
              "Custo por contato, não custo por clique.",
              "Quantos contatos viraram visita.",
              "Quantas visitas viraram proposta.",
              "Desligar o que não converte em duas semanas, em vez de esperar o mês fechar.",
            ],
            fonte:
              "Alcance e curtida não pagam comissão. A única métrica que interessa é quanto custou cada cliente que sentou para conversar.",
          },
          {
            tipo: "fecho",
            titulo: "Tráfego pago não conserta anúncio ruim",
            texto:
              "Foto mal feita, preço fora do mercado e texto confuso ficam iguais depois de pagos — só que agora mais gente viu. O dinheiro acelera o que já funciona; ele não corrige o que está errado.",
          },
        ],
        exigencia:
          "Anúncio pago segue as mesmas regras da peça publicitária: número do CRECI visível e informação que não induza a erro (Lei 6.530/78; CDC, art. 37).",
        cards: [
          {
            chave: "checklist-campanha",
            titulo: "Checklist de campanha",
            descricao:
              "Público, destino, orçamento, prazo e as conferências obrigatórias antes de subir um anúncio pago.",
            tipo: "modelo",
          },
        ],
      },
      {
        chave: "placas",
        titulo: "Placas",
        resumo:
          "O anúncio que fala com quem passa na rua — e com o vizinho, que é quem mais indica comprador.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Antes de instalar",
            itens: [
              "Autorização escrita do proprietário.",
              "Em condomínio, conferir a convenção: muitos proíbem placa na fachada e na sacada.",
              "Conferir a regra da prefeitura sobre publicidade em via pública.",
              "Escolher o ponto de maior visibilidade que seja permitido.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que a placa mostra",
            itens: [
              "Marca da imobiliária e o número do CRECI.",
              "Telefone e WhatsApp em tamanho legível de dentro do carro.",
              "Código do imóvel.",
              "Nada de preço, salvo decisão do proprietário — preço na rua atrai curioso e afasta quem negociaria.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Depois",
            itens: [
              "Conferir o estado a cada visita: placa torta, suja ou desbotada fala da imobiliária, não do imóvel.",
              "Retirar no dia em que o imóvel sai do ar.",
              "Guardar para reaproveitar — placa é patrimônio da casa.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Quem liga para a placa mora perto",
            texto:
              "O contato que vem da placa quase sempre é do bairro: alguém que quer trazer um parente para perto, ou que já queria mudar de rua sem sair da região. É um lead diferente do portal, e costuma estar mais decidido.",
          },
        ],
        exigencia:
          "Placa é peça publicitária: o número do CRECI é obrigatório nela (Resolução COFECI 492/2007).",
      },
      {
        chave: "whatsapp",
        titulo: "WhatsApp",
        resumo:
          "Onde a conversa realmente acontece, e onde o negócio se perde por demora.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "A conta",
            itens: [
              "WhatsApp Business, com nome, endereço, horário e site preenchidos.",
              "Catálogo com os imóveis em destaque.",
              "Respostas rápidas para o que se repete: ficha, endereço, agendamento.",
              "Mensagem de ausência fora do horário — melhor avisar que vai demorar do que deixar no vácuo.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Os grupos da casa",
            texto:
              "Os grupos de agenciamento seguem o padrão do módulo anterior: CAP - EP - Bairro, Cidade, um por bairro, com a foto de capa no padrão.",
            itens: [
              "Grupo é de trabalho: assunto do bairro, não conversa paralela.",
              "Todo imóvel novo entra no grupo do bairro dele.",
            ],
          },
          {
            tipo: "secao",
            titulo: "No atendimento",
            itens: [
              "Responder em minutos — quem procura imóvel está falando com mais de uma imobiliária.",
              "Mandar o link da página do imóvel, não um monte de foto solta.",
              "Confirmar visita no dia anterior e no dia.",
              "Registrar no cadastro o que foi combinado: conversa no WhatsApp não é sistema.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Lista de transmissão pede cuidado",
            texto:
              "Mandar imóvel para quem não pediu é o caminho mais curto para ser bloqueado — e dado de cliente guardado em grupo de WhatsApp não tem controle de acesso nenhum. A LGPD trata contato e preferência de compra como dado pessoal, e a responsabilidade é da imobiliária, inclusive por descuido de corretor.",
          },
        ],
        atencao:
          "Documento de cliente — RG, CPF, comprovante de renda — não fica em grupo nem em conversa. Vai para o sistema, com acesso controlado.",
      },
    ],
  },
  /* ------------------------------------------------------------------ 05 */
  {
    chave: "financiamento",
    numero: "05",
    titulo: "Financiamento",
    tituloCurto: "Financiamento",
    resumo:
      "A maior parte dos im\u00f3veis n\u00e3o se vende \u00e0 vista. Saber o que o banco aceita, e quanto, \u00e9 o que separa a visita \u00fatil da perdida.",
    objetivo:
      "Dizer a um cliente, antes da primeira visita, em que linha ele se enquadra, quanto pode financiar, se pode usar FGTS e que documentos v\u00e3o ser pedidos \u2014 de quem compra, de quem vende e do im\u00f3vel.",
    icone: "apartamento",
    topicos: [
      {
        chave: "sistemas",
        titulo: "Os sistemas de financiamento",
        resumo:
          "MCMV, SFH e SFI. Onde o cliente se encaixa depende da renda dele e do valor do im\u00f3vel.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Todo financiamento habitacional cai em um de tr\u00eas regimes, e n\u00e3o \u00e9 o cliente quem escolhe: \u00e9 a renda dele e o valor do im\u00f3vel que definem. Saber isso de cabe\u00e7a muda a primeira conversa \u2014 em vez de perguntar quanto ele quer gastar, d\u00e1 para dizer quanto ele consegue financiar.",
          },
          {
            tipo: "secao",
            titulo: "Minha Casa Minha Vida",
            texto:
              "O programa do governo, com juros subsidiados. At\u00e9 renda de R$ 13 mil e im\u00f3vel de at\u00e9 R$ 600 mil, conforme a faixa.",
          },
          {
            tipo: "secao",
            titulo: "SBPE \u2014 fora do MCMV",
            texto:
              "O que n\u00e3o cabe no programa vai para o SBPE, onde o financiamento m\u00e1ximo \u00e9 de 80% do valor do im\u00f3vel. Dentro dele h\u00e1 dois sistemas:",
            itens: [
              "SFH, Sistema Financeiro da Habita\u00e7\u00e3o \u2014 im\u00f3veis RESIDENCIAIS de at\u00e9 R$ 2.250.000, prazo m\u00e1ximo de 420 meses, e PERMITE o uso do FGTS.",
              "SFI, Sistema Financeiro Imobili\u00e1rio \u2014 n\u00e3o permite FGTS. \u00c9 onde entram os im\u00f3veis acima do teto do SFH, os comerciais e os terrenos.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Dentro do SFI",
            itens: [
              "Residencial acima de R$ 2.250.000.",
              "Comercial: financia at\u00e9 70% do valor, prazo m\u00e1ximo de 240 meses, e a opera\u00e7\u00e3o gera IOF de 3,17% sobre o valor financiado.",
              "Terreno: financia at\u00e9 80% do valor, prazo m\u00e1ximo de 240 meses.",
            ],
            fonte:
              "O IOF do comercial costuma pegar o cliente de surpresa no fechamento. Em um financiamento de R$ 500 mil s\u00e3o quase R$ 16 mil a mais \u2014 \u00e9 conta para fazer na primeira conversa, n\u00e3o na assinatura.",
          },
          {
            tipo: "fecho",
            titulo: "A pergunta que economiza o dia",
            texto:
              "Antes de marcar visita, duas perguntas resolvem quase tudo: qual a renda familiar e se j\u00e1 tem im\u00f3vel ou financiamento ativo. Com isso d\u00e1 para dizer a linha, o teto e se o FGTS entra. Visita com quem n\u00e3o se enquadra gasta o dia do corretor e a paci\u00eancia do propriet\u00e1rio.",
          },
        ],
        atencao:
          "OS N\u00daMEROS DESTE M\u00d3DULO MUDAM. Faixas de renda, taxas e tetos do MCMV s\u00e3o revistos pelo governo, e o teto do SFH j\u00e1 subiu v\u00e1rias vezes. Antes de citar valor a cliente, conferir no site da Caixa ou com o correspondente banc\u00e1rio \u2014 n\u00famero desatualizado dito com seguran\u00e7a vale menos que \"vou confirmar e te retorno\".",
      },
      {
        chave: "mcmv",
        titulo: "Minha Casa Minha Vida",
        resumo:
          "As quatro faixas, com a taxa, o teto do im\u00f3vel e quanto d\u00e1 para financiar em cada uma.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "As faixas de renda",
            itens: [
              "Faixa 1 \u2014 at\u00e9 R$ 3.200.",
              "Faixa 2 \u2014 de R$ 3.200,01 a R$ 5.000.",
              "Faixa 3 \u2014 de R$ 5.000,01 a R$ 9.600.",
              "Faixa 4 \u2014 de R$ 9.600,01 at\u00e9 R$ 13.000.",
            ],
          },
          {
            tipo: "secao",
            titulo: "As taxas de juros ao ano",
            itens: [
              "Faixa 1 \u2014 entre 4,00% e 5,00%.",
              "Faixa 2 \u2014 entre 5,00% e 6,50%.",
              "Faixa 3 \u2014 entre 7,66% e 8,46%.",
              "Faixa 4 \u2014 10,50%.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O teto do im\u00f3vel",
            itens: [
              "Faixas 1 e 2 \u2014 at\u00e9 R$ 275.000.",
              "Faixa 3 \u2014 at\u00e9 R$ 400.000.",
              "Faixa 4 \u2014 at\u00e9 R$ 600.000.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Quanto se financia",
            itens: [
              "At\u00e9 a faixa 3 \u2014 no m\u00e1ximo 80%, em im\u00f3vel novo ou usado.",
              "Faixa 4 \u2014 no m\u00e1ximo 80% em im\u00f3vel NOVO e 60% em USADO.",
            ],
            fonte:
              "A diferen\u00e7a da faixa 4 pega muita gente: num usado de R$ 600 mil, o cliente precisa ter R$ 240 mil de entrada, n\u00e3o R$ 120 mil. Conferir isso antes de levar \u00e0 visita evita a proposta que n\u00e3o fecha.",
          },
          {
            tipo: "fecho",
            titulo: "A faixa define tr\u00eas coisas ao mesmo tempo",
            texto:
              "Renda, teto do im\u00f3vel e taxa andam juntos. Um cliente de faixa 3 n\u00e3o compra im\u00f3vel de R$ 500 mil pelo programa, mesmo que a presta\u00e7\u00e3o caiba no bolso dele \u2014 ele sai do MCMV e vai para o SBPE, com juros de mercado. \u00c9 outra conta, e outro im\u00f3vel.",
          },
        ],
        atencao:
          "Faixas, taxas e tetos do MCMV mudam por decis\u00e3o do governo. Conferir antes de citar.",
      },
      {
        chave: "fgts",
        titulo: "Uso do FGTS",
        resumo:
          "Seis regras que decidem se o cliente pode usar o fundo \u2014 e basta uma falhar para n\u00e3o poder.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "As regras principais",
            itens: [
              "Valor m\u00e1ximo do im\u00f3vel: R$ 2.250.000.",
              "Ter 3 anos de trabalho com v\u00ednculo ao FGTS \u2014 somados, n\u00e3o necessariamente seguidos.",
              "N\u00e3o possuir outro im\u00f3vel residencial urbano na mesma regi\u00e3o metropolitana onde reside ou exerce a atividade principal.",
              "N\u00e3o possuir financiamento habitacional ativo em qualquer parte do pa\u00eds.",
              "Comprovar v\u00ednculo de trabalho na regi\u00e3o metropolitana onde pretende comprar, ou resid\u00eancia na regi\u00e3o h\u00e1 pelo menos um ano.",
              "O im\u00f3vel n\u00e3o pode ter sido comprado pelo atual propriet\u00e1rio com uso do FGTS h\u00e1 menos de 3 anos.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A \u00faltima regra \u00e9 do IM\u00d3VEL, n\u00e3o do comprador",
            texto:
              "Um cliente pode cumprir tudo e ainda assim n\u00e3o usar o FGTS, porque quem vende comprou com fundo h\u00e1 menos de tr\u00eas anos. Isso se descobre na matr\u00edcula e na conversa com o propriet\u00e1rio \u2014 na capta\u00e7\u00e3o, n\u00e3o na an\u00e1lise do banco.",
          },
        ],
        atencao:
          "No SFI o FGTS N\u00c3O pode ser usado. Im\u00f3vel acima de R$ 2.250.000, comercial ou terreno ficam fora, por mais que o cliente tenha saldo.",
      },
      {
        chave: "documentos-comprador",
        titulo: "Documentos do comprador",
        resumo:
          "O que pedir ao cliente para abrir a an\u00e1lise de cr\u00e9dito.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Pessoais",
            itens: [
              "Carteira de Identidade ou CNH \u2014 o documento mais recente \u2014 ou Identidade Profissional.",
              "Prova de estado civil: certid\u00e3o de nascimento, certid\u00e3o de casamento com pacto antenupcial se houver, ou escritura p\u00fablica de uni\u00e3o est\u00e1vel.",
              "Comprovante de endere\u00e7o atualizado: luz, \u00e1gua, telefone, cart\u00e3o de cr\u00e9dito.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Comprovantes de renda aceitos",
            itens: [
              "Os dois \u00faltimos contracheques.",
              "Pr\u00f3-labore, no caso de empres\u00e1rio.",
              "Extrato de benef\u00edcio previdenci\u00e1rio.",
              "Extrato de aplica\u00e7\u00f5es financeiras.",
              "Contrato de aluguel com comprovante de propriedade do im\u00f3vel \u2014 matr\u00edcula ou IPTU. Se o aluguel constar na declara\u00e7\u00e3o de imposto de renda, essa comprova\u00e7\u00e3o n\u00e3o \u00e9 necess\u00e1ria.",
              "Declara\u00e7\u00e3o de Imposto de Renda completa, com o recibo de entrega.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Peça a documenta\u00e7\u00e3o na ordem certa",
            texto:
              "Documento de renda antes da visita assusta e parece invas\u00e3o; depois da proposta aceita, atrasa tudo. O meio-termo \u00e9 abrir a an\u00e1lise de cr\u00e9dito assim que o cliente demonstrar interesse real \u2014 o banco leva o tempo dele, e esse \u00e9 o prazo que ningu\u00e9m encurta.",
          },
        ],
        atencao:
          "Documento de cliente \u00e9 dado pessoal sens\u00edvel. Vai para o sistema com acesso controlado, n\u00e3o para grupo de WhatsApp nem pasta compartilhada (LGPD, Lei 13.709/18).",
      },
      {
        chave: "documentos-vendedor",
        titulo: "Documentos do vendedor e do im\u00f3vel",
        resumo:
          "O outro lado da an\u00e1lise. \u00c9 aqui que o processo trava quando ningu\u00e9m conferiu antes.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Vendedor pessoa f\u00edsica",
            itens: [
              "Carteira de Identidade com menos de 10 anos de emiss\u00e3o, ou CNH.",
              "Prova de estado civil: certid\u00e3o de nascimento ou de casamento, com pacto antenupcial se houver.",
              "Comprovante de endere\u00e7o atualizado.",
              "Telefone e e-mail.",
              "Havendo procura\u00e7\u00e3o: a procura\u00e7\u00e3o, mais identidade com menos de 10 anos ou CNH e comprovante de endere\u00e7o do procurador.",
              "Conta para cr\u00e9dito do valor financiado \u2014 precisa ser na Caixa.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Vendedor pessoa jur\u00eddica",
            itens: [
              "C\u00f3pia do cart\u00e3o CNPJ.",
              "Contrato social e altera\u00e7\u00f5es registradas, no caso de Ltda; ou estatuto social e ata da elei\u00e7\u00e3o da \u00faltima diretoria publicados no Di\u00e1rio Oficial, no caso de S.A.",
              "Documentos pessoais dos s\u00f3cios: RG, CPF e comprovante de endere\u00e7o.",
              "Telefone e e-mail.",
              "Certid\u00e3o simplificada da Junta Comercial.",
              "Conta para cr\u00e9dito do valor financiado.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Im\u00f3vel usado",
            itens: [
              "Certid\u00e3o atualizada de inteiro teor da matr\u00edcula do Registro de Im\u00f3veis \u2014 apartamento e garagem \u2014 com negativa de \u00f4nus e reipersecut\u00f3ria.",
              "Declara\u00e7\u00e3o de quita\u00e7\u00e3o do condom\u00ednio, quando houver.",
              "Negativa de IPTU.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Im\u00f3vel novo",
            texto: "Tudo o que o usado pede, mais:",
            itens: [
              "ARTs de projeto e de execu\u00e7\u00e3o.",
              "Alvar\u00e1 de constru\u00e7\u00e3o.",
              "C\u00f3pia do documento do CREA do respons\u00e1vel t\u00e9cnico.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A garagem tem matr\u00edcula pr\u00f3pria",
            texto:
              "\u00c9 o esquecimento mais comum da lista: pedir a matr\u00edcula do apartamento e descobrir, j\u00e1 na an\u00e1lise, que a vaga tem matr\u00edcula separada e ningu\u00e9m providenciou. Conferir isso na capta\u00e7\u00e3o custa cinco minutos.",
          },
        ],
      },
      {
        chave: "terreno-construcao",
        titulo: "Terreno e constru\u00e7\u00e3o",
        resumo:
          "Quando o cliente compra o lote e constr\u00f3i. Outro produto, outro limite, outra planilha.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "Financiamento de terreno",
            itens: [
              "Entra no SFI: financia at\u00e9 80% do valor, com prazo m\u00e1ximo de 240 meses.",
              "N\u00e3o permite uso do FGTS.",
              "Conferir se o lote est\u00e1 individualizado na matr\u00edcula \u2014 fra\u00e7\u00e3o de gleba n\u00e3o financia.",
              "Zoneamento e restri\u00e7\u00f5es ambientais pesam na an\u00e1lise, porque definem o que se pode construir.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Constru\u00e7\u00e3o individual",
            texto:
              "Quando o cliente j\u00e1 tem o terreno e financia a obra, a Caixa libera o dinheiro por etapa, conforme a medi\u00e7\u00e3o do que foi constru\u00eddo. O or\u00e7amento vai numa planilha pr\u00f3pria \u2014 a PCI, Planilha de Constru\u00e7\u00e3o Individual \u2014 assinada por respons\u00e1vel t\u00e9cnico.",
            itens: [
              "Projeto aprovado na prefeitura e alvar\u00e1 de constru\u00e7\u00e3o.",
              "ART ou RRT do respons\u00e1vel t\u00e9cnico.",
              "Or\u00e7amento e cronograma na planilha da Caixa.",
              "Matr\u00edcula do terreno em nome do proponente, livre de \u00f4nus.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Aqui a engenharia do grupo entra como produto",
            texto:
              "Constru\u00e7\u00e3o individual exige projeto, respons\u00e1vel t\u00e9cnico, or\u00e7amento em planilha e medi\u00e7\u00e3o de obra \u2014 tudo o que a Tridium Engenharia j\u00e1 faz. Um cliente que compra terreno pela imobili\u00e1ria pode construir com o grupo, e o corretor que enxerga isso vende duas vezes.",
          },
        ],
        cards: [
          {
            chave: "pci-planilha",
            titulo: "PCI \u2014 Planilha de Constru\u00e7\u00e3o Individual",
            descricao:
              "A planilha da Caixa para or\u00e7amento e cronograma de constru\u00e7\u00e3o individual, preenchida pelo respons\u00e1vel t\u00e9cnico.",
            tipo: "ferramenta",
            href: "/materiais/pci-planilha-construcao-individual.xlsb",
          },
        ],
      },
    ],
  },

  {
    chave: "atendimento",
    numero: "06",
    titulo: "Atendimento",
    resumo:
      "Do primeiro contato do interessado até a visita. É aqui que a maior parte dos negócios se perde, por demora.",
    objetivo:
      "Receber um lead, qualificar pagamento antes de marcar visita, conduzir a visita e fazer o retorno no mesmo dia, com tudo registrado.",
    icone: "aluguel",
    topicos: [
      {
        chave: "lead",
        titulo: "Recebimento e qualificação do lead",
        resumo:
          "Responder rápido vale mais que responder bem. Quem procura imóvel está falando com mais de uma imobiliária.",
        passos: [
          "Responder em minutos, não em horas.",
          "Cadastrar: nome, contato, origem do lead e imóvel de interesse.",
          "Qualificar: para morar ou investir, prazo, forma de pagamento, se tem imóvel para vender antes.",
          "Se for financiamento, verificar a capacidade de crédito antes de agendar visita.",
          "Registrar o perfil de busca para o cruzamento futuro.",
        ],
        atencao:
          "Visita com quem não tem crédito aprovado gasta o dia do corretor e a paciência do proprietário. A pergunta sobre pagamento vem antes da visita, não depois.",
      },
      {
        chave: "visita",
        titulo: "Visita ao imóvel",
        resumo:
          "A visita é conduzida, não é um passeio. Ordem dos ambientes e tempo de silêncio fazem diferença.",
        passos: [
          "Confirmar com o cliente e com quem dá acesso, no dia anterior e no dia.",
          "Chegar antes: abrir janelas, acender luzes, conferir o estado.",
          "Começar pelo ambiente mais forte e terminar por ele.",
          "Deixar o cliente andar sozinho em algum momento.",
          "Registrar objeções e o que ele comparou.",
          "Fazer o retorno no mesmo dia.",
        ],
        cards: [
          {
            chave: "roteiro-visita",
            titulo: "Roteiro de visita",
            descricao:
              "O que conferir antes, a ordem dos ambientes, as perguntas de qualificação e o formulário de retorno.",
            tipo: "modelo",
          },
        ],
      },
      {
        chave: "seguimento",
        titulo: "Acompanhamento",
        resumo:
          "Negócio que não fecha na hora fecha no seguimento. Sem registro, ele não acontece.",
        passos: [
          "Retorno em 24 horas após cada visita.",
          "Manter o cliente na carteira com o perfil de busca ativo.",
          "Avisar quando entrar imóvel no perfil dele.",
          "Registrar cada contato, com data e o que foi dito.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 08 */
  {
    chave: "negociacao",
    numero: "07",
    titulo: "Negociação",
    resumo:
      "Da proposta ao aceite. Tudo por escrito, inclusive o que foi recusado.",
    objetivo:
      "Colher proposta por escrito com prazo de validade, levar ao proprietário com comparativo na mão e conduzir até o aceite sem deixar combinado verbal.",
    icone: "permuta",
    topicos: [
      {
        chave: "proposta",
        titulo: "Proposta e contraproposta",
        resumo:
          "Proposta verbal não existe. O que não está escrito vira discussão na assinatura.",
        passos: [
          "Colher a proposta por escrito, com valor, forma de pagamento e prazo de validade.",
          "Registrar condições: o que fica, o que sai, reformas pedidas, data de entrega.",
          "Levar ao proprietário com o comparativo de mercado na mão.",
          "Registrar a contraproposta e o aceite ou recusa, com data.",
          "Confirmado o aceite, suspender as visitas e sinalizar o imóvel como reservado.",
        ],
        atencao:
          "Prazo de validade na proposta protege os dois lados. Sem ele, o comprador fica preso e o vendedor segura o imóvel esperando algo melhor.",
        cards: [
          {
            chave: "modelo-proposta",
            titulo: "Modelo de proposta",
            descricao:
              "Formulário com valor, condições, prazo de validade e espaço para contraproposta.",
            tipo: "modelo",
          },
        ],
      },
      {
        chave: "credito",
        titulo: "Análise de crédito e financiamento",
        resumo:
          "O banco manda no prazo. Começar cedo é a única forma de encurtar.",
        passos: [
          "Orientar o cliente a abrir a análise de crédito no banco.",
          "Reunir a documentação pessoal e de renda.",
          "Acompanhar a aprovação e o valor liberado.",
          "Agendar a avaliação do imóvel pelo banco.",
          "Conferir se a avaliação do banco cobre o valor negociado.",
        ],
        atencao:
          "A avaliação do banco costuma vir abaixo do negociado. A diferença sai do bolso do comprador — avisar isso antes evita o negócio cair no fim.",
      },
      {
        chave: "sinal",
        titulo: "Sinal e reserva",
        resumo: "O sinal tira o imóvel do mercado. Precisa estar claro o que acontece se o negócio cair.",
        passos: [
          "Definir o valor do sinal e quem o guarda.",
          "Escrever o que acontece em caso de desistência de cada lado.",
          "Emitir o recibo com a destinação do valor.",
        ],
        exigencia:
          "Arras confirmatórias e penitenciais têm efeitos diferentes (Código Civil, arts. 417 a 420). O contrato precisa dizer qual é.",
      },
    ],
  },

  {
    chave: "contrato",
    numero: "08",
    titulo: "Documentação e contrato",
    tituloCurto: "Documentação",
    resumo:
      "Reunir certidões, redigir o contrato e assinar. A etapa mais técnica e a que mais derruba negócio.",
    objetivo:
      "Saber quais certidões pedir e por quê, ler uma matrícula procurando o que anula a venda, e reconhecer as garantias válidas de locação.",
    icone: "comercial",
    topicos: [
      {
        chave: "certidoes",
        titulo: "Certidões",
        resumo:
          "Buscar o que pode anular a venda depois. Comprador que não exige certidão corre risco de perder o imóvel.",
        passos: [
          "Do imóvel: matrícula atualizada, negativa de IPTU, negativa de condomínio.",
          "Do vendedor pessoa física: certidões cíveis, trabalhistas, federais e de protesto, nas comarcas onde morou.",
          "Do vendedor pessoa jurídica: certidões da empresa e dos sócios.",
          "Conferir se há penhora, usufruto, hipoteca ou alienação fiduciária na matrícula.",
        ],
        atencao:
          "Venda feita por quem tem dívida pode ser desfeita por fraude à execução, mesmo anos depois. A certidão não é burocracia, é o que protege o comprador.",
      },
      {
        chave: "contrato-venda",
        titulo: "Contrato de compra e venda",
        resumo:
          "O contrato registra o que foi combinado, inclusive o que parece óbvio.",
        passos: [
          "Qualificação completa das partes e do imóvel, com número de matrícula.",
          "Preço, forma e datas de pagamento.",
          "Prazo e condições de entrega das chaves.",
          "Quem paga ITBI, escritura e registro.",
          "O que acontece se qualquer lado descumprir.",
          "Revisão jurídica antes da assinatura.",
        ],
      },
      {
        chave: "garantias-locacao",
        titulo: "Garantias da locação",
        resumo:
          "Na locação, a garantia é o que separa um contrato tranquilo de uma ação de despejo.",
        passos: [
          "Escolher a modalidade: fiador, seguro-fiança, caução ou título de capitalização.",
          "Fiador: análise de crédito, comprovação de imóvel e anuência do cônjuge.",
          "Seguro-fiança: aprovação da seguradora antes da assinatura.",
          "Caução: limite de três aluguéis, em conta poupança vinculada.",
        ],
        exigencia:
          "A Lei do Inquilinato (8.245/91, art. 37, parágrafo único) proíbe mais de uma modalidade de garantia no mesmo contrato. Exigir duas torna a cláusula nula.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 09 */
  {
    chave: "fechamento",
    numero: "09",
    titulo: "Fechamento",
    resumo:
      "Escritura, registro e chaves. Só existe transferência de propriedade com registro na matrícula.",
    objetivo:
      "Conduzir ITBI, escritura e registro sem surpresa de prazo nem de valor, e entregar as chaves com termo assinado.",
    icone: "aluguel",
    topicos: [
      {
        chave: "itbi-escritura",
        titulo: "ITBI e escritura",
        resumo:
          "O cartório não lavra a escritura sem o ITBI pago.",
        passos: [
          "Calcular e recolher o ITBI na prefeitura.",
          "Agendar a lavratura no cartório de notas.",
          "Conferir a minuta antes da assinatura.",
          "Assinatura das partes com documentos originais.",
        ],
        atencao:
          "Em Florianópolis o ITBI é calculado sobre o valor venal de referência, que pode ser maior que o preço negociado. Calcular antes evita surpresa no fechamento.",
      },
      {
        chave: "registro",
        titulo: "Registro e entrega",
        resumo:
          "Escritura assinada ainda não transfere o imóvel. Quem registra é dono.",
        passos: [
          "Levar a escritura ao cartório de registro de imóveis da circunscrição.",
          "Acompanhar o registro e retirar a matrícula atualizada.",
          "Vistoria final e leitura de medidores.",
          "Entrega das chaves com termo assinado.",
          "Orientar a transferência de água, luz e IPTU.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 10 */
  {
    chave: "locacao",
    numero: "10",
    titulo: "Rotina de locação",
    tituloCurto: "Locação",
    resumo:
      "O que acontece todo mês depois que o inquilino entra. É receita recorrente e é onde mora o atrito.",
    objetivo:
      "Tocar a rotina mensal de um contrato: vistoria que serve de prova, repasse no prazo, reajuste na data e inadimplência atacada no primeiro atraso.",
    icone: "condominio",
    topicos: [
      {
        chave: "vistorias",
        titulo: "Vistoria de entrada e de saída",
        resumo:
          "A vistoria é a prova do estado do imóvel. Sem ela, qualquer discussão na saída é palavra contra palavra.",
        passos: [
          "Vistoria de entrada com foto de cada ambiente e de cada defeito.",
          "Registrar leitura dos medidores e número de chaves entregues.",
          "Assinatura do laudo pelas duas partes, anexo ao contrato.",
          "Vistoria de saída comparando com o laudo de entrada.",
          "Orçamento dos reparos devidos, antes de devolver a garantia.",
        ],
        atencao:
          "Foto sem data e sem assinatura não serve de prova. O laudo precisa ser anexo do contrato, assinado junto.",
      },
      {
        chave: "repasse",
        titulo: "Recebimento e repasse",
        resumo:
          "O dinheiro do proprietário passa pela imobiliária. Atraso aqui quebra a confiança na hora.",
        passos: [
          "Emitir o boleto com antecedência.",
          "Conferir o recebimento na data.",
          "Descontar a taxa de administração e repassar ao proprietário no prazo combinado.",
          "Emitir o demonstrativo mensal.",
          "Repassar condomínio e IPTU quando a imobiliária for responsável.",
        ],
      },
      {
        chave: "reajuste",
        titulo: "Reajuste e renovação",
        resumo:
          "Reajuste tem data e índice definidos em contrato. Esquecer custa um ano de defasagem.",
        passos: [
          "Controlar o aniversário de cada contrato.",
          "Aplicar o índice contratado e avisar o inquilino com antecedência.",
          "Sondar as duas partes sobre renovação com três meses de folga.",
          "Formalizar o aditivo ou iniciar a desocupação.",
        ],
        exigencia:
          "Reajuste anual é o período mínimo legal (Lei 9.069/95, art. 28). Cláusula com prazo menor é nula.",
      },
      {
        chave: "inadimplencia",
        titulo: "Inadimplência",
        resumo:
          "Agir no primeiro atraso. Dívida de aluguel cresce rápido e raramente se recupera.",
        passos: [
          "Contato no dia seguinte ao vencimento.",
          "Notificação escrita no segundo atraso.",
          "Acionar a garantia conforme a modalidade.",
          "Negociar acordo com prazo curto.",
          "Encaminhar ao jurídico quando o acordo não for cumprido.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 11 */
  {
    chave: "administrativo",
    numero: "11",
    titulo: "Administrativo e financeiro",
    tituloCurto: "Administrativo",
    resumo:
      "Comissão, nota fiscal e conciliação. Corre em paralelo a todas as etapas.",
    objetivo:
      "Calcular e dividir a comissão pela regra da casa, emitir nota e fechar o mês com a conciliação conferida.",
    icone: "apartamento",
    topicos: [
      {
        chave: "comissao",
        titulo: "Comissão",
        resumo:
          "Quem recebe quanto, e quando. Acertar antes evita a conversa ruim depois do fechamento.",
        passos: [
          "Conferir o percentual na autorização de venda assinada.",
          "Dividir entre captador, vendedor e imobiliária conforme a regra da casa.",
          "Emitir a nota fiscal de serviço.",
          "Pagar na data combinada, após a confirmação do recebimento.",
        ],
        exigencia:
          "A comissão é devida com o resultado útil da intermediação, ainda que o negócio se desfaça depois por arrependimento das partes (Código Civil, art. 725).",
      },
      {
        chave: "conciliacao",
        titulo: "Conciliação e prestação de contas",
        resumo:
          "Dinheiro de terceiro passando pela conta da imobiliária exige conta separada e extrato claro.",
        passos: [
          "Conciliar diariamente recebimentos e repasses.",
          "Emitir demonstrativo mensal por proprietário.",
          "Guardar comprovante de todo repasse.",
          "Fechar o mês e conferir as pendências antes do dia 5.",
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 12 */
  {
    chave: "juridico",
    numero: "12",
    titulo: "Jurídico e conformidade",
    tituloCurto: "Jurídico",
    resumo:
      "O que mantém a imobiliária em funcionamento e fora de processo.",
    objetivo:
      "Reconhecer o que mantém a imobiliária regular — CRECI ativo e visível, LGPD respeitada — e identificar quando a conversa precisa ir para o jurídico.",
    icone: "esquina",
    topicos: [
      {
        chave: "creci",
        titulo: "Registro no CRECI",
        resumo:
          "Sem registro não se pode intermediar imóvel. É o item mais básico e o mais esquecido na comunicação.",
        passos: [
          "Manter o registro da pessoa jurídica ativo no CRECI-SC.",
          "Manter o registro de cada corretor da equipe ativo.",
          "Exibir o número do CRECI no site, nas placas e em toda peça publicitária.",
          "Ter responsável técnico registrado.",
        ],
        exigencia:
          "Exercer a profissão sem registro é contravenção (Lei 6.530/78). Anunciar sem o número do CRECI sujeita a multa do conselho (Resolução COFECI 492/2007).",
        atencao:
          "PENDENTE NO SITE: o número do CRECI ainda não aparece em nenhuma página da Tridium Imóveis.",
      },
      {
        chave: "lgpd",
        titulo: "Proteção de dados",
        resumo:
          "A imobiliária coleta documento, renda e endereço de gente que nem virou cliente. Isso é dado pessoal sensível.",
        passos: [
          "Coletar só o que a etapa exige — documento de renda antes da proposta, não antes da visita.",
          "Guardar em sistema com acesso controlado, não em grupo de WhatsApp.",
          "Apagar o que não for mais necessário.",
          "Ter política de privacidade publicada e aviso de cookies no site.",
          "Registrar o consentimento para contato de marketing.",
        ],
        exigencia:
          "LGPD (Lei 13.709/18). Vazamento de documento de cliente gera responsabilidade da imobiliária, inclusive por descuido de corretor.",
      },
    ],
  },
];

/** Quantos tópicos existem no mapa inteiro. */
export function totalTopicos(): number {
  return procedimentos.reduce((n, e) => n + e.topicos.length, 0);
}

/** Os cards declarados que ainda não têm arquivo. */
export function cardsPendentes(): { etapa: string; card: CardProcedimento }[] {
  const lista: { etapa: string; card: CardProcedimento }[] = [];
  for (const etapa of procedimentos) {
    for (const topico of etapa.topicos) {
      for (const card of topico.cards ?? []) {
        if (!card.href) lista.push({ etapa: etapa.titulo, card });
      }
    }
  }
  return lista;
}

/* -----------------------------------------------------------------------------
   PERFIL DO CORRETOR
   -----------------------------------------------------------------------------
   Quem está estudando. Aparece ao lado do treinamento, e é também onde o
   CRECI do corretor fica visível para ele mesmo — o registro vence, e o
   primeiro a notar tem de ser quem depende dele.

   ⚠ HOJE É UM SÓ, o do acesso de teste, com os campos marcados como
   pendentes. Quando houver banco de dados e login de verdade, cada corretor
   terá o seu e `perfilDoUsuario` passa a buscar lá em vez de devolver este.

   `atuaDesde` é um ANO, não um texto como "8 anos de mercado": texto
   envelhece sozinho e ninguém lembra de atualizar. O tempo é calculado na
   hora em que a página abre.
   ----------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
   METAS
   -----------------------------------------------------------------------------
   Meta sem forma de conferir e desejo. Cada meta traz o alvo e o periodo, e o
   corretor marca na tela o que ja fez; a contagem zera sozinha quando a semana
   vira.

   `alvo: null` e meta declarada mas ainda sem numero. Ela aparece como "a
   definir", em vez de sumir: o que falta decidir fica a vista de quem decide.
   ----------------------------------------------------------------------------- */

export interface MetaCorretor {
  chave: string;
  rotulo: string;
  /** Quantos, no periodo. `null` enquanto o numero nao estiver definido. */
  alvo: number | null;
  periodo: "semana" | "mes";
  /** O que conta como um. Sem isso a meta vira discussao no fim do mes. */
  criterio?: string;
}

export interface PerfilCorretor {
  usuario: string;
  nome: string;
  cargo: string;
  /** Caminho da foto em /public. Sem ela, entram as iniciais. */
  foto?: string;
  /** Número de inscrição no CRECI, com a seccional. */
  creci: string;
  /** Formação, curso técnico, CNAI — o que couber. */
  formacao: string[];
  /** Ano em que começou no mercado imobiliário. */
  atuaDesde: number | null;
  /** Bairros ou regiões em que trabalha. */
  atuacao?: string;
  /** As metas do corretor, com o acompanhamento da semana. */
  metas?: MetaCorretor[];
}

const PENDENTE = "[PENDENTE]";

export const perfisCorretor: PerfilCorretor[] = [
  {
    usuario: "admin",
    nome: "Francis Michel",
    cargo: "Corretor de imóveis",
    /* Recorte quadrado do retrato, centrado no rosto. O avatar e redondo e
       pequeno: a foto inteira apenas reduzida deixaria a cabeça do tamanho
       de um grão dentro do círculo. */
    foto: "/img/equipe/francis-michel.webp",
    /* [A CONFIRMAR] a seccional do registro. O número veio sem ela, e
       CRECI-RS e CRECI-SC são conselhos diferentes: quem atua em outro
       estado precisa de inscrição secundária. Como ele vem da Sinos, que
       é do Vale dos Sinos, o mais provável é RS. */
    creci: "41587",
    formacao: [
      "Técnico em Transações Imobiliárias",
      "Tecnólogo em Gestão Imobiliária",
      "Perito Avaliador",
      "MBA em Marketing e Vendas",
      "Pós-graduação em Gestão de Pessoas",
    ],
    atuaDesde: 2011,
    /* [EXEMPLO] Duas metas, para o formato ficar de pe. A de agenciamento
       veio do cliente; a de vendas ainda nao tem numero, e por isso aparece
       como "a definir" em vez de sumir da tela. */
    metas: [
      {
        chave: "agenciamento",
        rotulo: "Agenciamentos",
        alvo: 2,
        periodo: "semana",
        criterio:
          "Conta im\u00f3vel com autoriza\u00e7\u00e3o assinada e cadastrado na carteira \u2014 visita de avalia\u00e7\u00e3o sem assinatura n\u00e3o conta.",
      },
      {
        chave: "vendas",
        rotulo: "Vendas",
        alvo: null,
        periodo: "mes",
      },
    ],
  },
];

export function perfilDoUsuario(usuario: string): PerfilCorretor {
  const achado = perfisCorretor.find((p) => p.usuario === usuario);
  if (achado) return achado;

  /* Usuário sem perfil cadastrado não derruba a página: ele ganha um perfil
     vazio com o próprio nome de acesso. */
  return {
    usuario,
    nome: usuario,
    cargo: "Corretor de imóveis",
    creci: PENDENTE,
    formacao: [PENDENTE],
    atuaDesde: null,
  };
}

/** "8 anos de mercado", contado do ano de início até hoje. */
export function tempoDeMercado(atuaDesde: number | null): string | null {
  if (!atuaDesde) return null;
  const anos = new Date().getFullYear() - atuaDesde;
  if (anos < 1) return "primeiro ano de mercado";
  return `${anos} ${anos === 1 ? "ano" : "anos"} de mercado`;
}

/** As iniciais, para o lugar da foto. "Ana Paula Souza" → "AS". */
export function iniciaisDe(nome: string): string {
  const partes = nome
    .replace(/\[.*?\]/g, "")
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 2);
  if (partes.length === 0) return "?";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
