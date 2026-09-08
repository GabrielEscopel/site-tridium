# Grupo Tridium — site institucional

Site do Grupo Tridium (Florianópolis/SC) com as três frentes do grupo:
**Engenharia & Arquitetura**, **Imobiliária** e o projeto social **Lar Digno**.

Next.js 15 (App Router) · Tailwind CSS 4 · GSAP + ScrollTrigger · Three.js · Lenis · pt-BR.

---

## Rodando localmente

Requisitos: Node.js 18.18+ (testado no 24) e npm.

```bash
npm install
```

```bash
npm run dev
```

Abre em <http://localhost:3000>.

Build de produção e execução:

```bash
npm run build
```

```bash
npm start
```

> `next build` grava em `.next-build` e `next dev` em `.next`. A separação é
> proposital: rodando um build com o servidor de desenvolvimento no ar, os
> assets do dev seriam apagados e a página passaria a carregar sem CSS.

---

## Rotas

| Rota | Página | Tema |
| --- | --- | --- |
| `/` | Hub do grupo, com o portal para as três frentes | escuro institucional |
| `/engenharia` | Tridium Engenharia | escuro / verde de marca |
| `/imobiliaria` | Imobiliária | claro / ouro |
| `/lar-digno` | Projeto Lar Digno | claro quente / terracota |

`/sitemap.xml` e `/robots.txt` são gerados pelo próprio Next.

---

## Direção de arte

A paleta **não foi inventada**: os quatro valores saíram dos arquivos de logo
oficiais em `/Logos`, medidos pixel a pixel.

| Cor | Hex | Papel |
| --- | --- | --- |
| Verde mata | `#1B3F1C` | base institucional escura |
| Verde sinal | `#02B030` | acento — é o verde do símbolo |
| Cinza musgo | `#57604F` | neutro médio quente |
| Osso | `#EAEDE6` | base institucional clara |

Os acentos das outras duas frentes derivam do verde da marca por rotação dos
próprios canais RGB (`02/B0/30` → `B0/8A/02`), o que mantém saturação e peso
óptico entre as três identidades:

- Engenharia — `#02B030` (verde sinal)
- Imobiliária — `#B08A02` (ouro)
- Lar Digno — `#C4522C` (terracota)

**Tipografia**

- **Archivo** em largura expandida (títulos) — reproduz a proporção larga e as
  terminações retas do wordmark Tridium.
- **Inter** (leitura corrida).
- **IBM Plex Mono** (rótulos, dados, legendas) — é o eco direto do
  `ENGENHARIA E CONSTRUÇÃO` travado sob o logo, e traz o vocabulário de prancha
  técnica que a marca já usa.

**Elemento-assinatura** — o símbolo da Tridium são três galões descendo sobre
uma base sólida: três frentes, uma fundação. Essa leitura organiza o site
inteiro. Na home ele aparece extrudado em 3D (`CenaMarca`): ao carregar, os
galões descem e travam sobre a base; ao rolar, se separam nas três cores das
frentes, e o usuário chega nos portais já sabendo o que está escolhendo.

---

## Onde trocar as coisas

### Cores e tipografia

Tudo vive em [`src/app/globals.css`](src/app/globals.css), no bloco `:root` e
nos três blocos `[data-front="…"]`. **Nenhum componente tem cor hard-coded.**
Para aplicar o manual de marca oficial, altere só esse arquivo.

Cada página aplica seu tema com um único atributo:

```tsx
<div data-front="imobiliaria"> … </div>
```

Isso troca superfície, tinta, linhas e acento de toda a árvore abaixo.

> **Sobre `--accent` e `--accent-texto`:** o acento puro é a cor de marca e vive
> em preenchimentos, fios e áreas grandes. Em texto pequeno sobre fundo claro
> ele não alcança 4.5:1, então existe uma versão escurecida (`--accent-texto`)
> usada por todo texto. Ao trocar a paleta, mantenha esse par — ou o contraste
> AA cai junto.

### Conteúdo

Todo texto editável está em `src/content/`. Nenhum componente escreve telefone,
endereço ou texto institucional direto.

| Arquivo | O que contém |
| --- | --- |
| `src/content/site.ts` | dados do grupo, contato, WhatsApp, endereço, as 3 frentes, navegação, logos |
| `src/content/engenharia.ts` | posicionamento, serviços, cases, processo, números |
| `src/content/imobiliaria.ts` | textos, diferenciais, carteira de imóveis, serviços |
| `src/content/larDigno.ts` | missão, capítulos da jornada, impacto, como ajudar |

### Imagens

- Fotos otimizadas em `public/img/{frente}/` (WebP, redimensionadas).
- Logos oficiais em `public/logos/`.
- Cartões de Open Graph em `public/og/` — regeráveis, ver abaixo.

Para trocar uma foto, substitua o arquivo em `public/img/…` mantendo o nome, ou
aponte outro caminho no arquivo de conteúdo. Depois de substituir arquivos com o
dev server no ar, limpe o cache de imagens:

```bash
rm -rf .next/cache/images
```

---

## Pendências de conteúdo

Os placeholders **aparecem na tela**, não só no código: enquanto houver um
marcador `◇` visível numa página, ela não está pronta para ir ao ar.

- **`◇ Foto pendente`** — painel desenhado (`FotoPendente`) que descreve
  exatamente qual foto precisa ser produzida. Some sozinho quando o campo
  `imagem` deixa de ser `null`.
- **`◇ …pendente`** — etiqueta tracejada (`Pendente`) para texto, número ou dado
  de contato que ainda não veio.
- Nos arquivos de conteúdo, procure por `[CONTEÚDO PENDENTE]`,
  `[CONTEÚDO IMOBILIÁRIA PENDENTE]`, `[FOTO PENDENTE]` e `[N]`.

Para varrer tudo o que falta:

```bash
grep -rn "PENDENTE" src/content/
```

### Decisões que precisam do cliente

1. **Nome do projeto social.** O briefing diz **“Lar Digno”**; a pasta de assets
   entregue diz **“Morada Digna”**. O site usa “Lar Digno” (rota `/lar-digno`).
   O nome está isolado em `larDigno.nome` — trocar ali propaga para tudo, mas a
   rota e o `sitemap` precisam ser renomeados junto se o oficial for outro.

2. **Fotos dos cases de Engenharia.** Rhinno Skatepark, Marquise Floripa,
   Brincademia e Totens estão **sem foto de propósito**. As imagens disponíveis
   eram banco de imagens genérico (mesas de projeto, renders): publicadas sob a
   legenda “Rhinno Skatepark” elas passariam por registro do projeto. Cada card
   mostra um painel dizendo qual foto produzir.

3. **Números.** Nenhum número de obra ou de impacto social é real — todos estão
   como `[N]`. Número estimado em projeto social custa confiança; melhor a
   seção entrar depois do que entrar errada.

4. **Fotos provisórias que estão no ar** (marcadas com `◇ Foto provisória`):
   heróis das três páginas, carteira da imobiliária e capítulos 1–3 do Lar
   Digno. São imagens de banco genéricas, e devem ser trocadas por registro
   próprio.

5. **Dados institucionais:** endereço completo, CEP, CNPJ, e-mail, CRECI da
   imobiliária e o domínio definitivo (`SITE_URL` em `src/content/site.ts`).

---

## Performance e acessibilidade

- **Todas as rotas são estáticas** (SSG). ~160 kB de JS no primeiro
  carregamento.
- **Three.js não entra no bundle inicial** — é `import()` dinâmico, e só carrega
  em aparelho que passa na triagem de `src/lib/motion.ts` (WebGL disponível,
  memória/núcleos suficientes, sem `saveData`, sem `prefers-reduced-motion`).
  Quem não passa recebe o mesmo símbolo em SVG estático, sem custo de GPU.
- **`prefers-reduced-motion`** desliga o scroll suave, os pins horizontais e
  todas as revelações — o conteúdo continua completo e na mesma ordem.
- Imagens via `next/image` com `lazy` fora da primeira dobra, `sizes` corretos e
  WebP/AVIF.
- Contraste verificado em AA (4.5:1) para texto em todas as combinações de tinta
  e superfície das três frentes.
- Navegação por teclado: skip link, foco visível com o acento da frente, foco
  preso no menu mobile, `Esc` fecha e devolve o foco ao botão.
- Um `<h1>` por página, hierarquia de headings sem saltos, `alt` em toda imagem.

---

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx           tipografia, metadados globais, header/footer/FAB
│  ├─ globals.css          ⭐ TODOS os tokens de design
│  ├─ page.tsx             hub do grupo
│  ├─ engenharia/          /engenharia
│  ├─ imobiliaria/         /imobiliaria
│  ├─ lar-digno/           /lar-digno
│  ├─ sitemap.ts robots.ts
├─ components/
│  ├─ MarcaTridium.tsx     símbolo em SVG, traçado do logo oficial
│  ├─ CenaMarca.tsx        símbolo em 3D (Three.js) + fallback
│  ├─ PortaisFrentes.tsx   as três faixas do hub
│  ├─ GaleriaCases.tsx     portfólio em percurso horizontal
│  ├─ JornadaCapitulos.tsx scrollytelling do Lar Digno
│  ├─ FotoPendente.tsx     placeholder desenhado de foto
│  ├─ Header / Footer / WhatsappFab / Reveal / SmoothScroll / ui / JsonLd
├─ content/                ⭐ TODO o texto editável
└─ lib/
   ├─ motion.ts            triagem de desempenho e movimento reduzido
   └─ seo.ts               metadados por rota + schema.org
```

---

## Regerando os cartões de Open Graph

`public/og/*.png` foram gerados por script (Python + Pillow) usando Arial Black
como stand-in — **a tipografia oficial dos cartões ainda não é a Archivo**.
Quando houver o arquivo da fonte, aponte `BLACK`/`BOLD` para ela e regere.
