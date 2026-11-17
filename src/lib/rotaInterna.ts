/* =============================================================================
   ROTAS INTERNAS — o que não leva a casca do site público
   -----------------------------------------------------------------------------
   A área do corretor é um aplicativo interno, não uma página do site: ela tem
   o próprio cabeçalho, com as marcas da parceria, e não precisa do menu
   público, do rodapé institucional nem do botão flutuante do WhatsApp.

   Sem isto, o cabeçalho fixo do site monta POR CIMA do cabeçalho da área e as
   duas marcas da Tridium aparecem sobrepostas — foi exatamente o que
   aconteceu quando a área de treinamento ganhou cabeçalho próprio.

   A regra mora aqui, num lugar só, porque três componentes precisam dela.
   ============================================================================= */

const INTERNAS = ["/imobiliaria/corretor"];

export function rotaInterna(pathname: string | null): boolean {
  if (!pathname) return false;
  return INTERNAS.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}
