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

export interface TopicoProcedimento {
  chave: string;
  titulo: string;
  resumo: string;
  /** O passo a passo, na ordem em que acontece. */
  passos: string[];
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
  topicos: TopicoProcedimento[];
}

export const procedimentos: EtapaProcedimento[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    chave: "captacao",
    numero: "01",
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
    numero: "02",
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
    numero: "03",
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
    numero: "04",
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
    numero: "05",
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
    numero: "06",
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
    numero: "07",
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
    numero: "08",
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
    numero: "09",
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
