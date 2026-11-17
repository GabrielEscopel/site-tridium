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
  | { tipo: "fecho"; titulo: string; texto: string };

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
  imagem?: { src?: string; alt: string; descricao: string; credito?: string };
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
    /* A imagem e uma peca do CRECI-SC sobre a historia da corretagem: a
       metade esquerda em sepia — caravela, casario colonial, homens de
       cartola sobre uma planta, pena e tinteiro — e a direita em cor, com
       arranha-ceus, casa moderna, corretor com clientes e laptop. Diz o que
       a aula diz, numa olhada.

       Quadrada, 800x800. Por isso ela entra ao LADO do texto, nao como
       faixa deitada: numa faixa 21:9 o corte comeria a caravela em cima e a
       mesa com a planta embaixo, que e justamente a passagem do tempo que a
       imagem conta. */
    imagem: {
      src: "/img/treinamento/historia-corretagem.webp",
      alt: "Montagem do CRECI-SC: a corretagem do passado, em sepia, dando lugar ao mercado atual",
      descricao: "A corretagem, do passado ao presente",
      credito: "CRECI-SC",
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
    resumo:
      "Como o corretor chega. Em um negócio em que o cliente decide a quem confiar o maior bem que tem, a primeira impressão é parte do serviço.",
    objetivo:
      "Apresentar-se em trinta segundos de um jeito que dê vontade de continuar a conversa, chegar a uma visita vestido e preparado para ela, e manter um perfil público que ajude em vez de atrapalhar.",
    icone: "aluguel",
    topicos: [
      {
        chave: "discurso",
        titulo: "A apresentação em trinta segundos",
        resumo:
          "O que dizer quando perguntam o que você faz. Treinado, sai natural; improvisado, sai confuso.",
        passos: [
          "Nome, o que faz e onde atua, em uma frase.",
          "O diferencial da casa em outra: avaliação técnica de quem constrói.",
          "Uma pergunta no fim, que devolve a palavra ao outro.",
          "Treinar em voz alta até sair sem pensar — decorado soa decorado, sabido soa natural.",
        ],
        atencao:
          "Apresentação não é currículo. Ninguém quer ouvir a lista de cursos no primeiro minuto; a formacao aparece quando ela responde a uma dúvida real do cliente.",
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
      {
        chave: "postura",
        titulo: "Postura e aparência",
        resumo:
          "O cliente lê o corretor antes de ouvir o que ele diz.",
        passos: [
          "Vestir-se um grau acima do cliente, nunca abaixo.",
          "Levar sempre: documento com foto, cartão, carregador e água.",
          "Chegar antes do horário combinado, sempre.",
          "Celular no silencioso durante a visita, e fora da mão.",
          "Carro limpo por dentro: em muitas visitas ele é a primeira sala de reunião.",
        ],
      },
      {
        chave: "material",
        titulo: "Material de trabalho",
        resumo:
          "O que precisa estar pronto antes do primeiro atendimento.",
        passos: [
          "Cartão com o número do CRECI — é exigência legal, não enfeite.",
          "Assinatura de e-mail com nome, CRECI e contato.",
          "Foto profissional, a mesma em todos os canais.",
          "Ficha de perfil do cliente, para a qualificação.",
        ],
        exigencia:
          "O número de inscrição no CRECI é obrigatório em toda peça publicitária e material de identificação do corretor (Lei 6.530/78; Resolução COFECI 492/2007).",
      },
      {
        chave: "redes",
        titulo: "Presença nas redes",
        resumo:
          "O cliente procura o nome do corretor antes de responder a mensagem. O que ele acha conta.",
        passos: [
          "Perfil público com foto profissional, cidade de atuação e CRECI na bio.",
          "Separar o perfil pessoal do profissional.",
          "Publicar imóvel com a mesma informação do anúncio — preço diferente em dois lugares derruba a confiança.",
          "Responder mensagem de rede no mesmo prazo do WhatsApp.",
        ],
        atencao:
          "Opinião política, religiosa ou de time no perfil profissional afasta metade dos clientes possíveis, e nunca se sabe qual metade.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 01 */
  {
    chave: "captacao",
    numero: "03",
    titulo: "Captação",
    resumo:
      "Trazer o imóvel para a carteira com preço defensável, documentação em ordem e autorização assinada. Captação malfeita vira anúncio que não fecha.",
    objetivo:
      "Captar um imóvel sozinho: avaliar o preço com comparáveis, conferir a documentação que trava cartório, colher a autorização assinada e produzir o material do anúncio.",
    icone: "casa",
    topicos: [
      {
        chave: "prospeccao",
        titulo: "Prospecção e primeiro contato",
        resumo:
          "De onde vem o imóvel e como a conversa começa. A origem precisa ficar registrada: ela diz quais canais valem o esforço.",
        passos: [
          "Registrar a origem: indicação, placa, portal, redes, carteira antiga, prospecção ativa.",
          "Confirmar quem está falando e se tem poderes para negociar o imóvel.",
          "Levantar o básico por telefone: endereço, tipo, metragem, se está ocupado, se há dívida.",
          "Agendar a visita de avaliação.",
        ],
        atencao:
          "Quem atende nem sempre é quem pode vender. Herança sem inventário, imóvel de espólio e separação em curso travam a venda meses depois — pergunte no primeiro contato.",
      },
      {
        chave: "avaliacao",
        titulo: "Avaliação e definição de preço",
        resumo:
          "O preço sai de comparação com o mercado, não do que o proprietário espera receber. Preço errado é o motivo número um de imóvel encalhado.",
        passos: [
          "Visita técnica com medição e registro fotográfico do estado real.",
          "Levantar comparáveis: mesmo bairro, mesma tipologia, vendidos nos últimos meses — não os anunciados.",
          "Ajustar por andar, posição solar, vaga, estado de conservação e idade.",
          "Montar o parecer com a faixa de preço e a justificativa.",
          "Apresentar ao proprietário e registrar a decisão dele por escrito.",
        ],
        exigencia:
          "Parecer Técnico de Avaliação Mercadológica (PTAM) só pode ser emitido por corretor com CNAI. Sem CNAI, o documento é uma opinião de valor, e precisa estar escrito que é.",
      },
      {
        chave: "laudo-tridium",
        titulo: "Laudo técnico da engenharia",
        resumo:
          "O que nenhuma outra imobiliária de Florianópolis entrega: a avaliação estrutural de quem constrói, antes de o cliente assinar.",
        passos: [
          "Acionar a Tridium Engenharia para vistoria do imóvel captado.",
          "Verificar estrutura, cobertura, instalação elétrica, hidráulica e sinais de infiltração.",
          "Apontar o que precisa de reforma, com ordem de prioridade e estimativa.",
          "Anexar o laudo à ficha do imóvel.",
        ],
        atencao:
          "O laudo é argumento de venda dos dois lados: dá segurança a quem compra e justifica o preço de quem vende. Mas é documento técnico — o que estiver nele vira responsabilidade do grupo.",
      },
      {
        chave: "documentacao-captacao",
        titulo: "Documentação do imóvel e do proprietário",
        resumo:
          "Conferir agora o que travaria o negócio no cartório depois. Documento é o que mais atrasa fechamento.",
        passos: [
          "Matrícula atualizada do imóvel (emitida há menos de 30 dias).",
          "IPTU do ano, com número de inscrição e situação de débito.",
          "Documento e estado civil de todos os proprietários.",
          "Pacto antenupcial, se houver, e anuência do cônjuge.",
          "Habite-se e averbação da construção, quando a obra não estiver na matrícula.",
          "Declaração de quitação do condomínio, se aplicável.",
        ],
        atencao:
          "Construção não averbada impede financiamento bancário. Descobrir isso na análise do banco custa semanas e, muitas vezes, o cliente.",
      },
      {
        chave: "autorizacao",
        titulo: "Autorização de venda ou locação",
        resumo:
          "Sem autorização assinada não há trabalho a fazer. Ela define prazo, preço, exclusividade e comissão.",
        passos: [
          "Definir se é exclusiva ou aberta, e por quanto tempo.",
          "Registrar o preço autorizado e a margem de negociação.",
          "Registrar o percentual de comissão e quem paga.",
          "Colher assinatura de todos os proprietários.",
          "Combinar como será o acesso para visitas.",
        ],
        exigencia:
          "A comissão só é devida quando há aproximação útil comprovada entre as partes (Código Civil, art. 725). Autorização escrita é o que prova isso.",
      },
      {
        chave: "producao",
        titulo: "Produção do material",
        resumo:
          "O anúncio é a vitrine. Foto ruim derruba imóvel bom, e refazer depois custa outra visita.",
        passos: [
          "Fotografar com luz do dia, ambientes arrumados e lente grande angular.",
          "Primeira foto é a que vende: fachada ou o melhor ambiente.",
          "Medir e desenhar a planta, se não houver.",
          "Vídeo ou tour 360°, quando o imóvel justificar.",
          "Cadastrar no sistema e gerar o código do imóvel.",
        ],
        cards: [
          {
            chave: "guia-foto",
            titulo: "Guia de fotografia de imóvel",
            descricao:
              "Ordem dos ambientes, horário de luz, o que tirar do quadro e os enquadramentos que o site espera.",
            tipo: "guia",
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 02 */
  {
    chave: "divulgacao",
    numero: "04",
    titulo: "Divulgação",
    resumo:
      "Colocar o imóvel onde o comprador procura, com a informação que ele precisa para decidir visitar.",
    objetivo:
      "Publicar um imóvel em todos os canais com texto honesto, ficha completa e o CRECI onde a lei exige — e cruzar a carteira interna antes de gastar com portal.",
    icone: "lancamento",
    topicos: [
      {
        chave: "ficha",
        titulo: "Ficha e texto do anúncio",
        resumo:
          "Texto honesto filtra visita perdida. Omitir defeito só adia a conversa difícil.",
        passos: [
          "Título no padrão do site: tipo, dormitórios, suítes e bairro ou empreendimento.",
          "Descrever o que o comprador não vê na foto: posição solar, barulho, acesso, vizinhança.",
          "Listar a ficha técnica completa: áreas, vagas, condomínio, IPTU.",
          "Informar o que está incluso e o que sai com o proprietário.",
          "Revisar antes de publicar: preço, metragem e bairro errados geram processo.",
        ],
        exigencia:
          "Toda peça publicitária precisa trazer o número de inscrição no CRECI (Lei 6.530/78, art. 4º; Resolução COFECI 492/2007). Vale para site, portal, placa, folder e post.",
      },
      {
        chave: "canais",
        titulo: "Canais de divulgação",
        resumo:
          "Cada canal pede um formato. O mesmo texto em todos rende menos do que parece.",
        passos: [
          "Site da Tridium Imóveis, que é a vitrine própria.",
          "Portais de anúncio contratados.",
          "Instagram e WhatsApp: formatos verticais e um recorte diferente do site.",
          "Placa no imóvel, quando autorizado pelo proprietário.",
          "Carteira interna: cruzar com o perfil de busca de quem já procurou algo parecido.",
        ],
        atencao:
          "O cruzamento com a carteira interna costuma fechar antes do portal, e sem custo por lead. É o primeiro movimento, não o último.",
      },
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    chave: "atendimento",
    numero: "05",
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

  /* ------------------------------------------------------------------ 04 */
  {
    chave: "negociacao",
    numero: "06",
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

  /* ------------------------------------------------------------------ 05 */
  {
    chave: "contrato",
    numero: "07",
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

  /* ------------------------------------------------------------------ 06 */
  {
    chave: "fechamento",
    numero: "08",
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

  /* ------------------------------------------------------------------ 07 */
  {
    chave: "locacao",
    numero: "09",
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

  /* ------------------------------------------------------------------ 08 */
  {
    chave: "administrativo",
    numero: "10",
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

  /* ------------------------------------------------------------------ 09 */
  {
    chave: "juridico",
    numero: "11",
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
