# Pendências do site Grupo Tridium

Levantado em 23 de novembro de 2026. Este arquivo existe para o que fica
combinado entre uma conversa e outra não se perder — nem quando a sessão é
resumida, nem quando passam semanas.

Quem mexer aqui: mantenha os itens **com o porquê**, não só o quê. Item sem
motivo volta a ser discutido do zero.

---

## 1. Bloqueios reais

### Login de verdade

A área do corretor confere usuário e senha **no navegador**, com a senha
escrita no arquivo que o navegador baixa. Não é segurança, e está assim de
propósito até esta etapa ser feita — ver o cabeçalho de
`src/lib/sessaoCorretor.ts`.

Hoje, **cinco funcionalidades** dependem disso para sair do papel:

| arquivo | o que guarda | o que se perde hoje |
|---|---|---|
| `progressoTreinamento.ts` | aulas concluídas | troca de computador, zera |
| `metasCorretor.ts` | metas da semana | idem |
| `favoritos.ts` | imóveis marcados | idem |
| `anotacoesContrato.ts` | alterações anotadas nas cláusulas | idem — e esta é a pior: é a única em que a pessoa **escreve** algo que vai querer de volta |
| ficha de agenciamento | ainda não existe | depende disto para existir |

O que falta, nesta ordem:

1. Banco de dados com usuários e senha guardada em hash (bcrypt ou argon2)
2. Rota de API que confere a senha **no servidor** e devolve sessão assinada
3. Cookie `httpOnly`, que o JavaScript da página não consegue ler
4. **O painel renderizado no servidor**, só depois de conferir a sessão lá

O passo 4 é o que fecha o buraco de verdade. Hoje o conteúdo do treinamento é
entregue a quem pedir o arquivo, com ou sem login — medido com `curl`, sem
sessão, vêm o perfil do corretor e as cláusulas do contrato.

Decisões que são do cliente, e que travam o começo:

- Quem entra? Só o Francis, ou cada corretor com o seu login?
- O corretor troca a própria senha? Se sim, "esqueci minha senha" puxa envio
  de e-mail, que é outra peça.
- Onde fica o banco — e isso depende de **como a Hostinger publica o site**:
  se cada deploy recria a pasta, um arquivo SQLite se perde a cada publicação.
  Essa é a primeira coisa a descobrir.

Antes disso: nada de valor real entra no painel — sem dado de cliente, sem
proposta, sem documento.

### CRECI da Tridium Imóveis

**Não aparece em nenhuma página do site.** É obrigatório em peça publicitária
(Lei 6.530/78, art. 4º; Resolução COFECI 492/2007), e o próprio treinamento
cobra isso em cinco aulas diferentes — site, portal, placa, e-mail e post.

É a incoerência mais visível entre o que o material ensina e o que a casa faz.

Falta também confirmar a seccional do CRECI do Francis: o perfil no site diz
41587, e o contrato de parceria o aponta como responsável técnico perante o
**CRECI-SC**, com o número em branco.

---

## 2. Conteúdo do treinamento

15 módulos, 62 aulas. Os seis primeiros e os dois últimos estão escritos em
formato de aula; **os módulos 07 a 13 ainda estão no formato de processo**
original — passo a passo, sem aulas, sem foto de abertura.

| módulo | estado |
|---|---|
| 07 Atendimento | processo, 3 tópicos. `atendimento-recepcao-card.webp` já guardado para a capa |
| 08 Negociação | processo, 3 tópicos |
| 09 Documentação e contrato | processo, 3 tópicos |
| 10 Fechamento | processo, 2 tópicos |
| 11 Rotina de locação | processo, 4 tópicos |
| 12 Administrativo e financeiro | processo, 2 tópicos |
| 13 Jurídico e conformidade | processo, 2 tópicos |

Outras pendências de conteúdo:

- **Módulo 14, aula 02** — "Imobiliária com corretor" está como roteiro: o
  contrato-modelo ainda não foi fornecido. A redação da parte de vínculo
  trabalhista é trabalho de advogado, não de modelo pronto.
- **Contrato da aula 01 tem dois campos em branco**: o CRECI do responsável
  técnico aparece como `XXXX` e o representante da Tridium como
  `NOME, CPF E QUALIFICAÇÃO`. Assinado assim, dá margem a discussão sobre quem
  se obrigou.
- **`agenciamento-grupos.webp`** está sem uso desde a troca da imagem do
  módulo de Agenciamento.

### Materiais "a produzir"

Oito cards prometem material que ainda não existe. Só a planilha PCI da Caixa
é arquivo de verdade (`public/materiais/`).

- Ficha de agenciamento
- Padrão de foto de empreendimento
- Checklist de campanha
- Modelo de apresentação
- Roteiro de visita
- Modelo de proposta
- Modelos de e-mail
- Modelos de primeira mensagem de WhatsApp
- Roteiro de abordagem em plantão

---

## 3. Para a casa conferir

Coisas que não são bug, mas que alguém da Tridium precisa validar.

- **Card 09 (Isaac)** — traz foto, bairros de atuação e metas de uma pessoa
  identificada, exposta a quem tiver o endereço da página. Mesma situação do
  perfil do Francis.
- **Card 16 (abordagem padrão)** — o script afirma: construtora com mais de 10
  anos em Florianópolis, obras no Floripa Shopping, em hospital da cidade e em
  prédios da prefeitura. É texto que o corretor vai falar para cliente.
- **Percentuais de comissão do módulo 14** — 1% e 3% do contrato com a Sinos
  ficam legíveis por qualquer um com o endereço. Enquanto não houver login,
  decidir se isso fica no ar.
- **Foto da abordagem comercial** — o texto no cordão do crachá está
  embaralhado ("Tridlem Imóveis"), defeito de imagem gerada. Nos 272px do site
  não se lê; em impresso ou banner, aparece.
- **Capa do módulo 14** — a foto tem um documento em inglês e é um contrato de
  confidencialidade de emprego, não de parceria. A bandeira dos EUA foi
  cortada fora no enquadramento; o texto em inglês ficou, pequeno e de cabeça
  para baixo.

### Perguntas abertas ao cliente

- Seccional e número do CRECI do Francis para o contrato
- O trabalho da Moradia Digna é gratuito para a família?
- Núcleo de capoeira: quem conduz, onde, quando, quantos alunos
- Autorização de imagem das crianças nas fotos de capoeira
- O conteúdo removido do módulo de Agenciamento (prospecção, autorização,
  produção de material) deve voltar como aulas 05 em diante?

---

## 4. Infraestrutura

- **DKIM** no e-mail
- **Cabeçalhos de segurança** (CSP, HSTS, X-Frame-Options)
- **Redirecionamento www → sem www**
- **Migração para o Next 16**
- **Dez imagens originais do Instituto** continuam versionadas em `Instituto/`,
  com duas exclusões não registradas. Decidir entre registrar as exclusões ou
  tirar as dez do controle de versão com `git rm --cached`.

Já resolvido, para não ser reaberto: **SSL funciona** — `grupotridium.com.br`
atende em https com redirecionamento do http.

---

## 5. Melhorias oferecidas e não feitas

Nenhuma é necessária; ficam registradas para não se perderem.

- **Clicar no card para abrir em tamanho cheio** (módulo 15). A 751px os
  subtítulos dos cards ficam apertados — limite da largura da coluna, não de
  nitidez.
- **Botão "copiar todas as anotações"** nas cláusulas do módulo 14, para
  mandar ao jurídico sem depender de banco de dados.
- **Rolagem horizontal no celular** — em 390px apareceu indício disso, mas as
  medições do navegador se contradizem e pode ser distorção da emulação.
  Conferir num aparelho de verdade, principalmente com 15 pastilhas na faixa
  de módulos.

---

## Regras da casa, aprendidas na prática

Guardadas aqui porque custaram tempo para descobrir e não são óbvias.

- **`next/image` guarda a imagem em cache pela URL.** Trocar o conteúdo de um
  arquivo no mesmo caminho continua servindo a versão velha. Imagem trocada
  precisa de **nome novo**, e a antiga se apaga depois.
- **O Tailwind v4 escreve rotação e deslocamento nas propriedades `rotate` e
  `translate`**, não em `transform`. Transição que nomeia `transform` não pega
  nenhuma das duas — o efeito acontece de uma vez, sem animação.
- **`sizes` subestimado faz o navegador baixar imagem menor que a caixa** e
  esticar. Em card com letra miúda isso aparece na hora, e o build não acusa.
  Arredondar o `sizes` para cima custa alguns kB.
- **Card com texto desenhado dentro precisa ter o conteúdo no `alt`.** Quem usa
  leitor de tela não enxerga nada do que está na imagem.
- **Não repetir em texto o que o card já mostra.** Aconteceu duas vezes — na
  aula de vestuário e na do carro — e as duas foram desfeitas.
- **O site roda em Node na Hostinger**, não como arquivos estáticos. Rota de
  API, renderização no servidor e banco cabem.
- **Push para `main` dispara o deploy automático.** Commitar não publica;
  enviar publica.
