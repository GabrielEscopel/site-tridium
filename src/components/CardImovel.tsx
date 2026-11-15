"use client";

/* =============================================================================
   CARD DE IMÓVEL — o desenho da imobiliária de referência
   -----------------------------------------------------------------------------
   A anatomia é a da Sinos Imóveis, que o cliente adotou como modelo, de cima
   para baixo:

     código em pastilha, saindo pela borda de cima
     foto folheável, com selo de finalidade e pontinhos
     empreendimento (quando houver)
     título, que é o link
     localização com pino
     ficha: quartos, suítes, vagas
     caixa de áreas
     preço, e ao lado WhatsApp, compartilhar e Detalhes

   O CARD INTEIRO NÃO É UM LINK, ao contrário do antigo. Ele tem agora três
   ações diferentes no rodapé, e um link envolvendo tudo engoliria as outras
   duas — além de fazer o leitor de tela anunciar o cartão inteiro como um
   alvo só. Quem clica no cartão continua chegando na página: a área da foto
   e o título levam para lá, e o `after:absolute` do título estende a área
   clicável dele por cima de todo o cartão, menos dos botões, que ficam por
   cima com `relative`.

   As cores saem de `.carteira`, em globals.css: verde e ouro da Tridium nos
   papéis que a referência dá ao verde e ao amarelo dela.
   ============================================================================= */

import Link from "next/link";
import {
  areasDoImovel,
  formatarArea,
  formatarPreco,
  tituloImovel,
  type Imovel,
} from "@/content/imobiliaria";
import { contato } from "@/content/site";
import { CarrosselFotos } from "./CarrosselFotos";
import {
  IconeBanho,
  IconeCama,
  IconeCarro,
  IconeCompartilhar,
  IconeEstrela,
  IconePino,
  IconeWhatsapp,
} from "./IconesImovel";

export function CardImovel({
  imovel,
  prioridade = false,
  favorito = false,
  aoFavoritar,
}: {
  imovel: Imovel;
  prioridade?: boolean;
  /** Já está na lista de quem está olhando. */
  favorito?: boolean;
  /** Sem esta função a estrela não aparece — é o que permite reusar o card
      fora da carteira, onde não há lista de favoritos. */
  aoFavoritar?: (chave: string) => void;
}) {
  const href = `/imobiliaria/${imovel.chave}`;
  const titulo = tituloImovel(imovel);
  const areas = areasDoImovel(imovel);

  const mensagem = `Olá! Tenho interesse no imóvel ${imovel.codigo} — ${titulo}.`;
  const whatsapp = `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;

  /* Web Share onde existir (todo celular), cópia do endereço no resto. Sem
     alerta nem toast: o botão troca de rótulo e volta sozinho. */
  const compartilhar = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* A pessoa fechou a folha de compartilhamento. Não é erro. */
    }
  };

  return (
    /* Sem `overflow-hidden` no cartão: a pastilha do código monta a cavalo na
       borda de cima e seria decepada por ele. Quem recorta a foto nos cantos
       arredondados é o próprio contêiner da foto, logo abaixo. O `mt-3` abre
       o espaço que a pastilha ocupa fora do cartão. */
    <article className="group relative mt-3 flex h-full flex-col rounded-2xl border border-[color:var(--cart-card-linha)] bg-[color:var(--cart-card)] shadow-[var(--cart-sombra)] transition-shadow duration-200 hover:shadow-[var(--cart-sombra-alta)]">
      {/* A pastilha do código monta a cavalo na borda de cima, como na
          referência. Fica FORA do contêiner da foto: é ele quem recorta os
          cantos arredondados, e lá dentro ela seria decepada ao meio.
          z-20 porque o carrossel já usa z-10 nas setas. */}
      <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[color:var(--cart-pilula)] px-3 py-1 text-[0.8125rem] font-bold text-[color:var(--cart-pilula-ink)] shadow-[var(--cart-sombra)]">
        <span className="sr-only">Código </span>Cód: {imovel.codigo}
      </span>

      {/* --- Foto --- */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <CarrosselFotos
          fotos={imovel.fotos}
          prioridade={prioridade}
          variante="anuncio"
          tamanhos="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="aspect-[4/3] w-full"
        />

        <span className="absolute left-3 top-3 z-20 rounded-full bg-[color:var(--cart-pilula)] px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] text-[color:var(--cart-pilula-ink)] shadow-[var(--cart-sombra)]">
          {imovel.finalidade === "aluguel" ? "Aluguel" : "Venda"}
        </span>

        {/* Selos descem para a esquerda, embaixo da finalidade: o canto
            superior direito agora é da estrela, e dois blocos ali
            disputariam o mesmo toque no celular. */}
        {imovel.selos && imovel.selos.length > 0 && (
          <ul className="absolute left-3 top-12 z-20 flex flex-wrap gap-1.5">
            {imovel.selos.map((selo) => (
              <li
                key={selo}
                className="rounded-full bg-black/65 px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.1em] text-white"
              >
                {selo}
              </li>
            ))}
          </ul>
        )}

        {aoFavoritar && (
          <button
            type="button"
            onClick={() => aoFavoritar(imovel.chave)}
            aria-pressed={favorito}
            aria-label={
              favorito
                ? `Tirar o imóvel ${imovel.codigo} dos favoritos`
                : `Salvar o imóvel ${imovel.codigo} nos favoritos`
            }
            className={`absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/92 shadow-[var(--cart-sombra)] transition-colors duration-200 hover:bg-white ${
              favorito
                ? "text-[color:var(--cart-acao)]"
                : "text-[color:var(--cart-titulo)]"
            }`}
          >
            <IconeEstrela cheia={favorito} className="h-[1.15rem] w-[1.15rem]" />
          </button>
        )}
      </div>

      {/* --- Corpo --- */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {imovel.empreendimento && (
          <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-[color:var(--cart-titulo)]">
            {imovel.empreendimento}
          </p>
        )}

        <h3 className="text-[1.0625rem] font-semibold leading-snug">
          <Link
            href={href}
            className="text-[color:var(--cart-titulo)] no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {titulo}
          </Link>
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-[color:var(--ink-muted)]">
          <IconePino className="h-4 w-4 shrink-0" />
          {imovel.bairro} · {imovel.cidade}
        </p>

        {(imovel.dormitorios > 0 || imovel.suites || imovel.vagas > 0) && (
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[color:var(--cart-card-linha)] pt-3">
            {imovel.dormitorios > 0 && (
              <Ficha
                icone={<IconeCama />}
                valor={imovel.dormitorios}
                singular="quarto"
                plural="quartos"
              />
            )}
            {imovel.suites ? (
              <Ficha
                icone={<IconeBanho />}
                valor={imovel.suites}
                singular="suíte"
                plural="suítes"
              />
            ) : null}
            {imovel.vagas > 0 && (
              <Ficha
                icone={<IconeCarro />}
                valor={imovel.vagas}
                singular="vaga"
                plural="vagas"
              />
            )}
          </dl>
        )}

        {areas.length > 0 && (
          <dl className="grid gap-2" style={{ gridTemplateColumns: `repeat(${areas.length}, minmax(0, 1fr))` }}>
            {areas.map((a) => (
              <div
                key={a.rotulo}
                className="rounded-md border border-[color:var(--cart-campo-linha)] bg-[color:var(--cart-caixa)] px-3 py-2 text-center"
              >
                <dt className="text-[0.6875rem] uppercase tracking-[0.08em] text-[color:var(--ink-faint)]">
                  {a.rotulo}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-[color:var(--cart-preco)]">
                  {formatarArea(a.valor)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* --- Rodapé: preço e ações ---
            `relative` tira os botões de baixo da área clicável do título. */}
        <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-[1.125rem] font-bold text-[color:var(--cart-preco)]">
            {formatarPreco(imovel.preco)}
            {imovel.finalidade === "aluguel" && imovel.preco !== null && (
              <span className="text-sm font-normal text-[color:var(--ink-faint)]">
                /mês
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Conversar no WhatsApp sobre o imóvel ${imovel.codigo} (abre em nova aba)`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--cart-titulo)]/40 bg-white text-[color:var(--cart-titulo)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)]"
            >
              <IconeWhatsapp className="h-[1.1rem] w-[1.1rem]" />
            </a>

            <button
              type="button"
              onClick={compartilhar}
              aria-label={`Compartilhar o imóvel ${imovel.codigo}`}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--cart-campo-linha)] bg-white text-[color:var(--ink-muted)] transition-colors duration-200 hover:bg-[color:var(--cart-caixa)] hover:text-[color:var(--cart-titulo)]"
            >
              <IconeCompartilhar className="h-[1.1rem] w-[1.1rem]" />
            </button>

            {/* Repete o destino do título. Fica fora da ordem de tabulação
                para o teclado não passar duas vezes pelo mesmo link. */}
            <Link
              href={href}
              tabIndex={-1}
              aria-hidden="true"
              className="rounded-lg bg-[color:var(--cart-pilula)] px-3.5 py-2 text-[0.8125rem] font-bold text-[color:var(--cart-pilula-ink)] no-underline transition-opacity duration-200 hover:opacity-90"
            >
              Detalhes
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Ficha({
  icone,
  valor,
  singular,
  plural,
}: {
  icone: React.ReactNode;
  valor: number;
  singular: string;
  plural: string;
}) {
  const rotulo = valor === 1 ? singular : plural;
  return (
    <div className="flex items-center gap-1.5">
      <dt className="sr-only">{rotulo}</dt>
      <dd className="flex items-center gap-1.5 text-sm text-[color:var(--ink)]">
        <span className="text-[color:var(--cart-titulo)]">{icone}</span>
        <span className="font-semibold">{valor}</span>
        <span className="text-[color:var(--ink-muted)]">{rotulo}</span>
      </dd>
    </div>
  );
}
