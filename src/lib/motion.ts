/* =============================================================================
   MOTION — configuração central de animação
   -----------------------------------------------------------------------------
   Um único lugar decide se e quanto o site anima. Toda animação do projeto
   passa por aqui, então desligar movimento é uma decisão só.
   ============================================================================= */

export function prefereMovimentoReduzido(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Classifica o dispositivo para decidir se vale ligar WebGL.
 * Deliberadamente conservador: na dúvida, entrega o fallback estático.
 */
export type NivelGrafico = "completo" | "reduzido" | "estatico";

export function nivelGrafico(): NivelGrafico {
  if (typeof window === "undefined") return "estatico";
  if (prefereMovimentoReduzido()) return "estatico";

  // Sem WebGL disponível → fallback
  if (!suportaWebGL()) return "estatico";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  // Usuário pediu economia de dados
  if (nav.connection?.saveData) return "estatico";

  const memoria = nav.deviceMemory ?? 4;
  const nucleos = nav.hardwareConcurrency ?? 4;
  const larguraCurta = Math.min(window.innerWidth, window.innerHeight);

  if (memoria <= 2 || nucleos <= 2) return "estatico";
  if (memoria <= 4 || nucleos <= 4 || larguraCurta < 480) return "reduzido";
  return "completo";
}

export function suportaWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/** DPR limitado: acima de 2 o custo cresce sem ganho visual perceptível. */
export function dprSeguro(nivel: NivelGrafico): number {
  if (typeof window === "undefined") return 1;
  const teto = nivel === "completo" ? 2 : 1.5;
  return Math.min(window.devicePixelRatio || 1, teto);
}
