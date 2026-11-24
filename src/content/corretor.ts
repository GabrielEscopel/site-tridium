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

/* [TESTE] Trocar antes de qualquer uso real. Ver o aviso acima.
 *
 *  A senha deixou de ser "admin" porque a versao de demonstracao circula: o
 *  palpite obvio agora nao abre nada. ISSO NAO E SEGURANCA — a conferencia
 *  continua no navegador e a senha continua viajando dentro do arquivo que o
 *  navegador baixa, longa ou curta. O que mudou e so a barreira contra quem
 *  chega e tenta o obvio; contra quem abre as ferramentas de desenvolvedor,
 *  nada mudou. O conserto de verdade esta descrito no aviso acima. */
export const credencialTeste = {
  usuario: "admin",
  senha: "TridiumSinos2026@",
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
      /** `cheia` ocupa a coluna inteira, em vez dos 70% padrao.
       *
       *  Os 70% existem para a imagem nao virar o centro da aula quando ela e
       *  apoio do texto. Num card denso — tres colunas de itens, passo a passo
       *  numerado, exemplo de nome de grupo — e o contrario: o card E a aula, e
       *  a 70% a letra dele fica pequena demais para ler na tela. */
      largura?: "cheia";
    }
  /** Clausula de contrato, com a traducao embaixo.
   *
   *  Existe porque contrato tem um problema proprio: quem precisa cumprir a
   *  clausula nao e quem a escreveu. O corretor que vai registrar a indicacao
   *  por escrito nao le "nexo com a indicacao e participacao efetiva na
   *  aproximacao comercial" e entende o que tem de fazer na segunda-feira.
   *
   *  Por isso os dois textos andam SEMPRE juntos e nesta ordem: `texto` diz o
   *  que o contrato diz, e `simples` diz o que isso significa no dia. Um sem o
   *  outro e meio trabalho — so o tecnico nao e lido, so o simples nao vale
   *  numa discussao. */
  | {
      tipo: "clausula";
      /** Como a clausula e chamada no contrato: "PRIMEIRA", "DECIMA SEGUNDA". */
      numero: string;
      titulo: string;
      /** O que a clausula determina, em linguagem tecnica. */
      texto: string;
      /** Os paragrafos, quando a clausula tiver. */
      itens?: string[];
      /** A mesma coisa, em portugues de conversa. */
      simples: string;
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
    /* Mesma moldura do modulo 01: quadrada, ao lado do texto.

       A capa anterior mostrava os corretores posados, de frente, sozinhos:
       o uniforme sem o trabalho em volta. Esta mostra o momento que o
       modulo descreve — o corretor recebendo os clientes na entrada do
       condominio, de camisa oficial, cordao e cracha a vista, com o
       aperto de mao acontecendo. Casa com o resumo do modulo, que fala
       dos 100 milissegundos do primeiro encontro.

       Recorte quadrado de 941px na altura nativa, a partir de x=365. Dos
       quatro enquadramentos testados, e o unico que cabe os tres ao mesmo
       tempo: a cliente sorrindo, o aperto de mao e o corretor inteiro com
       a marca no peito. Mais a direita, a cliente vira uma lasca; mais a
       esquerda, a marca do corretor fica cortada na borda. */
    imagem: {
      src: "/img/treinamento/apresentacao-corretor-cliente.webp",
      alt: "Corretor de camisa oficial da Tridium Imóveis, com cordão e crachá, cumprimentando clientes na entrada de um condomínio",
      descricao: "O primeiro encontro, no padrão da casa",
    },
    topicos: [
      {
        chave: "imagem-profissional",
        titulo: "Imagem profissional",
        resumo:
          "O cuidado pessoal, o uniforme e o crachá — tudo o que o cliente registra antes de ouvir a primeira frase.",
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
            src: "/img/treinamento/apresentacao-certo-errado.webp",
            alt: "Dois painéis lado a lado. Certo: corretor de uniforme da Tridium Imóveis, crachá visível, postura aberta, conversando com os clientes. Errado: o mesmo cenário com camiseta fora do padrão, sem crachá, postura desleixada e papéis soltos debaixo do braço",
            legenda:
              "O mesmo corretor, o mesmo cliente, o mesmo imóvel — e duas conversas diferentes.",
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
          /* O uniforme e o cracha vinham numa aula separada, "Vestuario e
             identificacao", que repetia esta: o card do certo contra errado,
             logo acima, ja lista "uniforme alinhado" e "cracha visivel", e a
             aula seguinte abria com os mesmos dois itens em texto. O que ela
             tinha de proprio — onde o cracha fica, o que o corretor carrega,
             e a exigencia legal do CRECI — entrou aqui. A divisao agora e por
             assunto, nao por repeticao: o corpo, a roupa, o que vai na mao. */
          {
            tipo: "secao",
            titulo: "O uniforme e o crachá",
            texto:
              "O crachá vale mais para quem vai abrir a porta do que para quem vai entrar. Por isso ele fica à vista desde a calçada, no peito e não no bolso: é o que separa o corretor de qualquer um que bate à campainha.",
            itens: [
              "Camisa oficial da imobiliária, limpa e alinhada.",
              "Crachá de identificação no peito, legível de longe.",
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
            tipo: "secao",
            titulo: "Por que isso pesa mais aqui do que em outras profissões",
            texto:
              "O cliente vai entregar a um desconhecido a negociação do maior bem que tem, e muitas vezes vai recebê-lo dentro de casa. Na falta de outra informação, ele usa o que vê. Cuidado com a aparência não é vaidade: é o primeiro sinal de que a pessoa cuida também do que não se vê — do contrato, do prazo, da documentação.",
          },
        ],
        exigencia:
          "O número de inscrição no CRECI é obrigatório no material de identificação e em toda peça publicitária do corretor (Lei 6.530/78; Resolução COFECI 492/2007).",
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
        chave: "carro",
        titulo: "Carro",
        resumo:
          "Em muitas visitas ele é a primeira sala de reunião, e às vezes a única.",
        passos: [],
        conteudo: [
          /* Sem `legenda` e sem a secao "O padrao": o card ja traz os quatro
             itens escritos dentro dele, e a legenda so repetia o titulo que
             esta na tarja verde. Repetir em texto o que a imagem diz nao
             reforca — faz a aula parecer mais longa do que e. O que sobra
             aqui e o que o card NAO diz: o uso do carro na visita. */
          {
            tipo: "imagem",
            src: "/img/treinamento/apresentacao-veiculo.webp",
            alt: "Veículo da Tridium Imóveis com a marca aplicada na porta, ao lado da lista de cuidados com o carro: limpo por dentro e por fora, organizado e sem objetos soltos, manutenção em dia com revisões, pneus e itens de segurança",
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

  /* ---------------------------------------------------------------------
     03 ABORDAGEM COMERCIAL
     Entra antes do Agenciamento porque e o que vem antes dele na pratica: o
     corretor precisa saber falar com alguem para depois conseguir o imovel.
     Captar um empreendimento, pedir autorizacao de venda e marcar visita sao
     todos primeiros contatos — e ate aqui o treinamento ensinava o QUE fazer
     sem nunca dizer COMO abrir a conversa.

     As quatro aulas sao os quatro canais por onde a casa aborda. Cada uma traz
     um padrao de abertura, porque padronizar e o ponto: o cliente tem de
     receber a mesma impressao venha ele de qual corretor vier.
     --------------------------------------------------------------------- */
  {
    chave: "abordagem",
    numero: "03",
    titulo: "Abordagem comercial",
    tituloCurto: "Abordagem",
    resumo:
      "O primeiro contato não é conversa fiada antes do trabalho. É o trabalho: é nele que o cliente decide se responde.",
    objetivo:
      "Abrir uma conversa por e-mail, WhatsApp, Instagram ou pessoalmente dentro do padrão da casa — dizendo quem é, de onde veio o contato e o que quer, em poucas linhas — e saber quando parar.",
    icone: "permuta",
    /* Recorte quadrado a partir de x=119, na altura nativa. Dos quatro
       enquadramentos testados, e o unico que cabe os tres rostos inteiros E o
       corretor completo com a marca no peito e o cracha a vista. Mais a
       esquerda, o gesto do braco se perde; mais a direita, o cliente da ponta
       fica cortado pela metade — e a aula de abordagem pessoal fala
       justamente de quem esta sendo abordado, nao so de quem aborda. */
    imagem: {
      src: "/img/treinamento/abordagem-comercial.webp",
      alt: "Corretor de camisa oficial da Tridium Imóveis, com cordão e crachá, apontando algo para um casal de clientes na entrada de um imóvel",
      descricao: "A conversa que começa antes da visita",
    },
    topicos: [
      {
        chave: "email",
        titulo: "E-mail",
        resumo:
          "O canal que deixa registro, aguenta anexo e chega a quem não responde WhatsApp.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "E-mail parece canal morto até aparecer uma proposta para formalizar, um síndico para notificar, um casal que decide junto e precisa reencaminhar para o outro, ou um cliente de empresa que só lê o que chega na caixa corporativa. Ele é o único canal em que o que foi dito fica registrado com data, e isso vale tanto a favor quanto contra.",
          },
          {
            tipo: "secao",
            titulo: "O assunto decide se vai ser aberto",
            texto:
              "O padrão da casa é sempre o mesmo, para o cliente reconhecer o remetente antes de abrir.",
            itens: [
              "Imóvel [código] — [tipo, dormitórios] no [bairro] | Tridium Imóveis.",
              "Nada de \"Oportunidade imperdível\" ou \"Você precisa ver isso\": é o que o filtro de spam procura.",
              "Um assunto, um e-mail. Dois imóveis diferentes são dois e-mails.",
            ],
          },
          {
            tipo: "secao",
            titulo: "A estrutura, em quatro partes",
            itens: [
              "Quem é você e de onde veio o contato — a primeira linha, sempre.",
              "O motivo, em até três linhas. Quem precisa rolar a tela já desistiu.",
              "UM pedido só: responder, marcar visita, confirmar um dado. Dois pedidos viram zero.",
              "Assinatura com nome, CRECI, telefone e a imobiliária.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Anexos",
            itens: [
              "Ficha do imóvel em PDF, nunca print de tela.",
              "Nome de arquivo padrão: codigo-bairro-ficha.pdf. Chega assim na pasta do cliente.",
              "Acima de 10 MB, link em vez de anexo.",
              "Documento de cliente só vai por e-mail quando foi ele quem pediu.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O que não se faz",
            texto:
              "Disparo para lista comprada é o caminho mais curto para a marca cair no spam de todo mundo — inclusive dos clientes de verdade. Contato de e-mail é dado pessoal: a pessoa precisa ter dado o endereço à casa, e precisa conseguir pedir para parar de receber a qualquer momento (LGPD, art. 18).",
          },
        ],
        exigencia:
          "E-mail que oferece imóvel é peça publicitária: o número de inscrição no CRECI é obrigatório na assinatura (Lei 6.530/78; Resolução COFECI 492/2007).",
        cards: [
          {
            chave: "modelo-email",
            titulo: "Modelos de e-mail",
            descricao:
              "Primeiro contato, envio de ficha, retomada de cliente parado e encaminhamento de proposta.",
            tipo: "modelo",
          },
        ],
      },
      {
        chave: "whatsapp-abordagem",
        titulo: "WhatsApp",
        resumo:
          "Onde a conversa realmente acontece — e onde a primeira mensagem decide se vai haver uma segunda.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "No WhatsApp o cliente vê o nome, a foto e a primeira linha antes de decidir abrir. Isso é tudo o que você tem. Uma mensagem que começa com \"Oi, tudo bem?\" e para ali obriga a pessoa a perguntar quem é — e a maioria não pergunta, só não responde.",
          },
          {
            tipo: "secao",
            titulo: "A primeira mensagem, em quatro linhas",
            texto:
              "Tudo numa mensagem só. Mandar linha por linha enche a tela de notificação e irrita antes de informar.",
            itens: [
              "Nome e imobiliária.",
              "De onde veio o contato: o anúncio, a placa, a indicação de alguém, o formulário do site.",
              "O que você quer, em uma frase.",
              "UMA pergunta aberta no fim — pergunta de sim ou não encerra a conversa.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que não entra no primeiro contato",
            itens: [
              "Áudio. Só depois que o cliente mandar áudio primeiro, e ainda assim curto.",
              "Vinte fotos soltas. Manda o link da página do imóvel no site.",
              "Preço antes de saber o que a pessoa procura.",
              "Mensagem fora do horário comercial, salvo se foi ela quem escreveu.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Depois que a conversa abre",
            itens: [
              "Responder em minutos: quem procura imóvel está falando com mais de uma imobiliária.",
              "Confirmar visita na véspera e no dia.",
              "Registrar no cadastro o que foi combinado — conversa de WhatsApp não é sistema.",
              "Fora do horário, mensagem de ausência: avisar que vai demorar é melhor que o silêncio.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Insistência tem limite, e ele é fácil de ver",
            texto:
              "Duas mensagens sem resposta já disseram o que precisavam dizer. A terceira não convence ninguém: vira bloqueio, e bloqueio é o número da casa queimado para sempre naquele aparelho. Quem não respondeu hoje pode responder em três meses — se ainda conseguir receber.",
          },
        ],
        atencao:
          "Lista de transmissão para quem não pediu é o caminho curto para o bloqueio. Contato e preferência de compra são dados pessoais sob a LGPD, e a responsabilidade é da imobiliária, inclusive por descuido de corretor. Documento de cliente — RG, CPF, comprovante de renda — não fica em grupo nem em conversa: vai para o sistema.",
        cards: [
          {
            chave: "modelo-whatsapp",
            titulo: "Modelos de primeira mensagem",
            descricao:
              "Lead de portal, lead de placa, indicação, retomada de cliente parado e confirmação de visita.",
            tipo: "modelo",
          },
        ],
      },
      {
        chave: "instagram-abordagem",
        titulo: "Instagram",
        resumo:
          "O perfil é vitrine aberta vinte e quatro horas. O direct é atendimento, com o mesmo prazo do WhatsApp.",
        passos: [],
        conteudo: [
          {
            tipo: "secao",
            titulo: "O perfil",
            itens: [
              "Conta profissional, foto de rosto e cidade de atuação.",
              "CRECI na bio — ali ele vale como identificação e como exigência.",
              "Link para o site da casa, não para um imóvel que vai sair do ar.",
              "Perfil do corretor é profissional: o pessoal fica em outra conta.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Abordar sem invadir",
            texto:
              "Direct frio com anúncio é o equivalente digital de puxar alguém pelo braço na rua. A ordem que funciona é a inversa.",
            itens: [
              "Primeiro aparecer: comentar, responder, estar presente nos stories.",
              "Direct só depois de alguma interação, ou quando a pessoa pediu.",
              "Quem comentou num imóvel está perguntando — responder no comentário e seguir no direct.",
              "Resposta de direct no mesmo prazo do WhatsApp.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que o perfil publica",
            itens: [
              "Feed: o imóvel bem fotografado, com o código na legenda.",
              "Stories: o bastidor, a visita, o bairro — é onde se conhece o corretor.",
              "Reels: tour curto e vertical, começando pelo melhor ambiente.",
              "Nada de post só com telefone e preço: isso é classificado, não presença.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Imagem de cliente e de imóvel habitado",
            texto:
              "Interior de imóvel ocupado mostra a vida de alguém: móvel, foto de família, remédio na mesa. Publicar isso pede autorização do morador, por escrito, e vale também para o cliente que aparece na visita. Autorização de imagem é rápida de pedir e cara de não ter.",
          },
        ],
        exigencia:
          "Post que oferece imóvel é peça publicitária: o número do CRECI é obrigatório na peça ou no perfil (Lei 6.530/78; Resolução COFECI 492/2007).",
      },
      {
        chave: "abordagem-pessoal",
        titulo: "Abordagem pessoal",
        resumo:
          "Plantão, porta de empreendimento, vizinho do imóvel captado. Trinta segundos para a pessoa decidir se fica.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Aqui não há tela para esconder a hesitação e não dá para apagar e reescrever. Em compensação é o canal com a maior taxa de resposta que existe: a pessoa está na sua frente e vai dizer alguma coisa. O que ela vai dizer depende quase inteiramente dos primeiros trinta segundos.",
          },
          {
            tipo: "secao",
            titulo: "Os trinta segundos",
            itens: [
              "Crachá à vista ANTES de falar — quem está sendo abordado precisa saber quem é você.",
              "Nome e imobiliária.",
              "Por que você está ali: o plantão, o imóvel da esquina, o empreendimento.",
              "Uma pergunta aberta sobre a pessoa, não sobre a venda.",
            ],
          },
          {
            tipo: "secao",
            titulo: "A pergunta que abre e a que fecha",
            texto:
              "\"O senhor quer comprar um apartamento?\" tem uma resposta só, e é não. \"O senhor mora aqui no bairro?\" abre uma conversa em que a pessoa fala de si — e é falando de si que ela conta o que precisa.",
            itens: [
              "Perguntar sobre o bairro, a mudança, a família, o que trouxe a pessoa ali.",
              "Ouvir mais do que falar no primeiro contato.",
              "Preço entra quando ela perguntar, não antes.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Ler a situação",
            itens: [
              "Não bloquear a passagem nem acompanhar quem está indo embora.",
              "Pedir licença para continuar — e aceitar o não na primeira vez.",
              "Quem está com criança, com pressa ou com sacola não quer conversar agora.",
              "Cartão na mão ao sair, sempre: o não de hoje liga em março.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O contato que você leva embora",
            texto:
              "Anotar telefone no verso de um papel é perder o contato. Peça o número dizendo para que vai usá-lo, registre no cadastro no mesmo dia, e na primeira mensagem lembre onde vocês se conheceram — \"somos o corretor do plantão do sábado\". Sem isso, do outro lado chega mais um número desconhecido oferecendo imóvel.",
          },
        ],
        cards: [
          {
            chave: "roteiro-plantao",
            titulo: "Roteiro de abordagem em plantão",
            descricao:
              "Os trinta segundos de abertura, as perguntas que abrem conversa e o que fazer com o contato depois.",
            tipo: "modelo",
          },
        ],
        fontes: [
          {
            rotulo:
              "Resolução COFECI nº 326/1992 — Código de Ética Profissional dos Corretores de Imóveis (alterada pela Resolução 1.404/2018)",
            href: "https://www.crecisp.gov.br/Files/notify/71f27005-77ce-47fb-8d10-3c2365681464_codigoeticaci.pdf",
          },
        ],
      },
    ],
  },
  /* ------------------------------------------------------------------ 06 */
  {
    chave: "captacao",
    numero: "04",
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
      {
        chave: "revisao-de-preco",
        titulo: "Pedir revisão de preço ao proprietário",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Imóvel parado quase nunca é imóvel sem comprador: é imóvel acima do que o mercado está pagando naquele momento. Quem precisa dizer isso ao proprietário é o corretor, e é a conversa mais desconfortável do agenciamento — porque parece que se está admitindo que não conseguiu vender.",
          },
          {
            tipo: "secao",
            titulo: "Quando pedir",
            itens: [
              "Sessenta dias no ar sem nenhuma proposta.",
              "Muitas visitas e nenhuma oferta — o imóvel atrai, mas o preço derruba na hora da conta.",
              "Pouquíssimas visitas — nem chega a atrair, e aí o filtro de preço do portal está escondendo o anúncio.",
              "Imóveis semelhantes na mesma região anunciados abaixo, ou vendidos abaixo.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que levar para a conversa",
            texto:
              "Pedido sem número é opinião, e opinião o proprietário recusa. Pedido com número é informação, e informação ele consegue conferir sozinho.",
            itens: [
              "Quantas visitas o imóvel recebeu e em quanto tempo.",
              "O que as pessoas disseram depois de visitar — o retorno real, não o educado.",
              "Três a cinco anúncios comparáveis na região, com endereço, metragem e valor pedido.",
              "Propostas recebidas e recusadas, se houver.",
              "A faixa em que o comprador daquele perfil está pesquisando no portal.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Como não fazer",
            itens: [
              "Dizer “seu imóvel está caro”. O proprietário ouve “você errou” e fecha.",
              "Mandar áudio longo. Pedido de redução se lê, se reler e se pensa — áudio obriga a responder na hora, e a resposta imediata é não.",
              "Dar ultimato ou prazo. Quem dá prazo ao dono do imóvel perde a autorização, não ganha o desconto.",
              "Pedir um número redondo sem explicar de onde saiu.",
              "Falar em nome do comprador que ainda não existe: “tenho um cliente que pagaria X” só vale se o cliente existir mesmo.",
            ],
          },
          {
            tipo: "secao",
            titulo: "A mensagem padrão",
            texto:
              "Por escrito, no WhatsApp, em texto — nunca áudio. Troque o que está entre colchetes pelos números reais do imóvel. A última frase é uma pergunta de propósito: ela devolve a decisão a quem é dono dela.",
          },
          {
            tipo: "fecho",
            titulo: "O texto, pronto para copiar",
            texto:
              "Olá, [nome]. Aqui é [corretor], da Tridium Imóveis. Trouxe um retorno sobre o [imóvel]. Desde que anunciamos, foram [N] visitas e [N] contatos. O retorno é parecido em quase todos: as pessoas gostam do imóvel, mas comparam com outras [N] opções semelhantes na região, anunciadas entre R$ [valor] e R$ [valor]. Hoje estamos pedindo R$ [valor]. Minha sugestão é ajustarmos para R$ [valor] — isso coloca o imóvel dentro da faixa em que o comprador está pesquisando, e costuma mudar o volume de visitas já na primeira semana. A decisão é sua, e eu sigo trabalhando o imóvel de qualquer forma. Posso te mandar o comparativo com os anúncios que usei nessa conta. O senhor prefere conversar hoje à tarde ou amanhã de manhã?",
          },
          {
            tipo: "secao",
            titulo: "Depois do pedido",
            itens: [
              "Aceito: atualize o anúncio no mesmo dia, em todos os portais, e avise quem já visitou — preço novo é motivo legítimo para reabrir conversa.",
              "Recusado: registre a recusa na ficha do imóvel, com a data. Em sessenta dias, o mesmo número conta outra história.",
              "Sem resposta: não insista na mesma semana. Volte com um fato novo, não com o mesmo pedido.",
            ],
          },
        ],
        atencao:
          "O valor sugerido sai do comparativo, não do seu cansaço com o imóvel. Corretor que pede redução sem base perde autoridade para pedir de novo quando ela for mesmo necessária.",
      },
    ],
  },
  {
    chave: "divulgacao",
    numero: "05",
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
    numero: "06",
    titulo: "Financiamento",
    tituloCurto: "Financiamento",
    resumo:
      "A maior parte dos im\u00f3veis n\u00e3o se vende \u00e0 vista. Saber o que o banco aceita, e quanto, \u00e9 o que separa a visita \u00fatil da perdida.",
    objetivo:
      "Dizer a um cliente, antes da primeira visita, em que linha ele se enquadra, quanto pode financiar, se pode usar FGTS e que documentos v\u00e3o ser pedidos \u2014 de quem compra, de quem vende e do im\u00f3vel.",
    icone: "apartamento",
    /* Recorte quadrado do card de financiamento da casa, sem a moldura
       verde nem as listas: so a fotografia. O enquadramento foi escolhido
       para caber a historia inteira numa imagem — calculadora, maquete,
       contrato com as chaves e a mao assinando. Cortes mais a esquerda
       perdiam a assinatura; mais a direita, a calculadora.

       Quadrada, 800x800, como as dos modulos 01 a 04. */
    imagem: {
      src: "/img/treinamento/financiamento-credito.webp",
      alt: "Mesa com calculadora, maquete de casa, contrato e chaves, e uma mão assinando",
      descricao: "Do cálculo à assinatura",
    },
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
    numero: "07",
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
    numero: "08",
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
    numero: "09",
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
    numero: "10",
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
    numero: "11",
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
    numero: "12",
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
    numero: "13",
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
  /* ---------------------------------------------------------------------
     14 CONTRATOS DE PARCERIA
     O modulo 09, "Documentacao", trata dos papeis da VENDA — o que se pede do
     comprador, do vendedor e do imovel. Este trata dos papeis que ficam ATRAS
     dela: com quem a casa divide negocio e em que condicoes.

     As clausulas usam o bloco `clausula`, que traz a traducao colada no texto
     tecnico. A razao esta no comentario do tipo, em corretor.ts: quem precisa
     cumprir a clausula nao e quem a escreveu.

     O QUE NAO ENTROU, DE PROPOSITO: a qualificacao das partes. O contrato
     original traz CPF, RG e endereco residencial de uma pessoa fisica, e isso
     nao vai para uma pagina que qualquer um com o endereco abre. O valor de
     treinamento esta nas clausulas, nao no cabecalho.
     --------------------------------------------------------------------- */
  {
    chave: "contratos-parceria",
    numero: "14",
    titulo: "Contratos de parceria",
    tituloCurto: "Contratos",
    resumo:
      "Com quem a casa divide negócio, e em que condições. Comissão combinada de boca vira discussão; combinada por escrito vira contrato.",
    objetivo:
      "Ler o contrato de parceria da casa e saber, sem consultar ninguém, quando a outra imobiliária tem direito a comissão, quanto é, por quanto tempo uma indicação fica protegida e o que precisa estar registrado por escrito para o direito existir.",
    icone: "permuta",
    /* Recorte quadrado ABAIXO DA BANDEIRA. A foto original traz uma bandeira
       dos Estados Unidos desfocada no alto e um documento em ingles — e um
       contrato de confidencialidade de emprego, nao de parceria imobiliaria.
       Cortando a partir de y=900, a bandeira sai inteira, e o que fica e o
       gesto: a mao com o marca-texto sobre o contrato. E justamente o que a
       aula pede — ler clausula por clausula e marcar o que mudar. */
    imagem: {
      src: "/img/treinamento/contratos-parceria.webp",
      alt: "Mão segurando um marca-texto amarelo sobre um contrato impresso, com trechos já marcados",
      descricao: "Ler cláusula por cláusula, marcando o que muda",
    },
    topicos: [
      {
        chave: "parceria-imobiliarias",
        titulo: "Imobiliária com imobiliária",
        resumo:
          "O contrato com a Sinos Imóveis, cláusula por cláusula, com a tradução de cada uma.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Este é o contrato que a Tridium Imóveis tem com a Sinos Imóveis — a parceira cujo logo está no alto desta tela. Ele resolve três coisas: quem responde tecnicamente pela intermediação, quem recebe quanto quando o negócio nasce de um lado e fecha do outro, e o que precisa estar escrito para esse direito existir.",
          },
          {
            tipo: "texto",
            texto:
              "Cada cláusula aparece primeiro como o contrato a escreveu e depois em português de conversa. Os dois textos valem: o técnico é o que se usa numa discussão, o simples é o que se usa na segunda-feira.",
          },
          {
            tipo: "secao",
            titulo: "Quem são as partes",
            itens: [
              "SINOS ASSESSORIA IMOBILIÁRIA LTDA — CRECI/RS nº 23250, Novo Hamburgo/RS. No contrato, SINOS.",
              "TRIDIUM ENGENHARIA E CONSTRUÇÃO LTDA — Palhoça/SC. No contrato, TRIDIUM.",
              "Francis Michel da Rosa Marques — RESPONSÁVEL TÉCNICO pela Tridium perante o CRECI-SC.",
              "Assinado em Novo Hamburgo, 13 de novembro de 2026, em duas vias e com duas testemunhas.",
            ],
          },
          {
            tipo: "clausula",
            numero: "primeira",
            titulo: "Do objeto",
            texto:
              "Disciplina a cooperação comercial na captação e intermediação de imóveis, indicação de compradores, divulgação de ofertas e acompanhamento das operações, bem como as condições do eventual exercício da responsabilidade técnica da TRIDIUM pelo RESPONSÁVEL TÉCNICO.",
            itens: [
              "Parágrafo único — A atuação na intermediação e a responsabilidade técnica ficam condicionadas à regularidade cadastral e às autorizações exigidas pelo CRECI-SC. A assinatura deste instrumento não substitui os registros e atos próprios perante o Conselho.",
            ],
            simples:
              "É o contrato que diz o que as duas casas vão fazer juntas: achar imóvel, indicar comprador, divulgar e acompanhar o negócio. E já avisa uma coisa importante: assinar este papel NÃO dá registro no CRECI. O registro é outro caminho, e tem de ser feito à parte.",
          },
          {
            tipo: "clausula",
            numero: "segunda",
            titulo: "Da responsabilidade técnica",
            texto:
              "A responsabilidade técnica será exercida pessoalmente pelo RESPONSÁVEL TÉCNICO, após habilitação e vinculação regular perante o CRECI-SC, com apoio operacional da SINOS, sem transferência à SINOS das obrigações profissionais personalíssimas.",
            itens: [
              "§1º — A TRIDIUM deve manter sua regularidade para intermediação, incluindo adequação do objeto social e inscrição de pessoa jurídica no CRECI-SC.",
              "§2º — A TRIDIUM garante ao RESPONSÁVEL TÉCNICO acesso tempestivo a sistemas, documentos, contratos, registros, equipe e informações necessários à fiscalização.",
              "§3º — O RESPONSÁVEL TÉCNICO pode exigir correções, suspender sua aprovação e comunicar irregularidades aos órgãos competentes. Nenhuma disposição do contrato afasta responsabilidade legal inderrogável.",
            ],
            simples:
              "Quem responde tecnicamente é uma PESSOA, não a empresa — e essa responsabilidade não se empurra para a Sinos. Em troca, o responsável técnico tem de conseguir ver tudo: sistema, contrato, documento, equipe. E ele pode travar operação que esteja errada. Se travou, não adianta procurar quem assine por cima: a lei não deixa.",
          },
          {
            tipo: "clausula",
            numero: "terceira",
            titulo: "Do prazo e da substituição",
            texto:
              "A parceria comercial tem vigência de 5 (cinco) anos contados da assinatura, ressalvadas as obrigações que sobrevivam ao término e as hipóteses de rescisão previstas.",
            itens: [
              "§1º — O exercício da responsabilidade técnica tem prazo inicial até 31 de março de 2027, independentemente do prazo da parceria.",
              "§2º — A substituição antecipada depende de habilitação de profissional indicado pela TRIDIUM e formalização perante o CRECI-SC, com comunicação escrita à SINOS.",
              "§3º — A continuidade após 31 de março de 2027 depende de concordância expressa do profissional e de aditivo escrito.",
              "§4º — A substituição ou o encerramento da responsabilidade técnica não extingue, por si só, a parceria comercial. O encerramento não dispensa a baixa ou substituição formal perante o CRECI-SC.",
            ],
            simples:
              "São dois prazos diferentes, e confundi-los é o erro fácil aqui. A PARCERIA dura cinco anos. A RESPONSABILIDADE TÉCNICA do Francis vale até 31 de março de 2027 — e para continuar depois disso não basta ninguém reclamar: precisa de aditivo escrito e do aceite dele. Trocar o responsável técnico não derruba a parceria, e sair do cargo sem dar baixa no CRECI deixa o nome dele preso ao que a casa fizer depois.",
          },
          {
            tipo: "clausula",
            numero: "quarta",
            titulo: "Da gratuidade e das despesas",
            texto:
              "Não há remuneração específica ao RESPONSÁVEL TÉCNICO nem à SINOS pelo exercício da responsabilidade técnica e pelo acompanhamento operacional, sem prejuízo das comissões comerciais previstas adiante.",
            itens: [
              "Parágrafo único — A TRIDIUM suporta as taxas e despesas do CRECI relacionadas à habilitação, vinculação e atuação do RESPONSÁVEL TÉCNICO no período, desde que previamente identificadas e comprovadas.",
            ],
            simples:
              "Ninguém recebe salário por ser responsável técnico nem por acompanhar as operações. O que se ganha nesta parceria vem das comissões das cláusulas sexta e sétima. As taxas do CRECI para habilitar o responsável técnico são da Tridium — desde que mostradas e comprovadas antes, não apresentadas depois.",
          },
          {
            tipo: "clausula",
            numero: "quinta",
            titulo: "Do controle das operações",
            texto:
              "Captações, vendas e locações conduzidas pela TRIDIUM devem ser submetidas previamente à análise documental da SINOS e à aprovação expressa, por escrito, do RESPONSÁVEL TÉCNICO, antes da formalização dos instrumentos.",
            itens: [
              "§1º — Nas captações: documentos do imóvel e do proprietário, autorização de intermediação, condições comerciais e material de divulgação.",
              "§2º — Nas vendas: documentos das partes e do imóvel, condições negociadas, minutas contratuais e informações sobre ônus, pagamentos e prazos.",
              "§3º — Nas locações: cadastro das partes, garantias, contrato, vistoria, aditivos, renovações e rescisões.",
              "§4º — A TRIDIUM mantém registros organizados e não pode omitir informações relevantes. A análise e a aprovação não garantem resultado nem afastam os deveres legais de cada um.",
            ],
            simples:
              "Nada é assinado antes de passar pela conferência: primeiro a Sinos olha os documentos, depois o responsável técnico aprova POR ESCRITO. Vale para captação, venda e locação. E atenção à última linha: a aprovação não é um escudo. Se você omitiu alguma coisa na hora de pedir, a aprovação não cobre.",
          },
          {
            tipo: "clausula",
            numero: "sexta",
            titulo: "Da comissão por captação",
            texto:
              "Quando imóvel captado pelo RESPONSÁVEL TÉCNICO ou pela SINOS, identificado e cadastrado na plataforma da parceria, for vendido por corretor da TRIDIUM, a SINOS tem direito a comissão de 1% (um por cento) do valor efetivo da venda.",
            itens: [
              "§1º — Vale para imóveis em Santa Catarina ou em qualquer outra localidade, observadas as exigências de habilitação.",
              "§2º — O percentual sai da comissão total de corretagem contratada, sem acréscimo ao preço nem cobrança adicional ao comprador ou vendedor. A captação e o vínculo com a operação têm de ser comprováveis por registros escritos.",
            ],
            simples:
              "Imóvel que a Sinos achou e corretor da Tridium vendeu: 1% do valor da venda vai para a Sinos. Esse 1% sai de dentro da comissão que já existe — o cliente não paga um centavo a mais. E o imóvel precisa estar cadastrado na plataforma: captação que ninguém registrou não gera direito a nada.",
          },
          {
            tipo: "clausula",
            numero: "sétima",
            titulo: "Da comissão por indicação de comprador",
            texto:
              "A SINOS pode usar materiais de imóveis da TRIDIUM para divulgação, inclusive em anúncios patrocinados no Rio Grande do Sul, respeitadas as autorizações de publicidade e as regras profissionais.",
            itens: [
              "§1º — O comprador identificado pela SINOS é encaminhado à TRIDIUM, responsável pelo atendimento, visitas e negociação.",
              "§2º — Concluída a venda decorrente de indicação comprovada, a SINOS tem direito a 3% (três por cento) do valor efetivo da venda, retirados da comissão total de corretagem, sem cobrança adicional às partes.",
              "§3º — Se a SINOS ou o RESPONSÁVEL TÉCNICO também tiver captado o imóvel, é devido apenas o percentual de 3%, vedada a cumulação com o de 1%.",
              "§4º — Operação cuja comissão total não comporte essa participação deve ser ajustada previamente por escrito, sem impor cobrança não autorizada ao cliente.",
            ],
            simples:
              "Cliente que a Sinos encontrou e mandou para cá: 3% da venda. É mais que o 1% da captação porque trazer comprador vale mais que achar imóvel. E os dois NÃO somam: se a Sinos achou o imóvel e trouxe o comprador, recebe 3%, não 4%. Quando a comissão do negócio for apertada demais para caber essa fatia, resolve-se antes e por escrito — nunca cobrando a diferença do cliente.",
          },
          {
            tipo: "clausula",
            numero: "oitava",
            titulo: "Do cadastro e da proteção da indicação",
            texto:
              "A imobiliária indicadora deve registrar e encaminhar o cliente ANTES do atendimento pela receptora, informando nome, telefone, data, origem, corretor responsável e imóvel de interesse ou perfil da busca. O recebimento deve ser confirmado por escrito, inclusive por e-mail, WhatsApp ou plataforma com registro verificável.",
            itens: [
              "§1º — A indicação comprovada fica protegida por 12 (doze) meses a partir do encaminhamento registrado. Nesse período, cada compra feita pelo cliente por intermédio da TRIDIUM — inclusive de imóvel diferente do indicado — gera os 3% da cláusula sétima, desde que haja nexo com a indicação e participação efetiva na aproximação.",
              "§2º — O fim do contrato não extingue o direito às comissões de indicações válidas feitas durante a vigência.",
              "§3º — Havendo controvérsia sobre cliente já cadastrado ou atendido, as partes apresentam registros datados e buscam solução escrita antes de formalizar a operação.",
            ],
            simples:
              "Esta é a cláusula que mais vira discussão, e a regra é simples: manda o cliente ANTES, por escrito, com nome, telefone, data e o que ele procura — e pede confirmação de recebimento. Feito isso, a indicação fica protegida por doze meses. Se o cliente voltar em agosto e comprar outro imóvel, a comissão continua devida. Sem esse registro, a palavra de um contra a do outro não decide nada.",
          },
          {
            tipo: "clausula",
            numero: "nona",
            titulo: "Da titularidade das comissões",
            texto:
              "As comissões de 1% e 3% previstas no contrato pertencem exclusivamente à pessoa jurídica SINOS IMÓVEIS.",
            simples:
              "O dinheiro é da empresa, não do corretor que fez a indicação. Como a Sinos divide isso internamente é assunto dela — a Tridium paga para a pessoa jurídica.",
          },
          {
            tipo: "clausula",
            numero: "décima",
            titulo: "Dos anúncios e materiais",
            texto:
              "Cada imobiliária arca integralmente com os anúncios, impulsionamentos e campanhas que contratar por sua iniciativa, sem direito a reembolso pela outra, salvo autorização expressa e prévia por escrito.",
            itens: [
              "Parágrafo único — O uso de imagens, descrições e marcas depende de autorização e deve respeitar direitos de terceiros, dados pessoais e informações atualizadas dos imóveis.",
            ],
            simples:
              "Quem anuncia, paga. Não existe mandar a conta do tráfego pago para a outra casa depois, a menos que ela tenha autorizado por escrito ANTES. E usar foto, texto ou marca da outra pede autorização — o que o módulo de Divulgação já diz sobre imagem vale aqui também.",
          },
          {
            tipo: "clausula",
            numero: "décima primeira",
            titulo: "Dos recebimentos e repasses",
            texto:
              "As partes podem receber diretamente suas parcelas da corretagem, desde que a divisão conste dos documentos da operação e seja aceita pelos respectivos pagadores, observadas as regras fiscais.",
            itens: [
              "§1º — Se uma parte receber valores pertencentes à outra, deve repassá-los em até 2 (dois) dias úteis após o crédito efetivo, com demonstrativo e comprovante.",
              "§2º — Em comissão parcelada, cada repasse é proporcional ao percentual efetivamente recebido em relação à comissão total contratada.",
              "§3º — Os pagamentos são feitos nas contas indicadas pelas partes.",
              "§4º — O atraso sujeita a parte inadimplente a multa de 2% sobre o valor em atraso, juros de 1% ao mês pro rata die e correção pelo IPCA positivo, sem prejuízo de cobrança e perdas e danos comprovados.",
            ],
            simples:
              "O melhor caminho é cada uma receber a sua parte direto na operação — para isso a divisão tem de estar escrita nos documentos do negócio. Quando não dá, quem recebeu repassa em dois dias úteis, com extrato e comprovante. Comissão parcelada se repassa na mesma proporção: recebeu metade, repassa metade. Atrasou, tem multa de 2% mais juros.",
          },
          {
            tipo: "clausula",
            numero: "décima segunda",
            titulo: "Dos tributos",
            texto:
              "Cada imobiliária responde pelos tributos sobre a própria receita e pela emissão dos documentos fiscais exigidos, observadas eventuais retenções obrigatórias. A operacionalização do faturamento e dos pagamentos deve ser validada pelos respectivos responsáveis contábeis.",
            simples:
              "Cada uma paga o próprio imposto e emite a própria nota. Antes de montar como o dinheiro vai circular, a contabilidade das duas confirma — arranjo que parece prático às vezes cria problema fiscal.",
          },
          {
            tipo: "clausula",
            numero: "décima terceira",
            titulo: "Da confidencialidade e proteção de dados",
            texto:
              "As partes mantêm sigilo sobre dados de clientes, condições negociais e informações não públicas recebidas em razão da parceria, usando-os apenas para as finalidades legítimas do contrato e observando a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).",
            itens: [
              "Parágrafo único — Cada parte adota medidas razoáveis de segurança e comunica prontamente à outra os incidentes relevantes com os dados compartilhados.",
            ],
            simples:
              "Dado de cliente que veio da parceria serve para a parceria, e só. Não vira lista de prospecção nem sai do sistema. E se houver vazamento, avisa-se a outra casa na hora — esconder incidente é o que transforma um problema em processo.",
          },
          {
            tipo: "clausula",
            numero: "décima quarta",
            titulo: "Da autonomia das partes",
            texto:
              "A parceria não constitui sociedade, associação, franquia, representação exclusiva ou vínculo empregatício entre as partes, seus sócios ou colaboradores. Cada parte responde pelos próprios atos, profissionais e obrigações, sem prejuízo de responsabilidades impostas por lei.",
            simples:
              "Parceria não é sociedade nem emprego: ninguém virou sócio nem funcionário de ninguém. E não é exclusividade — as duas seguem trabalhando com quem quiserem. Cada uma responde pelos próprios corretores e pelos próprios erros.",
          },
          {
            tipo: "clausula",
            numero: "décima quinta",
            titulo: "Da rescisão",
            texto:
              "O contrato pode ser rescindido por acordo escrito, por infração contratual relevante não sanada em até 10 (dez) dias úteis após notificação, ou imotivadamente mediante aviso escrito com antecedência mínima de 30 (trinta) dias, sem prejuízo das providências perante o CRECI-SC.",
            itens: [
              "§1º — Permanecem exigíveis as comissões de operações, captações e indicações comprovadas realizadas durante a vigência, respeitados os prazos de proteção.",
              "§2º — A rescisão não prejudica confidencialidade, prestação de contas, obrigações tributárias e responsabilidades legais já constituídas.",
            ],
            simples:
              "Dá para sair sem precisar de motivo: basta avisar por escrito trinta dias antes. Se foi por descumprimento, a outra tem dez dias úteis para consertar. O que já estava em andamento continua valendo — indicação registrada antes da saída segue protegida pelos doze meses dela. E sigilo e imposto não acabam junto com o contrato.",
          },
          {
            tipo: "clausula",
            numero: "décima sexta",
            titulo: "Das comunicações e do foro",
            texto:
              "As notificações são encaminhadas aos e-mails ou contatos oficiais informados na qualificação ou atualizados por escrito, com comprovação de envio e recebimento. Fica eleito o foro da Comarca de Novo Hamburgo/RS, ressalvadas competências legais inderrogáveis.",
            simples:
              "Aviso que importa — rescisão, cobrança, notificação — só vale por escrito, no contato oficial, e com prova de que foi enviado E recebido. Mensagem perdida numa conversa não conta. Se der briga na Justiça, ela corre em Novo Hamburgo, no Rio Grande do Sul.",
          },
          {
            tipo: "fecho",
            titulo: "O que este contrato cobra de você, corretor",
            texto:
              "De todas as dezesseis cláusulas, três chegam na sua mesa. Indicação de cliente se manda ANTES do atendimento, por escrito, com confirmação de recebimento (oitava). Captação só gera comissão se estiver cadastrada na plataforma (sexta). E nada se assina antes da aprovação escrita do responsável técnico (quinta). O resto é entre as empresas; estas três, se você não fizer, ninguém faz por você.",
          },
        ],
        atencao:
          "O contrato tem dois campos em branco: o CRECI do responsável técnico aparece como \"XXXX\" e o representante da Tridium como \"NOME, CPF E QUALIFICAÇÃO\". Assinado assim, dá margem a discussão sobre quem se obrigou. Conferir com o jurídico antes de usar esta versão como modelo.",
      },
      {
        chave: "parceria-corretor",
        titulo: "Imobiliária com corretor",
        resumo:
          "O contrato entre a casa e quem vende por ela. O modelo ainda não existe — aqui está o que ele precisa resolver.",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Esta aula ainda não tem o contrato-modelo. O que está abaixo é a lista do que ele precisa resolver, levantada a partir do que o restante do treinamento já pressupõe — metas, carteira, repasse de comissão, uso de material da casa. Serve para orientar a redação, não substitui a redação.",
          },
          {
            tipo: "secao",
            titulo: "O que o contrato precisa dizer",
            itens: [
              "Natureza do vínculo: corretor autônomo, com CRECI próprio e nota fiscal própria.",
              "Divisão da comissão: o percentual do corretor, o da casa, e quem fica com o quê quando um capta e outro vende.",
              "Captação: a quem pertence o imóvel captado, e o que acontece com ele se o corretor sair.",
              "Carteira de clientes: de quem é o cadastro, e o que o corretor pode levar embora.",
              "Despesas: quem paga anúncio, impulsionamento, deslocamento e material.",
              "Uso da marca: até onde o corretor pode anunciar em nome da casa.",
              "Prazo, rescisão e aviso prévio.",
              "Comissões pendentes na saída: negócio iniciado e fechado depois.",
              "Dados de cliente na saída: o que volta para a casa, à luz da LGPD.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O ponto que precisa de advogado",
            texto:
              "Corretor autônomo que cumpre horário, bate meta definida pela casa, usa uniforme e atende em escala pode, numa discussão trabalhista, ser lido como empregado — e aí o contrato que diz \"não há vínculo\" vale pouco diante dos fatos. O treinamento da casa já prevê metas semanais e padrão de vestuário, então este não é um risco teórico aqui. A redação desta parte é trabalho de advogado, não de modelo pronto.",
          },
        ],
        atencao:
          "PENDENTE: o contrato-modelo entre imobiliária e corretor ainda não foi fornecido. Esta aula fica como roteiro até ele chegar.",
      },
    ],
  },
  /* ---------------------------------------------------------------------
     15 CARDS
     Os cards desenhados que a casa usa — os mesmos que ja aparecem dentro das
     aulas, reunidos num lugar so. Entra VAZIO de proposito: o cliente vai
     informar a sequencia, card por card, e cada um vira uma aula.

     Ate la o modulo abre, diz que as aulas estao sendo montadas e nao finge
     ter conteudo. Modulo escondido ate ficar pronto some da trilha e some do
     combinado; modulo vazio e visivel cobra para ser preenchido.
     --------------------------------------------------------------------- */
  {
    chave: "cards",
    numero: "15",
    titulo: "Cards",
    tituloCurto: "Cards",
    resumo:
      "As peças visuais da casa reunidas num lugar só — cada card com o que ele mostra e quando se usa.",
    objetivo:
      "Achar o card certo para a situação sem procurar em pasta de WhatsApp, e saber o que cada um diz antes de mandar para o cliente.",
    icone: "lancamento",
    /* A capa e o PRIMEIRO CARD INTEIRO, nao um pedaco dele: a moldura do
       modulo e quadrada e o card e 16:9, e recortar para preencher comeria
       metade do que ele diz.

       O card vai na LARGURA INTEIRA da moldura, e as faixas que sobram em
       cima e embaixo sao preenchidas com o proprio card ampliado e desfocado.
       A primeira tentativa deixou o card menor, centrado num fundo liso, e
       ficou com mais vazio do que imagem — o card sumia dentro da moldura.
       Com o fundo desfocado nao ha vazio, o card cabe maior, e o verde
       borrado le como textura da marca em vez de sobra. */
    imagem: {
      src: "/img/treinamento/cards-capa-moldura.webp",
      alt: "O card de apresentação pessoal do corretor, inteiro, sobre um fundo desfocado do próprio card",
      descricao: "As peças da casa, reunidas",
    },
    /* Uma aula por card, na ordem dos arquivos. A aula e SO o card: sem texto
       antes, sem legenda depois. O card ja diz o que tem para dizer, e repetir
       em texto ao lado foi justamente o que se tirou das aulas do modulo 02 e
       do Carro por ser redundante.

       `largura: "cheia"` em todos. Os 70% padrao existem para a imagem nao
       virar o centro de uma aula de texto; aqui o card E a aula, e a 70% a
       letra dele fica pequena demais.

       O TEXTO ALTERNATIVO CARREGA O CONTEUDO DO CARD, item por item. Quem usa
       leitor de tela nao enxerga nada do que esta desenhado la dentro: sem
       isso, para essa pessoa o modulo inteiro seria dezesseis imagens mudas. */
    topicos: [
      {
        chave: "card-apresentacao-pessoal",
        titulo: "Apresentação pessoal do corretor",
        resumo:
          "O padrão de imagem e vestuário, num quadro só.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/01-apresentacao-pessoal.webp",
            alt: "Card “Apresentação Pessoal do Corretor”. Foto de um corretor e uma corretora de camisa oficial verde da Tridium Imóveis, com cordão e crachá. Imagem profissional: cabelo cortado e bem cuidado; barba feita ou bem aparada; higiene pessoal em dia; unhas limpas e aparência organizada; uso moderado de perfumes. Vestuário e identificação: camisa oficial da imobiliária; crachá de identificação visível; roupas limpas, alinhadas e em bom estado; calçado social ou casual alinhado e limpo.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-veiculo",
        titulo: "Veículo",
        resumo:
          "O carro como primeira sala de reunião.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/02-veiculo.webp",
            alt: "Card “Veículo”. Foto de um SUV cinza com a marca da Tridium Imóveis aplicada na porta. Veículo limpo por dentro e por fora; organizado e sem objetos soltos; manutenção em dia, com revisões, pneus e segurança; transmite cuidado, credibilidade e profissionalismo.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-comportamento",
        titulo: "Comportamento e relacionamento",
        resumo:
          "Como o corretor se conduz na conversa.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/03-comportamento.webp",
            alt: "Card “Comportamento e Relacionamento Profissional”. Foto de um corretor de camisa da Tridium Imóveis conversando com um cliente à mesa. Trate todos com cordialidade e respeito; organize sua agenda com antecedência; comunique-se de forma clara e objetiva; ouça as necessidades do cliente.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-area-de-atuacao",
        titulo: "Delimitação da área de atuação",
        resumo:
          "Onde a casa trabalha, e por quê.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/04-area-de-atuacao.webp",
            alt: "Card “Delimitação da Área de Atuação”. Mapa aéreo de Florianópolis com a região de atuação marcada em verde e um alfinete sobre a cidade. Área central de Florianópolis; atuação regional estratégica; conhecimento de mercado; logística.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-perfil-empreendimento",
        titulo: "Perfil do empreendimento",
        resumo:
          "O que se olha antes de agenciar um lançamento.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/05-perfil-empreendimento.webp",
            alt: "Card “Perfil do Empreendimento”. Foto de um prédio em construção ao lado de capacete, planta e caneta sobre a mesa. Critérios de avaliação: empreendimentos de incorporadora; credibilidade da incorporadora; etapa da obra; documentação.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-prospeccao",
        titulo: "Estratégias de prospecção",
        resumo:
          "Por onde o contato começa.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/06-prospeccao.webp",
            alt: "Card “Estratégias de Prospecção”. Foto de um corretor da Tridium Imóveis ao celular, com ícones de WhatsApp, e-mail, grupo de pessoas e aperto de mão ao redor. Script de abordagem comercial por WhatsApp e e-mail; abordagem presencial estratégica.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-midias-agenciamento",
        titulo: "Mídias do agenciamento",
        resumo:
          "O material que se produz do imóvel.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/07-midias-agenciamento.webp",
            alt: "Card “Mídias do Agenciamento”. Foto de duas mãos segurando um celular na horizontal, filmando a sala de um apartamento. Fotos e vídeos do imóvel; pré-visita, com cuidados na apresentação do imóvel; ângulo dos registros; vídeos padronizados.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-ficha-agenciamento",
        titulo: "Ficha de agenciamento",
        resumo:
          "O cadastro que fecha a captação.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/08-ficha-agenciamento.webp",
            alt: "Card “Ficha de Agenciamento”. Ilustração de um notebook com a tela “Cadastro do Empreendimento” — campos de empreendimento, incorporadora e etapa da obra — ao lado de um celular criando um grupo novo de WhatsApp. Cadastro do empreendimento no site e no grupo de WhatsApp; modelo de ficha de agenciamento.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-perfil-metas-prospeccao",
        titulo: "Perfil e metas de prospecção",
        resumo:
          "O exemplo de perfil de agente, com as metas do mês.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/09-prospeccao-isaac.webp",
            alt: "Card “Perfil e Metas de Prospecção”. Retrato de Isaac, agente imobiliário, de camisa verde da Tridium. Perfil do agente: função de agente imobiliário; cidade Florianópolis, SC; bairros de atuação Agronômica, Trindade e Rio Vermelho. Metas de prospecção: 10 agenciamentos por mês, média de 2 a 3 por semana; vistoria no bairro a cada 15 dias, para ver novos imóveis à venda e conferir as placas; controle no guia de prospecção.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-grupos-whatsapp",
        titulo: "Grupos de WhatsApp",
        resumo:
          "Os quatro grupos de captação e o que entra em cada um.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/10-grupos-whatsapp.webp",
            alt: "Card “Agenciamento: Grupos de WhatsApp”. Estrutura dos grupos de captação, cada tipo de imóvel no seu grupo. 01 Empreendimentos de construtoras: lançamentos e imóveis na planta, contato direto com construtoras. 02 Apartamentos usados: imóveis de revenda, captação com proprietários. 03 Terrenos e casas: lotes, terrenos e casas à venda, oportunidades nos bairros. 04 Apartamentos por região específica: um grupo para cada bairro — Agronômica, Trindade e Rio Vermelho.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-captacao-construtoras",
        titulo: "Captação de empreendimentos novos",
        resumo:
          "O passo a passo do agenciamento com construtora.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/11-captacao-construtoras.webp",
            alt: "Card “Captação de Empreendimentos Novos de Construtoras”. À esquerda, o modelo do grupo de WhatsApp “CAP - EP - Trindade, Florianópolis” com o padrão da foto dos empreendimentos: foto da fachada, um pouco da calçada, bem iluminada, bom contraste; ajuste no ChatGPT para deixar a foto com iluminação solar e remover veículos, pessoas, cabos e qualquer coisa na frente do empreendimento. À direita, o passo a passo: 01 pesquisa nos portais, levantando empreendimentos na internet; 02 vistoria in loco, indo ao empreendimento e conferindo pessoalmente; 03 foto padrão da capa, fachada frontal; 04 identificar contatos — nome da construtora, WhatsApp e e-mail; 05 visita à construtora, se disponível, para pegar o material. Modelo do nome do grupo: CAP, hífen, EP, hífen, bairro, vírgula, cidade.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-empreendimento-prospectado",
        titulo: "Empreendimento prospectado novo",
        resumo:
          "O que fazer depois que o empreendimento foi achado.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/12-empreendimento-prospectado.webp",
            alt: "Card “Empreendimento Prospectado Novo”. À esquerda, o grupo de WhatsApp “EP - Residencial Monterrey - Rua Augusto Jung 345, Centro”, com a foto padrão do prédio. À direita, o passo a passo: 1 criar o grupo de WhatsApp; 2 colocar a foto padrão no grupo; 3 nomear o grupo seguindo o modelo; 4 contato com a incorporadora a cada 30 dias, como rotina. Modelo do nome do grupo: EP, hífen, nome do empreendimento, hífen, rua e número, vírgula, bairro. Observações: o modelo de nome facilita achar o grupo no WhatsApp; o corretor que fotografou e abriu o grupo é responsável por receber a tabela atualizada de valores da construtora e compartilhar no grupo, e também por atualizar os valores em todos os canais — site da imobiliária, anúncios do Instagram, YouTube e onde mais o imóvel estiver divulgado.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-captacao-apartamentos-usados",
        titulo: "Captação de apartamentos usados",
        resumo:
          "O passo a passo do agenciamento de revenda.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/13-captacao-apartamentos-usados.webp",
            alt: "Card “Captação de Apartamentos Usados”. À esquerda, o modelo do grupo “CAP - AP Usado - Trindade, Florianópolis”, com o padrão da foto dos prédios: foto da fachada, um pouco da calçada, bem iluminada, bom contraste; ajuste no ChatGPT para iluminação solar e remoção de veículos, pessoas e cabos na frente do prédio. À direita, o passo a passo: 01 vistoria in loco, indo ao prédio e conferindo pessoalmente; 02 foto padrão da capa, fachada frontal; 03 identificar contatos — nome do prédio, endereço e contato do síndico, se conseguir. Modelo do nome do grupo: CAP, hífen, AP Usado, hífen, bairro, vírgula, cidade.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-apartamento-usado-captado",
        titulo: "Apartamento usado captado",
        resumo:
          "O que fazer depois que o prédio virou grupo.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/14-apartamento-usado-captado.webp",
            alt: "Card “Apartamento Usado Captado”. À esquerda, o grupo “AP Usado - Residencial Monterrey - Rua Augusto Jung 345, Centro”, com a foto padrão do prédio, os links dos imóveis à venda ali — para entender o produto: quartos, sala, banheiro, garagem — e a comparação de valores, para perceber preços fora da média e boas oportunidades. À direita, o passo a passo: 1 criar o grupo de WhatsApp; 2 colocar a foto padrão; 3 nomear seguindo o modelo; 4 encontrar o contato do síndico; 5 pesquisar e postar no grupo os links dos imóveis à venda no prédio; 6 comparar os valores encontrados, buscando oportunidades. Observações: o corretor que fotografou e abriu o grupo é responsável pela tabela atualizada de valores e por atualizar os valores em todos os canais. Atenção: na vistoria do prédio, observar se algum morador está saindo e aproveitar para iniciar uma conversa, seguindo o card de abordagem.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-captacao-casas-terrenos",
        titulo: "Captação de casas e terrenos",
        resumo:
          "O passo a passo do agenciamento de casa e lote.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/15-captacao-casas-terrenos.webp",
            alt: "Card “Captação de Casas e Terrenos”. À esquerda, o modelo do grupo “CAP - Casas e Terrenos - Trindade, Florianópolis”, com o padrão da foto dos imóveis: foto da fachada, um pouco da calçada, bem iluminada, bom contraste; ajuste no ChatGPT para iluminação solar e remoção do que estiver na frente do imóvel. À direita, o passo a passo: 01 vistoria in loco, indo até a casa ou terreno; 02 foto padrão da capa, fachada frontal; 03 foto da placa da imobiliária que estiver no imóvel, para fazer as pesquisas; 04 identificar o endereço — rua, número e bairro; 05 identificar o contato do proprietário, conversando com vizinhos e pessoas próximas para chegar ao contato direto. Modelo do nome do grupo: CAP, hífen, Casas e Terrenos, hífen, bairro, vírgula, cidade.",
            largura: "cheia",
          },
        ],
      },
      {
        chave: "card-abordagem-padrao",
        titulo: "Abordagem padrão",
        resumo:
          "O roteiro dos primeiros trinta segundos, com o texto pronto.",
        passos: [],
        conteudo: [
          {
            tipo: "imagem",
            src: "/img/treinamento/cards/16-abordagem-padrao.webp",
            alt: "Card “Abordagem Padrão”. À esquerda, retrato de um corretor de camisa verde da Tridium, com o padrão de vestimenta: uniforme oficial, crachá visível, aparência alinhada. À direita, o roteiro de abordagem em três passos — apresentar-se, gerar credibilidade, deixar o contato — e o texto pronto: “Olá, tudo bem? Meu nome é [nome], sou corretor da Tridium Imóveis. Somos uma imobiliária nova, que nasceu de uma construtora com mais de 10 anos de atuação em Florianópolis. Já trabalhamos na construção e reforma do Floripa Shopping, de hospital da cidade e de diversos prédios da prefeitura. Posso deixar meu cartão com o(a) senhor(a)? Se pensar em vender ou alugar, é só me chamar.” Materiais e próximos passos: cartão de visita, para entregar ao possível proprietário; flyer, para divulgar a imobiliária nas caixas de correio da região; vídeo da empresa, cujo link se envia após pegar o contato.",
            largura: "cheia",
          },
        ],
      },
    ],
  },
  /* ---------------------------------------------------------------- 16
     GERENTE COMERCIAL — a regua, vista do lado de quem e medido.

     O modulo nao e para o gerente: e para o corretor entender COMO e medido
     e com base em que. Regua escondida vira surpresa no fim do mes; regua
     escrita vira combinado.

     [A CONFIRMAR PELA CASA] A pauta da reuniao, as taxas de conversao do
     funil e o que acontece quando a meta nao vem sao processo interno, e a
     Tridium ainda nao fixou nenhum dos tres. O que esta aqui foi montado do
     que o proprio treinamento ja pressupoe — meta semanal, rotina, plantao,
     carteira cadastrada — e serve para a gestao corrigir, nao para valer
     como norma antes disso.
     --------------------------------------------------------------------- */
  {
    chave: "gerencia",
    numero: "16",
    titulo: "Gerente comercial",
    tituloCurto: "Gerência",
    resumo:
      "O que a gerência acompanha, quando acompanha e com base em quê. Corretor que conhece a régua para de ser surpreendido por ela.",
    objetivo:
      "Saber quais números a gerência olha, o que levar para a reunião da semana, como fechar a sexta-feira e o que acontece quando a meta não vem — antes de a conversa acontecer.",
    icone: "comercial",
    imagem: {
      alt: "Reunião de equipe comercial numa imobiliária, com o gerente diante do quadro de metas da semana",
      descricao: "A régua, combinada antes de ser cobrada",
    },
    topicos: [
      {
        chave: "gerencia-papel",
        titulo: "O que o gerente comercial faz",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Gerente comercial não é o corretor que vendeu mais e ganhou uma sala. É uma função diferente da de vender: quem vende responde pela própria carteira, quem gerencia responde pelo resultado de um time que não controla diretamente. São dois trabalhos, e confundir os dois é o erro mais comum do cargo.",
          },
          {
            tipo: "secao",
            titulo: "Quatro frentes, e só quatro",
            itens: [
              "DISTRIBUIR — quem atende qual cliente, quem fica no plantão, quem agencia em que região. Divisão malfeita é briga de comissão no mês seguinte.",
              "ACOMPANHAR — olhar os números da semana antes que o mês acabe. Mês fechado é diagnóstico tardio.",
              "DESTRAVAR — proposta parada, documento que não chega, proprietário que sumiu. O que o corretor não resolve sozinho sobe, e tem de voltar resolvido.",
              "FORMAR — o treinamento é desta casa. Corretor novo que aprende sozinho aprende os vícios de quem está ao lado.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que não é função da gerência",
            itens: [
              "Fechar o negócio no lugar do corretor. Ajudar numa negociação difícil, sim; assumir a mesa, não — o cliente passa a tratar com o gerente e o corretor perde a relação.",
              "Ser o funil de toda informação. Se tudo passa pela gerência, a gerência vira o gargalo.",
              "Cobrar número sem ter combinado o critério antes. Meta sem critério escrito é discussão garantida.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Para o corretor, na prática",
            texto:
              "O que a gerência pode cobrar de você é o que foi combinado por escrito: a meta, o critério dela e a rotina da semana. Tudo isso está na sua tela de gestão. Se algo for cobrado e não estiver lá, o problema é do combinado, não seu — e é para ser resolvido na reunião, não no fim do mês.",
          },
        ],
      },
      {
        chave: "gerencia-funil",
        titulo: "O funil: por que a meta não é só venda",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Venda é o fim de uma fila, e a fila é longa. Entre o primeiro contato e a assinatura há quatro ou cinco etapas, cada uma com uma perda. Por isso a casa mede atividade — contatos, atendimentos, visitas — e não só o resultado: quando a venda não vem, o número da venda não diz onde quebrou.",
          },
          {
            tipo: "secao",
            titulo: "As etapas, na ordem",
            itens: [
              "CONTATO — alguém com quem você falou pela primeira vez, por qualquer canal.",
              "ATENDIMENTO — contato que virou conversa com perfil de busca registrado. Sem perfil registrado, não é atendimento; é um número salvo.",
              "VISITA — atendimento que foi ver imóvel.",
              "PROPOSTA — visita que virou oferta por escrito.",
              "FECHAMENTO — proposta aceita, contrato assinado.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Como se lê isso quando a venda não vem",
            itens: [
              "Muitos contatos e poucos atendimentos: o problema é a abordagem — o módulo 03 é o lugar.",
              "Muitos atendimentos e poucas visitas: o problema é o filtro. Está oferecendo o que não cabe no perfil ou no bolso.",
              "Muitas visitas e poucas propostas: o problema é o imóvel ou o preço — e às vezes é a captação, lá atrás, que entrou acima do mercado.",
              "Muitas propostas e poucos fechamentos: o problema é a negociação ou a documentação travando.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A conta que importa",
            texto:
              "Se de cada dez atendimentos sai uma venda, então uma venda por mês exige dez atendimentos por mês — e os atendimentos exigem os contatos da rotina de segunda-feira. A meta de atividade não é controle: é a conta de trás para frente do resultado que você quer.",
          },
        ],
        atencao:
          "A Tridium ainda não mediu as próprias taxas de conversão: quantos contatos viram atendimento, quantos atendimentos viram visita. Enquanto não houver três meses de números registrados, a conta acima é um raciocínio, não a régua da casa.",
      },
      {
        chave: "gerencia-reuniao",
        titulo: "A reunião da semana e o fechamento da sexta",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Duas conversas por semana, em dois momentos diferentes e com finalidades opostas: a de segunda distribui e combina, a de sexta registra o que aconteceu. Sem a de sexta, a de segunda vira repetição de promessa.",
          },
          {
            tipo: "secao",
            titulo: "Segunda — pauta fixa, trinta minutos",
            itens: [
              "O que entrou na carteira na semana passada, e o que saiu.",
              "Quem atende o quê: plantão, visitas marcadas, agenciamentos em andamento.",
              "O que está travado e precisa da gerência — com nome, imóvel e o que falta.",
              "As metas da semana que começa.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Sexta — o fechamento, que é do corretor",
            texto:
              "No fim da semana, cada corretor manda o próprio resumo: metas, rotina cumprida e agenda. A tela de gestão monta esse texto pronto — o botão “Copiar resumo”, no fim da semana — e você só cola no grupo.",
            itens: [
              "É declaração, não auditoria: quem escreve é quem fez.",
              "Semana fraca também se manda. O resumo que só aparece na semana boa deixa de ser informação e vira propaganda.",
              "O que ficou para trás entra na pauta de segunda, e não numa cobrança isolada.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Por que isso é copiado e colado, e não automático",
            texto:
              "Enquanto o painel não tiver login de verdade e banco de dados, o que você marca na tela fica no seu navegador e a gerência não vê. O resumo colado é a ponte até lá. Quando houver banco, o mesmo texto se monta sozinho do outro lado — e aí o fechamento deixa de depender de alguém lembrar.",
          },
        ],
      },
      {
        chave: "gerencia-meta-nao-veio",
        titulo: "Quando a meta não vem",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Mês fechado abaixo da meta acontece com todo corretor, e a diferença entre um mês ruim e um problema é o que se faz na semana seguinte. A gerência olha para isso em três passos, e o corretor pode — e deve — fazer os mesmos três antes de ser chamado.",
          },
          {
            tipo: "secao",
            titulo: "Primeiro: onde quebrou",
            texto:
              "Não se começa pela venda que faltou, mas pela etapa do funil que secou. Sem atendimento não há visita; sem visita não há proposta. Corretor que não bateu a meta de vendas mas fez a rotina inteira tem um problema diferente de quem não fez a rotina.",
          },
          {
            tipo: "secao",
            titulo: "Segundo: o que é controlável",
            itens: [
              "Atividade é controlável: número de contatos, follow-up feito, visita confirmada.",
              "Resultado não é: o cliente que desistiu, o financiamento negado, o proprietário que tirou o imóvel do mercado.",
              "Cobrar resultado de quem fez a atividade inteira é desmoralizar a régua. Cobrar atividade é justo em qualquer mês.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Terceiro: o combinado da semana seguinte",
            texto:
              "A conversa termina com uma coisa escrita, específica e verificável em sete dias — “vinte contatos de prospecção até sexta”, não “melhorar o desempenho”. O que não dá para conferir na semana seguinte não é combinado, é desabafo.",
          },
          {
            tipo: "fecho",
            titulo: "A regra que vale para os dois lados",
            texto:
              "O corretor chega na conversa com os próprios números na mão; a gerência chega com a régua que já estava combinada. Se qualquer um dos dois tiver de descobrir o número na hora, a conversa já começou errada.",
          },
        ],
        atencao:
          "O que acontece depois de meses seguidos abaixo da meta — advertência, mudança de carteira, desligamento — é política da casa e ainda não foi definida. Enquanto não for, não há consequência combinada, e cobrar uma que ninguém escreveu é o tipo de coisa que vira discussão trabalhista.",
      },
    ],
  },

  /* ---------------------------------------------------------------- 17
     CRECI — o conselho que autoriza, e que pode desautorizar.

     Este modulo e o par do modulo 01: la esta de onde vem a profissao, aqui
     esta o que mantem voce dentro dela. Tudo conferido no texto da lei e nas
     resolucoes, com as fontes em cada aula.

     NENHUM VALOR DE ANUIDADE OU DE TAXA ENTRA AQUI, de proposito. Eles mudam
     todo ano, por resolucao do COFECI, e numero errado numa pagina de
     treinamento e pior do que numero nenhum: o corretor planeja em cima
     dele. O lugar de consultar e o site do regional, e e isso que a aula
     manda fazer.
     --------------------------------------------------------------------- */
  {
    chave: "creci",
    numero: "17",
    titulo: "CRECI",
    tituloCurto: "CRECI",
    resumo:
      "O conselho que autoriza você a trabalhar — e que pode tirar essa autorização. O que ele exige, o que fiscaliza e o que leva a processo disciplinar.",
    objetivo:
      "Manter o próprio registro em dia, saber o que precisa constar em cada peça que você publica e reconhecer, antes de cometer, as condutas que levam a processo no conselho.",
    icone: "aluguel",
    imagem: {
      alt: "Carteira profissional de corretor de imóveis emitida pelo CRECI, sobre uma mesa de trabalho",
      descricao: "A credencial que autoriza o ofício",
    },
    topicos: [
      {
        chave: "creci-o-que-e",
        titulo: "O conselho e o que ele pode fazer",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O CRECI não é uma associação de classe nem um sindicato: é uma autarquia, com personalidade jurídica de direito público. Em português: é braço do Estado. O que ele decide num processo disciplinar tem força administrativa, e a multa que ele aplica se cobra como dívida.",
          },
          {
            tipo: "secao",
            titulo: "Dois níveis",
            itens: [
              "COFECI — o conselho federal. Edita as resoluções que valem no país inteiro: código de ética, regras de publicidade, tabela de anuidade.",
              "CRECI — o conselho regional, um por estado. É onde você se inscreve, para quem você paga e quem fiscaliza o seu dia a dia.",
            ],
            fonte: "Lei nº 6.530/1978, que regula a profissão, e Decreto nº 81.871/1978, que a regulamenta.",
          },
          {
            tipo: "secao",
            titulo: "O que o conselho pode fazer com você",
            itens: [
              "Fiscalizar — o fiscal entra em plantão, em stand de lançamento e em imobiliária, e pede a carteira.",
              "Autuar quem exerce sem registro, inclusive a pessoa jurídica que emprega corretor não inscrito.",
              "Instaurar processo disciplinar por infração ética, com direito a defesa.",
              "Aplicar sanção, que vai de advertência a multa, suspensão e cancelamento da inscrição.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Por que isso importa para quem está começando",
            texto:
              "A intermediação imobiliária é das poucas atividades em que trabalhar sem a credencial não é só irregular: é exercício ilegal da profissão. E não existe “estou só ajudando um amigo a vender” — o que define a atividade é a intermediação habitual, não o contrato de trabalho.",
          },
        ],
        fontes: [
          {
            rotulo: "Lei nº 6.530/1978 — regula a profissão de corretor de imóveis",
            href: "https://www2.camara.leg.br/legin/fed/lei/1970-1979/lei-6530-12-maio-1978-365766-norma-pl.html",
          },
          {
            rotulo: "Decreto nº 81.871/1978 — regulamenta a Lei 6.530",
            href: "https://www.planalto.gov.br/ccivil_03/decreto/antigos/d81871.htm",
          },
        ],
      },
      {
        chave: "creci-registro",
        titulo: "Tirar e manter o registro",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O registro não é um diploma que se emoldura: é uma inscrição que se mantém. Ela exige formação na entrada e permanece exigindo coisas depois — anuidade, cadastro atualizado e, se você atuar em outro estado, uma segunda inscrição.",
          },
          {
            tipo: "secao",
            titulo: "Para entrar",
            itens: [
              "Formação: curso Técnico em Transações Imobiliárias (TTI) ou graduação em Gestão Imobiliária reconhecida pelo sistema COFECI/CRECI.",
              "Estágio supervisionado, dentro do curso.",
              "Inscrição no CRECI do estado onde você vai atuar, com os documentos que o regional pedir.",
              "Pagamento das taxas e da anuidade do exercício.",
            ],
            fonte: "O Decreto nº 81.871/1978 limita o exercício a quem tem o título de Técnico em Transações Imobiliárias inscrito no CRECI da jurisdição.",
          },
          {
            tipo: "secao",
            titulo: "Para manter",
            itens: [
              "Anuidade em dia. Inadimplência leva a cobrança e pode chegar a suspensão do exercício.",
              "Cadastro atualizado: endereço, telefone e e-mail. Notificação de processo vai para o endereço cadastrado, e “não recebi” não suspende prazo.",
              "Carteira dentro da validade — ela vence e se renova.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Atuar em outro estado: inscrição secundária",
            texto:
              "O CRECI é regional, e a inscrição vale na jurisdição em que foi concedida. Quem mora num estado e atende em outro precisa de inscrição secundária no regional do segundo estado. É o caso de quem atua entre Santa Catarina e Rio Grande do Sul, por exemplo.",
          },
          {
            tipo: "fecho",
            titulo: "O que conferir hoje, na sua carteira",
            texto:
              "Número, seccional e data de validade. A seccional é a sigla do estado colada ao número — CRECI-SC, CRECI-RS — e ela faz parte do registro: o número sozinho não identifica inscrição nenhuma.",
          },
        ],
        atencao:
          "Os valores de taxa e de anuidade mudam todo ano, por resolução do COFECI, e variam entre regionais. Nenhum valor é citado aqui de propósito: consulte o site do CRECI do seu estado antes de planejar o gasto.",
      },
      {
        chave: "creci-publicidade",
        titulo: "O número na peça",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Toda peça que oferece imóvel é peça publicitária, e peça publicitária de corretor tem de trazer o número de inscrição. Vale para a placa no muro, para o anúncio no portal, para o post no Instagram, para o e-mail e para o site.",
          },
          {
            tipo: "secao",
            titulo: "Onde o número precisa aparecer",
            itens: [
              "Placa de venda ou locação no imóvel.",
              "Anúncio em portal, jornal e classificado.",
              "Post que oferece imóvel — no post ou, no mínimo, no perfil que o publica.",
              "Assinatura de e-mail profissional.",
              "Site e material impresso da imobiliária.",
            ],
            fonte: "Lei nº 6.530/1978 e Resolução COFECI nº 492/2007, sobre publicidade na atividade de corretagem.",
          },
          {
            tipo: "secao",
            titulo: "Erros que o fiscal enxerga de longe",
            itens: [
              "Número de outra pessoa na peça — o do titular da imobiliária, quando quem anuncia é o corretor, ou o contrário.",
              "Número sem a seccional.",
              "Anúncio de imóvel sem autorização do proprietário. A exigência da autorização é anterior à do número, e é a que mais gera reclamação.",
              "Peça de pessoa jurídica sem a inscrição da própria imobiliária, que também é inscrita.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A coerência cobra de nós também",
            texto:
              "Este treinamento cobra o número do CRECI em cinco aulas diferentes. Vale olhar para as peças da própria casa com o mesmo rigor — placa, portal, post, e-mail e site — antes de cobrar de quem está começando.",
          },
        ],
        fontes: [
          {
            rotulo: "Lei nº 6.530/1978",
            href: "https://www2.camara.leg.br/legin/fed/lei/1970-1979/lei-6530-12-maio-1978-365766-norma-pl.html",
          },
        ],
      },
      {
        chave: "creci-etica",
        titulo: "Código de Ética e o que leva a processo",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O Código de Ética Profissional dos Corretores de Imóveis é uma resolução do COFECI, e o descumprimento dele é infração disciplinar — não é recomendação de boas maneiras. A maior parte dos processos não nasce de má-fé: nasce de desorganização que virou prejuízo para alguém.",
          },
          {
            tipo: "secao",
            titulo: "O que mais aparece em reclamação",
            itens: [
              "Anunciar imóvel sem autorização do proprietário.",
              "Receber valor do cliente — sinal, aluguel, taxa — fora do caixa da imobiliária, em conta pessoal.",
              "Prometer o que não se pode cumprir: aprovação de financiamento, prazo de obra, rendimento de aluguel.",
              "Omitir defeito ou ônus que você conhecia. Dívida de condomínio, penhora, área menor do que a anunciada.",
              "Atropelar colega: atender cliente que já está em atendimento com outro corretor da casa, ou de outra, sem acordo.",
              "Usar dado de cliente que veio de uma parceria para prospecção própria.",
            ],
          },
          {
            tipo: "secao",
            titulo: "As sanções, em ordem",
            itens: [
              "Advertência verbal.",
              "Censura escrita.",
              "Multa.",
              "Suspensão da inscrição, de até noventa dias.",
              "Cancelamento da inscrição, com apreensão da carteira.",
            ],
            fonte: "Resolução COFECI nº 326/1992 — Código de Ética Profissional dos Corretores de Imóveis.",
          },
          {
            tipo: "fecho",
            titulo: "A regra prática",
            texto:
              "Quase tudo que vira processo seria evitado por três hábitos que o resto deste treinamento já pede: autorização assinada antes de anunciar, dinheiro de cliente só pelo caixa da casa, e tudo que foi prometido registrado por escrito. Não é ética abstrata — é rotina.",
          },
        ],
        fontes: [
          {
            rotulo: "Código de Ética Profissional dos Corretores de Imóveis (Resolução COFECI 326/1992)",
            href: "https://www.crecisp.gov.br/Files/notify/71f27005-77ce-47fb-8d10-3c2365681464_codigoeticaci.pdf",
          },
        ],
      },
      {
        chave: "creci-cnai",
        titulo: "Avaliar imóvel: o CNAI",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Opinar sobre preço para vender é uma coisa; emitir parecer técnico de avaliação é outra, e a segunda tem credencial própria. A confusão entre as duas é frequente e cara, porque parecer assinado por quem não pode assinar não serve para nada — e ainda expõe quem assinou.",
          },
          {
            tipo: "secao",
            titulo: "A diferença",
            itens: [
              "OPINIÃO DE VALOR — a estimativa que o corretor faz para precificar a captação, com base em comparativos de mercado. Faz parte do trabalho de qualquer corretor inscrito.",
              "PARECER TÉCNICO DE AVALIAÇÃO MERCADOLÓGICA (PTAM) — documento técnico, com metodologia, usado em inventário, partilha, processo judicial, garantia bancária. Exige o CNAI.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O CNAI",
            texto:
              "Cadastro Nacional de Avaliadores Imobiliários, mantido pelo sistema COFECI/CRECI. Obtém-se com curso e exame próprios, por cima da inscrição de corretor — não substitui o CRECI, soma-se a ele.",
          },
          {
            tipo: "fecho",
            titulo: "Quando mandar para quem tem",
            texto:
              "Pedido que venha de advogado, de juízo, de inventário ou de banco é avaliação técnica, não opinião de preço. Se você não tem o CNAI, encaminhe para quem tem — inclusive dentro da casa. Assinar o que não se pode assinar é das formas mais rápidas de virar processo no conselho.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 18
     METAS E PREMIACOES — a regua e o premio, por escrito.

     Este modulo e o par da tela de gestao: o que la aparece como barra e
     bolinha, aqui aparece como combinado. A aula explica COMO SE CONTA, que
     e onde mora toda discussao de fim de mes.

     [A DEFINIR PELA CASA] Os numeros das metas e as recompensas das
     premiacoes. Eles vivem em `perfisCorretor` e em `premiacoesDaCasa`,
     marcados como exemplo, e aparecem na tela como "a definir" em vez de
     sumir: o que falta decidir fica a vista de quem decide.
     --------------------------------------------------------------------- */
  {
    chave: "metas-premiacoes",
    numero: "18",
    titulo: "Metas e premiações",
    tituloCurto: "Metas",
    resumo:
      "Quanto, em quanto tempo e o que conta como um. Meta sem critério escrito é desejo, e premiação sem apuração clara é promessa.",
    objetivo:
      "Saber exatamente o que precisa acontecer para uma meta contar, acompanhar a própria semana sem depender de ninguém e entender como cada premiação é apurada.",
    icone: "cobertura",
    imagem: {
      alt: "Quadro de metas da equipe comercial, com os números da semana preenchidos à mão",
      descricao: "O combinado, à vista dos dois lados",
    },
    topicos: [
      {
        chave: "metas-criterio",
        titulo: "O que conta como um",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Toda discussão de fim de mês é a mesma: duas pessoas contando a mesma coisa de jeitos diferentes. O corretor conta a visita de avaliação que fez; a casa conta o imóvel que entrou na carteira. Os dois estão de boa-fé, e o problema não é o número — é o critério, que ninguém escreveu antes.",
          },
          {
            tipo: "secao",
            titulo: "Um critério serve se responde a três perguntas",
            itens: [
              "O que precisa existir para contar? Documento, assinatura, cadastro — algo verificável depois.",
              "Quando conta? Na data da assinatura, na do cadastro, na do pagamento?",
              "Quem confere? Se a resposta for “ninguém”, o critério não existe.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Os critérios da casa, hoje",
            itens: [
              "AGENCIAMENTO — conta imóvel com autorização assinada e cadastrado na carteira. Visita de avaliação sem assinatura não conta.",
              "VENDA — [A DEFINIR] se conta na proposta aceita, na assinatura do contrato ou no registro. São três datas diferentes, e podem cair em meses diferentes.",
              "LOCAÇÃO — [A DEFINIR] se entra na mesma meta de vendas ou em meta própria.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Por que o critério protege você",
            texto:
              "Critério escrito não é desconfiança: é o que impede que a sua conta seja revista depois do fato. Enquanto um estiver como “a definir” na sua tela, ele está em aberto para os dois lados — e é melhor fechá-lo numa reunião de segunda do que num fim de mês.",
          },
        ],
      },
      {
        chave: "metas-semana",
        titulo: "A semana: rotina, meta e fechamento",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "A sua tela de gestão tem três coisas, e elas respondem a perguntas diferentes. A rotina responde “o que a casa espera de mim hoje”. A meta responde “como estou indo”. O fechamento responde “o que eu entrego na sexta”.",
          },
          {
            tipo: "secao",
            titulo: "A semana é de segunda a domingo",
            texto:
              "É a semana ISO, a mesma que o mercado usa. A virada acontece na madrugada de domingo para segunda, e a contagem zera sozinha ali. Isso é proposital: sem zerar, o número de uma semana boa fica inflando o da seguinte e a régua perde o sentido.",
          },
          {
            tipo: "secao",
            titulo: "Rotina da casa e compromisso próprio",
            itens: [
              "ROTINA DA CASA — igual para todos, definida pela gestão. Prospecção, follow-up, plantão, post, fechamento.",
              "COMPROMISSO PRÓPRIO — visita, vistoria, reunião. Você põe na agenda do dia.",
              "Não escreva nome, telefone ou dado de cliente na agenda enquanto o painel não tiver login de verdade.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Sexta: o fechamento",
            texto:
              "O botão “Copiar resumo”, no fim da tela da semana, monta o texto com metas, rotina marcada e agenda, e copia. Você cola no grupo da gestão. Semana fraca também se manda: resumo que só aparece na semana boa deixa de ser informação.",
          },
          {
            tipo: "fecho",
            titulo: "Onde isso fica guardado",
            texto:
              "No seu navegador, e só nele. Trocar de computador começa do zero, e a gerência não vê nada do que você marcou. É por isso que o fechamento é copiado e colado à mão. Quando houver login de verdade e banco de dados, isso passa a ser seu em qualquer máquina — e chega sozinho do outro lado.",
          },
        ],
      },
      {
        chave: "metas-premiacoes-casa",
        titulo: "As premiações",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Uma premiação tem três partes, e falta de qualquer uma transforma o prêmio em mal-entendido: a condição (o que precisa acontecer), o período (em quanto tempo) e a recompensa (o que se ganha). Prêmio anunciado sem as três vira cobrança sem contrapartida.",
          },
          {
            tipo: "secao",
            titulo: "Dois tipos, e eles funcionam diferente",
            itens: [
              "POR META PRÓPRIA — “bateu três agenciamentos na semana, ganha”. Depende só do seu número. Você acompanha sozinho e sabe na hora se bateu.",
              "POR RANKING — “quem vender mais no mês”. Depende do número de todo mundo ao mesmo tempo, e só a casa consegue apurar.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que a casa precisa deixar escrito antes de anunciar",
            itens: [
              "O critério da condição — o mesmo da meta, para não haver duas contagens.",
              "O desempate, nas premiações por ranking. Dois corretores com três vendas cada: ganha quem vendeu mais caro, quem fechou primeiro, os dois?",
              "O que acontece com quem entrou no meio do período.",
              "Quando e como se paga ou se entrega.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Na sua tela",
            texto:
              "As premiações aparecem na coluna da direita da gestão. A que depende só do seu número mostra o andamento — “2/3 agenciamentos” — e ganha o selo quando fecha. A que depende de ranking aparece com um cadeado, dizendo o que falta para ser apurada.",
          },
        ],
        atencao:
          "As recompensas das duas premiações da casa estão como [A DEFINIR]. Elas aparecem na tela assim, em vez de sumir, para ficarem à vista de quem decide — mas enquanto estiverem nesse estado, não são prêmio prometido a ninguém.",
      },
      {
        chave: "metas-apuracao",
        titulo: "Como se apura, e o que ainda não dá para apurar",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Vale saber o que o sistema de hoje consegue e o que não consegue, porque isso muda o que você pode cobrar dele. Nada aqui é limitação permanente: é o estado atual, e o conserto já está mapeado.",
          },
          {
            tipo: "secao",
            titulo: "O que funciona hoje",
            itens: [
              "Meta semanal com alvo definido: você marca, a barra anda, zera na virada da semana.",
              "Premiação por meta própria dentro da semana: apura sozinha, na sua tela.",
              "Fechamento da semana em texto, para mandar à gestão.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que não funciona, e por quê",
            itens: [
              "META DE MÊS — o registro é semanal e zera toda segunda. Fechar o mês exige guardar as semanas num lugar que não é o navegador.",
              "PREMIAÇÃO POR RANKING — comparar corretores exige os números de todos ao mesmo tempo.",
              "A GERÊNCIA VER SEM PEDIR — hoje ela só vê o que você colou no grupo.",
              "TROCAR DE COMPUTADOR — o que está marcado fica na máquina em que foi marcado.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que destrava os quatro de uma vez",
            texto:
              "Os quatro são o mesmo problema: não há banco de dados nem login de verdade. Com eles, a marcação deixa de ser do navegador e passa a ser do corretor — em qualquer máquina, visível para a gestão, somável por mês e comparável entre a equipe.",
          },
          {
            tipo: "fecho",
            titulo: "Enquanto isso",
            texto:
              "A contagem da semana é honra pessoal, e é assim que deve ser tratada. Marcar o que não foi feito não engana sistema nenhum: engana só a conversa de segunda-feira, que é onde o seu mês ainda dava para ser corrigido.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 19
     CARTORIO — qual deles faz o que, e o que trava em cada um.

     A confusao que este modulo desfaz e a mais cara do mercado: tabelionato
     de notas e registro de imoveis sao cartorios DIFERENTES, com funcoes
     diferentes, e cliente mandado ao errado volta uma semana depois sem
     nada resolvido.

     Conferido no texto da lei. O art. 108 do Codigo Civil tem uma
     controversia real sobre QUAL valor conta para os trinta salarios
     minimos — o das partes ou o venal —, e a aula diz que a controversia
     existe em vez de escolher um lado.
     --------------------------------------------------------------------- */
  {
    chave: "cartorio",
    numero: "19",
    titulo: "Cartório",
    tituloCurto: "Cartório",
    resumo:
      "Qual cartório faz o quê, quando a escritura é obrigatória e o que trava uma lavratura. Cliente mandado ao cartório errado volta uma semana depois sem nada resolvido.",
    objetivo:
      "Dizer ao cliente a qual cartório ir e por quê, saber quando a lei exige escritura pública e chegar ao tabelionato com a lista de documentos completa.",
    icone: "condominio",
    imagem: {
      alt: "Balcão de tabelionato de notas, com escritura sendo conferida antes da assinatura",
      descricao: "Onde o negócio vira documento público",
    },
    topicos: [
      {
        chave: "cartorio-qual",
        titulo: "Qual cartório faz o quê",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "“Vai no cartório” é uma instrução incompleta, e o custo dela é uma semana do cliente. São serventias distintas, com atribuições distintas, e quase sempre em endereços distintos.",
          },
          {
            tipo: "secao",
            titulo: "Os três que aparecem no nosso trabalho",
            itens: [
              "TABELIONATO DE NOTAS — lavra escritura, faz procuração pública, reconhece firma, autentica cópia, lavra ata notarial. É onde o negócio vira documento público.",
              "REGISTRO DE IMÓVEIS — guarda a matrícula do imóvel e faz registro e averbação. É onde a propriedade efetivamente muda de dono. Cada imóvel pertence a uma circunscrição, e só ela pode registrar.",
              "REGISTRO DE TÍTULOS E DOCUMENTOS (RTD) — registra contratos particulares para dar data certa e publicidade. Não transfere imóvel.",
            ],
          },
          {
            tipo: "secao",
            titulo: "A ordem das coisas numa compra e venda",
            itens: [
              "1. Tabelionato de notas: lavra-se a escritura, com o ITBI já pago.",
              "2. Registro de imóveis: leva-se a escritura para registro na matrícula.",
              "Só no passo 2 o comprador vira proprietário. Escritura assinada e não registrada não transfere nada.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A frase que evita a viagem perdida",
            texto:
              "Tabelionato de notas é qualquer um, à escolha das partes. Registro de imóveis é obrigatoriamente o da circunscrição onde fica o imóvel — não se escolhe, e não adianta ser mais perto.",
          },
        ],
      },
      {
        chave: "cartorio-escritura",
        titulo: "A escritura pública",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "A regra geral está no art. 108 do Código Civil: negócio que transmite direito real sobre imóvel de valor superior a trinta salários mínimos exige escritura pública, salvo disposição legal em contrário. Abaixo disso, instrumento particular basta.",
          },
          {
            tipo: "secao",
            titulo: "A controvérsia que você precisa conhecer",
            texto:
              "Qual valor conta para os trinta salários mínimos? O Enunciado 289 da Jornada de Direito Civil diz que é o atribuído pelas partes, não o fiscal. Mas há decisões — inclusive em dúvida registral — que tomam o valor da avaliação do Fisco. A consequência prática é direta: um imóvel vendido por pouco, mas com valor venal alto, pode ter o contrato particular recusado no registro.",
            fonte: "Código Civil, art. 108; Enunciado 289 da Jornada de Direito Civil; decisões do Conselho Superior da Magistratura de São Paulo em dúvida registral.",
          },
          {
            tipo: "secao",
            titulo: "As exceções que mais aparecem",
            itens: [
              "Financiamento imobiliário com alienação fiduciária: o contrato do banco tem, por lei, força de escritura pública e vai direto a registro.",
              "Operações do Sistema Financeiro da Habitação, pela mesma lógica.",
              "Compromisso de compra e venda não é exceção: é contrato preliminar, registrável, mas não transmite a propriedade.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "O que dizer ao cliente",
            texto:
              "Não prometa que o instrumento particular resolve sem confirmar duas coisas: o valor de referência que o registro da circunscrição adota e se a operação tem financiamento com garantia. Na dúvida, escritura pública — ela nunca é recusada por excesso de formalidade.",
          },
        ],
        fontes: [
          {
            rotulo: "Código Civil (Lei nº 10.406/2002), art. 108",
            href: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",
          },
        ],
      },
      {
        chave: "cartorio-procuracao",
        titulo: "Procuração",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Vendedor que não pode comparecer manda um procurador — e é aí que negócio bom desanda. A procuração tem forma, poderes e validade, e qualquer um dos três errado derruba a escritura na hora da lavratura.",
          },
          {
            tipo: "secao",
            titulo: "As três coisas que se confere",
            itens: [
              "FORMA — para vender imóvel, a procuração tem de ser pública, lavrada em tabelionato. Instrumento particular com firma reconhecida não serve quando o negócio exige escritura pública.",
              "PODERES — tem de dizer expressamente que o procurador pode vender aquele imóvel, receber o preço e dar quitação. Poderes genéricos de “administrar bens” não autorizam venda.",
              "VALIDADE — procuração com prazo vencido não vale, e procuração sem prazo pode ter sido revogada. O tabelionato confere a certidão de que ela continua em vigor.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Os sinais de alerta",
            itens: [
              "Procuração antiga, de anos atrás, para vender um imóvel específico.",
              "Outorgante idoso ou doente, sem contato possível. Se não dá para confirmar que a pessoa está viva e lúcida, não se fecha.",
              "Procurador que também é o comprador — conflito de interesse, que exige autorização expressa.",
              "Procuração feita no exterior sem apostilamento.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A regra da casa",
            texto:
              "Procuração entra na pasta do negócio como documento a conferir, junto com as certidões — e não como detalhe de última hora. Conferir na véspera da assinatura é tarde: refazer uma procuração pública leva dias, e às vezes o outorgante está em outra cidade.",
          },
        ],
      },
      {
        chave: "cartorio-documentos",
        titulo: "O que levar, e o que trava",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O tabelionato só lavra com a documentação completa, e a conferência é feita na hora. Chegar faltando uma certidão não adia a assinatura em uma hora: adia em dias, porque remarcar depende da agenda de três ou quatro pessoas.",
          },
          {
            tipo: "secao",
            titulo: "Das pessoas",
            itens: [
              "Documento de identidade e CPF de todos os que assinam.",
              "Certidão de casamento atualizada, quando casados — o regime de bens define quem precisa assinar.",
              "Pacto antenupcial registrado, se houver.",
              "Comprovante de endereço e profissão.",
              "Anuência do cônjuge, quando o regime exigir. Falta dela é das causas mais comuns de escritura adiada.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Do imóvel",
            itens: [
              "Certidão de matrícula atualizada, do registro de imóveis da circunscrição.",
              "Certidão negativa de débitos de IPTU.",
              "Declaração de quitação de condomínio, quando for o caso.",
              "Comprovante de pagamento do ITBI, calculado pela prefeitura.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que trava",
            itens: [
              "Matrícula desatualizada — a certidão tem prazo curto de validade para esse uso.",
              "Nome que não bate: casamento, divórcio ou nome social sem averbação na matrícula.",
              "Imóvel com construção não averbada, quando a operação envolve financiamento.",
              "ITBI calculado sobre valor diferente do declarado na escritura.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "Quem monta essa pasta é o corretor",
            texto:
              "Nenhum desses documentos aparece sozinho. O corretor que pede todos na semana da proposta chega à assinatura sem susto; o que pede na véspera descobre o problema quando não há mais tempo de resolver.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- 20
     REGISTRO DE IMOVEIS — onde a propriedade realmente muda de dono.

     O PRAZO DA PRENOTACAO FOI CONFERIDO, e ainda bem: eram 30 dias e PASSARAM
     A SER 20, pela Lei 14.382/2022, que mudou o art. 205 da Lei 6.015/73. A
     mesma lei mandou contar os prazos de prenotacao em dias uteis (art. 9º,
     §1º). Escrever "trinta dias" de memoria teria posto um prazo errado numa
     pagina que o corretor usa para orientar cliente.
     --------------------------------------------------------------------- */
  {
    chave: "registro-imoveis",
    numero: "20",
    titulo: "Registro de Imóveis",
    tituloCurto: "Registro",
    resumo:
      "A matrícula, o que entra nela e o que derruba um título na porta. É aqui que a propriedade muda de dono — escritura assinada e não registrada não transfere nada.",
    objetivo:
      "Ler uma certidão de matrícula e dizer quem é o dono, o que pesa sobre o imóvel e o que falta para o negócio poder ser registrado.",
    icone: "terreno",
    imagem: {
      alt: "Certidão de matrícula de imóvel aberta sobre a mesa, com os registros e averbações numerados em sequência",
      descricao: "A vida inteira do imóvel, numa folha",
    },
    topicos: [
      {
        chave: "registro-matricula",
        titulo: "A matrícula",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Cada imóvel tem uma matrícula, e só uma: um número no cartório da circunscrição onde ele está. Ela abre com a descrição do imóvel e, dali em diante, recebe em ordem tudo o que acontece com ele — venda, hipoteca, penhora, divórcio do dono, construção, mudança de nome de rua.",
          },
          {
            tipo: "secao",
            titulo: "O que a matrícula diz",
            itens: [
              "A descrição do imóvel: medidas, confrontações, área, localização.",
              "Quem é o proprietário atual, e como ele se tornou proprietário.",
              "Tudo o que pesa sobre o imóvel: hipoteca, alienação fiduciária, penhora, usufruto, indisponibilidade.",
              "A cadeia inteira de donos anteriores, cada um num ato numerado.",
            ],
            fonte: "Lei nº 6.015/1973 — Lei de Registros Públicos.",
          },
          {
            tipo: "secao",
            titulo: "Por que o corretor pede a certidão logo no agenciamento",
            itens: [
              "Para confirmar que quem está vendendo é quem consta como dono.",
              "Para descobrir ônus antes de anunciar — penhora na matrícula inviabiliza financiamento.",
              "Para conferir a área real contra a que o proprietário informou.",
              "Para ver se a construção está averbada. Casa “no papel” como terreno não passa em financiamento.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A frase para o cliente",
            texto:
              "O que vale é o que está na matrícula. Contrato, recibo, escritura na gaveta e palavra de vizinho não transferem propriedade: enquanto o registro não for feito, o dono é quem a matrícula diz que é.",
          },
        ],
        fontes: [
          {
            rotulo: "Lei nº 6.015/1973 — Lei de Registros Públicos (texto consolidado)",
            href: "https://www.planalto.gov.br/ccivil_03/leis/l6015consolidado.htm",
          },
        ],
      },
      {
        chave: "registro-averbacao",
        titulo: "Registro e averbação: a diferença que muda tudo",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "As duas palavras parecem sinônimos e não são. A lei separa os atos em duas listas, no art. 167: no inciso I, os que se REGISTRAM; no inciso II, os que se AVERBAM. A diferença não é burocrática — ela define se um direito nasceu ou se apenas uma informação foi atualizada.",
          },
          {
            tipo: "secao",
            titulo: "Registro",
            texto:
              "É o ato que cria, transfere ou extingue direito real. Compra e venda, doação, hipoteca, alienação fiduciária, incorporação. Antes do registro, o direito não existe perante terceiros.",
          },
          {
            tipo: "secao",
            titulo: "Averbação",
            texto:
              "É a anotação que altera ou acrescenta informação a algo já registrado, sem criar direito novo. Construção concluída, demolição, mudança de nome por casamento ou divórcio, alteração de numeração da rua, cancelamento de hipoteca já paga.",
          },
          {
            tipo: "secao",
            titulo: "As três que mais atrasam negócio",
            itens: [
              "AVERBAÇÃO DE CONSTRUÇÃO — imóvel construído e não averbado consta como terreno. Banco não financia o que não existe na matrícula.",
              "BAIXA DE HIPOTECA — financiamento quitado não some sozinho. Sem a averbação do cancelamento, o ônus continua lá.",
              "MUDANÇA DE ESTADO CIVIL — nome que não bate entre o documento e a matrícula trava a lavratura no tabelionato.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A pergunta certa no agenciamento",
            texto:
              "Não é “está tudo certo com o imóvel?”. É: a construção está averbada, o financiamento anterior foi baixado e o nome na matrícula é o nome do documento de hoje? As três se conferem numa certidão e evitam semanas de atraso na reta final.",
          },
        ],
      },
      {
        chave: "registro-principios",
        titulo: "Os princípios que derrubam um título",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "O oficial do registro não carimba o que chega: ele qualifica o título, e pode recusá-lo. As recusas quase sempre caem num punhado de princípios, e conhecê-los permite ao corretor antever o problema enquanto ainda há tempo.",
          },
          {
            tipo: "secao",
            titulo: "Continuidade",
            texto:
              "A cadeia de titularidades não pode ter buraco. Quem transmite tem de ser quem consta como dono. Se o imóvel passou de A para B por contrato nunca registrado, B não pode vender para C: falta um elo, e o registro recusa.",
            fonte: "Lei nº 6.015/1973, art. 195.",
          },
          {
            tipo: "secao",
            titulo: "Especialidade",
            texto:
              "O imóvel e as pessoas têm de estar individualizados sem margem a dúvida — medidas e confrontações de um lado, qualificação completa das partes do outro, inclusive estado civil e regime de bens. Imóvel rural exige georreferenciamento.",
          },
          {
            tipo: "secao",
            titulo: "Prioridade",
            texto:
              "Quem chega primeiro ao protocolo tem preferência. Dois títulos sobre o mesmo imóvel não se resolvem por data de assinatura, e sim por ordem de apresentação no cartório.",
            fonte: "Lei nº 6.015/1973, art. 186.",
          },
          {
            tipo: "secao",
            titulo: "Territorialidade",
            texto:
              "O registro é feito na serventia da circunscrição onde o imóvel está. Cartório errado não é demora: é ato nulo.",
          },
          {
            tipo: "fecho",
            titulo: "O que isso significa na prática",
            texto:
              "A recusa mais comum que o corretor encontra é de continuidade, e ela nasce de um negócio antigo que ninguém registrou. Quando a matrícula mostra um dono diferente do vendedor, o problema não é do seu negócio — é de um anterior, e precisa ser resolvido antes.",
          },
        ],
        fontes: [
          {
            rotulo: "Lei nº 6.015/1973 — Lei de Registros Públicos (texto consolidado)",
            href: "https://www.planalto.gov.br/ccivil_03/leis/l6015consolidado.htm",
          },
        ],
      },
      {
        chave: "registro-prenotacao",
        titulo: "Prenotação: o relógio que começa a correr",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "Quando o título entra no cartório, ele é lançado no protocolo e ganha um número de ordem. Isso é a prenotação, e ela faz duas coisas: garante a sua posição na fila de prioridade e abre um prazo para o registro sair.",
          },
          {
            tipo: "secao",
            titulo: "O prazo, que mudou",
            texto:
              "Os efeitos da prenotação cessam automaticamente se, decorridos vinte dias do lançamento no protocolo, o título não tiver sido registrado por omissão do interessado em atender às exigências. Eram trinta dias até 2022 — a Lei 14.382 reduziu para vinte. A mesma lei determinou que os prazos de vigência da prenotação se contam em dias úteis.",
            fonte: "Lei nº 6.015/1973, art. 205, com a redação dada pela Lei nº 14.382/2022; e art. 9º, §1º, da mesma lei.",
          },
          {
            tipo: "secao",
            titulo: "O que acontece quando o prazo cai",
            itens: [
              "A prioridade se perde. Título apresentado depois do seu, enquanto você resolvia a exigência, pode passar à frente.",
              "O título tem de ser reapresentado, com novos emolumentos.",
              "Se nesse intervalo entrou penhora ou indisponibilidade, o negócio pode simplesmente não registrar mais.",
            ],
          },
          {
            tipo: "fecho",
            titulo: "A rotina que evita o problema",
            texto:
              "Exigência do cartório não espera a semana seguinte. No dia em que a nota de exigência sai, alguém da casa precisa saber o que falta, quem vai buscar e até quando — o relógio já está correndo, e corre em dias úteis.",
          },
        ],
        fontes: [
          {
            rotulo: "Lei nº 14.382/2022 — alterou a Lei de Registros Públicos",
            href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14382.htm",
          },
        ],
      },
      {
        chave: "registro-certidao",
        titulo: "Ler uma certidão de ônus",
        resumo: "",
        passos: [],
        conteudo: [
          {
            tipo: "texto",
            texto:
              "A certidão de matrícula com ônus reais é o documento mais informativo de um negócio imobiliário, e o menos lido. Ela se lê de cima para baixo, em ordem cronológica, e cada ato numerado é um acontecimento na vida do imóvel.",
          },
          {
            tipo: "secao",
            titulo: "A ordem de leitura",
            itens: [
              "1. O cabeçalho: número da matrícula, cartório e descrição do imóvel. Confira a área contra o que foi anunciado.",
              "2. O último ato de registro: é ele que diz quem é o dono hoje.",
              "3. De trás para frente, os ônus: algum deles continua ativo?",
              "4. As averbações: construção, mudança de nome, cancelamentos.",
            ],
          },
          {
            tipo: "secao",
            titulo: "O que acende alerta",
            itens: [
              "PENHORA ou ARRESTO — o imóvel responde por dívida judicial de alguém.",
              "INDISPONIBILIDADE — bloqueio determinado por juízo ou autoridade. Nada se registra enquanto durar.",
              "HIPOTECA ou ALIENAÇÃO FIDUCIÁRIA ativa — há credor, e ele precisa participar do negócio.",
              "USUFRUTO — alguém tem direito de usar o imóvel, mesmo não sendo dono. Vender com usufruto vigente vende um imóvel ocupado.",
              "AÇÃO judicial averbada — litígio em curso sobre o bem.",
              "CLÁUSULAS de inalienabilidade, impenhorabilidade ou incomunicabilidade, comuns em imóvel recebido por doação ou herança.",
            ],
          },
          {
            tipo: "secao",
            titulo: "Ônus cancelado continua aparecendo",
            texto:
              "Ato cancelado não é apagado da matrícula: ele fica, com uma averbação de cancelamento ao lado. Hipoteca quitada e baixada continua visível. Ler o ônus sem ler o cancelamento derruba negócio bom por engano — e deixar de ler o cancelamento que não existe aprova negócio ruim.",
          },
          {
            tipo: "fecho",
            titulo: "Quando pedir, e de quando",
            texto:
              "No agenciamento e de novo antes da assinatura. A matrícula muda: entre a proposta e a escritura podem entrar penhora e indisponibilidade. Certidão de três meses atrás não diz como o imóvel está hoje.",
          },
        ],
        atencao:
          "Certidão de matrícula se pede ao registro de imóveis da circunscrição do imóvel, e hoje a maior parte dos estados emite pela internet. Certidão de inteiro teor mostra tudo; a simplificada pode omitir atos antigos — para negócio, peça o inteiro teor.",
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
  /** Quando a inscrição vence, "AAAA-MM-DD". O registro vence, e o primeiro
      a ser avisado tem de ser quem depende dele. */
  creciVence?: string;
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

/* -----------------------------------------------------------------------------
   ROTINA DA CASA
   -----------------------------------------------------------------------------
   O que a Tridium espera de qualquer corretor, dia a dia da semana. É IGUAL
   PARA TODOS e mora aqui, no repositório, por dois motivos: é regra da casa,
   não preferência de quem está logado, e versionada dá para saber quando
   mudou e por quê.

   É a metade "o que eu tenho que fazer" da gestão. A outra metade — visita,
   reunião, vistoria — é compromisso próprio do corretor, que ele mesmo põe na
   agenda; ver `lib/gestaoCorretor`.

   `dia` é o número ISO: 1 é segunda, 6 é sábado. Domingo (7) não entra de
   propósito — se a casa quiser rotina de domingo, basta acrescentar.

   `quantidade` é quantos daquilo no dia. Sem ela, a tarefa é uma só coisa:
   fez ou não fez.

   ⚠ [EXEMPLO] A semana abaixo foi montada a partir do que o próprio
   treinamento já ensina — prospecção nos portais, follow-up com prazo,
   plantão, post com CRECI, fechamento na sexta. Serve para a tela ficar de
   pé e para a conversa ter de onde partir. A rotina de verdade é a gestão
   que define.
   ----------------------------------------------------------------------------- */

export interface TarefaDaRotina {
  chave: string;
  /** Dia ISO: 1 segunda … 6 sábado. */
  dia: number;
  titulo: string;
  /** Quantos no dia. Sem isso, é uma só coisa: fez ou não fez. */
  quantidade?: number;
  /** O que conta como feito. Sem isso a tarefa vira discussão na sexta. */
  observacao?: string;
}

export const rotinaDaCasa: TarefaDaRotina[] = [
  {
    chave: "prospeccao-portais",
    dia: 1,
    titulo: "Prospecção nos portais",
    quantidade: 10,
    observacao:
      "Anúncio de proprietário direto. Conta o contato feito, não o número salvo.",
  },
  {
    chave: "revisar-carteira",
    dia: 1,
    titulo: "Revisar a carteira: foto, preço e descrição",
  },
  {
    chave: "follow-up",
    dia: 2,
    titulo: "Follow-up dos atendimentos da semana passada",
    quantidade: 5,
    observacao: "Quem visitou e não respondeu entra aqui antes de esfriar.",
  },
  {
    chave: "visitas-agendadas",
    dia: 2,
    titulo: "Confirmar as visitas da semana",
  },
  { chave: "plantao-meio", dia: 3, titulo: "Plantão" },
  {
    chave: "post-instagram",
    dia: 3,
    titulo: "Post no Instagram",
    quantidade: 1,
    observacao: "Peça publicitária: o CRECI é obrigatório no post ou no perfil.",
  },
  {
    chave: "visita-avaliacao",
    dia: 4,
    titulo: "Visita de avaliação para agenciamento",
    quantidade: 1,
  },
  { chave: "atualizar-cadastro", dia: 4, titulo: "Atualizar os cadastros do dia" },
  {
    chave: "fechamento",
    dia: 5,
    titulo: "Fechamento da semana: mandar o resumo para a gestão",
  },
  {
    chave: "confirmar-fim-de-semana",
    dia: 5,
    titulo: "Confirmar as visitas do fim de semana",
  },
  { chave: "plantao-sabado", dia: 6, titulo: "Plantão de vendas" },
];

/** As tarefas de um dia ISO, na ordem em que foram escritas. */
export function rotinaDoDia(dia: number): TarefaDaRotina[] {
  return rotinaDaCasa.filter((t) => t.dia === dia);
}

/* -----------------------------------------------------------------------------
   PREMIAÇÕES
   -----------------------------------------------------------------------------
   Premiação é condição + período + recompensa. A condição é que decide se ela
   funciona hoje ou não, e a diferença é grande:

     `{ meta, alvo }`  — "bateu três agenciamentos na semana, ganha". Depende
                         só do número de uma pessoa, e essa pessoa é quem está
                         com a tela aberta. FUNCIONA AGORA.

     `{ ranking }`     — "quem vender mais no mês". Precisa dos números de
                         todos os corretores ao mesmo tempo, e isso é banco de
                         dados. Aparece na tela como trancada, dizendo o que
                         falta, em vez de sumir: a premiação está decidida, só
                         não dá para apurar ainda.

   ⚠ [EXEMPLO] As duas abaixo existem para os dois formatos ficarem de pé. As
   recompensas estão como [A DEFINIR] porque a casa ainda não disse quais são.
   ----------------------------------------------------------------------------- */

export interface Premiacao {
  chave: string;
  titulo: string;
  /** O que a pessoa ganha. */
  recompensa: string;
  periodo: "semana" | "mes" | "trimestre";
  condicao:
    | { tipo: "meta"; meta: string; alvo: number }
    | { tipo: "ranking"; posicao: number };
}

export const premiacoesDaCasa: Premiacao[] = [
  {
    chave: "agenciador-da-semana",
    titulo: "Três agenciamentos na semana",
    recompensa: "[A DEFINIR]",
    periodo: "semana",
    condicao: { tipo: "meta", meta: "agenciamento", alvo: 3 },
  },
  {
    chave: "destaque-do-mes",
    titulo: "Destaque de vendas do mês",
    recompensa: "[A DEFINIR]",
    periodo: "mes",
    condicao: { tipo: "ranking", posicao: 1 },
  },
];

/** "Segunda", "Terça"… a partir do dia ISO. Domingo é 7. */
export const nomeDoDia: Record<number, string> = {
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
  7: "Domingo",
};
