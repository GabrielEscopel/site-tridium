"use client";

/* =============================================================================
   CENA MARCA — o momento 3D do site (Three.js)
   -----------------------------------------------------------------------------
   O símbolo da Tridium extrudado em volume. A narrativa da cena é a tese do
   grupo, não um efeito solto:

     ao carregar  →  os três galões descem e travam sobre a base   (uma fundação)
     ao rolar     →  os três se separam e abrem caminho para os portais
                     (três frentes) — quem escolhe é o usuário, logo abaixo.

   Fallback: quando não há WebGL, a bateria pede economia, o aparelho é fraco
   ou o usuário pede movimento reduzido, entra o mesmo símbolo em SVG estático.
   Nada é baixado do Three.js nesse caso — o import é dinâmico.
   ============================================================================= */

import { useEffect, useRef, useState } from "react";
// Apenas os tipos: o Three.js em si so entra pelo import() dinamico abaixo,
// para nao pesar no bundle de quem recebe o fallback estatico.
import type * as TresTipos from "three";
import { MarcaTridium } from "./MarcaTridium";
import { dprSeguro, nivelGrafico, type NivelGrafico } from "@/lib/motion";

/* Cores do símbolo em volume — reprodução fiel do logo oficial: os três galões
   no verde da marca sobre a base em osso. As cores por frente de negócio ficam
   reservadas para os portais, onde cada faixa é de fato uma frente; aqui o
   objeto é o logo, e o logo é verde. */
const COR_GALAO = "#02b030"; // --tri-green
const COR_BASE = "#eaede6"; // --tri-bone

const CONTORNOS = {
  galao1: [
    [0, 0.2], [50, 23], [100, 0.2], [100, 19.1], [50, 40.7], [0, 19.1],
  ],
  galao2: [
    [5.1, 32], [50, 50.2], [94.9, 32], [94.9, 51.2], [50, 69.7], [5.1, 51.2],
  ],
  galao3: [
    [22, 0], [78, 0], [50, 16.5],
  ],
  base: [
    [8.6, 63.9], [50, 79.2], [91.4, 63.9], [91.4, 99.9], [8.6, 99.9],
  ],
} as const;

export function CenaMarca({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [nivel, setNivel] = useState<NivelGrafico | null>(null);

  useEffect(() => {
    setNivel(nivelGrafico());
  }, []);

  useEffect(() => {
    if (!nivel || nivel === "estatico") return;
    const host = hostRef.current;
    if (!host) return;

    let vivo = true;
    let limpar: (() => void) | undefined;

    (async () => {
      const [THREE, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("three"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (!vivo) return;

      gsap.registerPlugin(ScrollTrigger);

      /* --- cena ------------------------------------------------------- */
      const cena = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0.15, 6.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: nivel === "completo",
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(dprSeguro(nivel));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-hidden", "true");
      Object.assign(renderer.domElement.style, {
        width: "100%",
        height: "100%",
        display: "block",
      });

      /* --- luz --------------------------------------------------------- */
      cena.add(new THREE.AmbientLight(0xffffff, 1.15));

      const chave = new THREE.DirectionalLight(0xffffff, 2.1);
      chave.position.set(-2.4, 3.4, 4);
      cena.add(chave);

      // Preenchimento no verde da marca: o volume nunca sai do matiz Tridium
      const preenchimento = new THREE.DirectionalLight(0x2f6b33, 1.5);
      preenchimento.position.set(3.2, -1.6, 2.2);
      cena.add(preenchimento);

      /* --- geometria --------------------------------------------------- */
      const criarForma = (pts: readonly (readonly number[])[]) => {
        const forma = new THREE.Shape();
        pts.forEach(([x, y], i) => {
          // SVG (y para baixo, 0..100) → mundo (y para cima, centrado, -1..1)
          const wx = (x - 50) / 50;
          const wy = (50 - y) / 50;
          if (i === 0) forma.moveTo(wx, wy);
          else forma.lineTo(wx, wy);
        });
        forma.closePath();
        return forma;
      };

      const extrusao = {
        depth: 0.17,
        bevelEnabled: true,
        bevelThickness: 0.022,
        bevelSize: 0.022,
        bevelSegments: nivel === "completo" ? 3 : 1,
        curveSegments: 2,
      };

      const grupo = new THREE.Group();
      cena.add(grupo);

      const pecas = (
        [
          { chave: "galao1", cor: COR_GALAO, contorno: CONTORNOS.galao1 },
          { chave: "galao2", cor: COR_GALAO, contorno: CONTORNOS.galao2 },
          { chave: "galao3", cor: COR_GALAO, contorno: CONTORNOS.galao3 },
          { chave: "base", cor: COR_BASE, contorno: CONTORNOS.base },
        ] as const
      ).map(({ chave, cor, contorno }) => {
        const geo = new THREE.ExtrudeGeometry(criarForma(contorno), extrusao);
        geo.center();
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(cor),
          roughness: 0.44,
          metalness: 0.12,
          transparent: true,
          opacity: 1,
        });
        const malha = new THREE.Mesh(geo, mat);

        /* Cada peça vive dentro do seu próprio trilho. A entrada anima o
           TRILHO e o scroll anima a MALHA — dois objetos distintos, para que
           as duas linhas do tempo nunca disputem a mesma propriedade. Quando
           disputavam, a timeline com scrub capturava o valor no meio da
           entrada e um dos galões ficava fora de quadro. */
        const trilho = new THREE.Group();
        trilho.add(malha);
        grupo.add(trilho);

        return { chave, trilho, malha, geo, mat };
      });

      // Cada peça na altura que ocupa no símbolo original
      const alturaOriginal: Record<string, number> = {
        galao1: (50 - (0.2 + 40.7) / 2) / 50,
        galao2: (50 - (32 + 69.7) / 2) / 50,
        galao3: (50 - (0 + 16.5) / 2) / 50,
        base: (50 - (63.9 + 99.9) / 2) / 50,
      };
      pecas.forEach((p) => {
        p.malha.position.y = alturaOriginal[p.chave];
      });
      grupo.scale.setScalar(1.5);
      grupo.position.y = -0.1;

      const [galao1, galao2, galao3, base] = pecas;

      /* --- render loop -------------------------------------------------- */
      const ponteiro = { x: 0, y: 0 };
      const alvoPonteiro = { x: 0, y: 0 };
      let visivel = true;
      let rafId = 0;

      const render = () => {
        rafId = requestAnimationFrame(render);
        if (!visivel || document.hidden) return;

        ponteiro.x += (alvoPonteiro.x - ponteiro.x) * 0.045;
        ponteiro.y += (alvoPonteiro.y - ponteiro.y) * 0.045;

        grupo.rotation.y = ponteiro.x * 0.34;
        grupo.rotation.x = -0.06 + ponteiro.y * 0.2;

        renderer.render(cena, camera);
      };

      const aoMover = (e: PointerEvent) => {
        alvoPonteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
        alvoPonteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", aoMover, { passive: true });

      const observador = new IntersectionObserver(
        ([entrada]) => {
          visivel = entrada.isIntersecting;
        },
        { rootMargin: "120px" }
      );
      observador.observe(host);

      /* --- dimensionamento ---------------------------------------------- */
      const redimensionar = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Em retrato o símbolo precisa recuar para não encostar nas bordas
        camera.position.z = w / h < 0.9 ? 8.2 : 6.4;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(redimensionar);
      ro.observe(host);
      redimensionar();
      render();

      /* --- coreografia --------------------------------------------------- */
      const ctx = gsap.context(() => {
        // 1. Entrada: os galões descem e travam sobre a base.
        //    Anima o trilho de cada peça.
        const entrada = gsap.timeline({ defaults: { ease: "power3.out" } });

        const descer = (
          peca: (typeof pecas)[number],
          de: number,
          quando: number
        ) => {
          entrada
            .from(peca.trilho.position, { y: de, duration: 1.15 }, quando)
            .from(peca.mat, { opacity: 0, duration: 0.6 }, quando);
        };

        descer(base, -1.4, 0);
        descer(galao2, 2.2, 0.14);
        descer(galao1, 2.9, 0.26);
        descer(galao3, 3.4, 0.38);
        entrada.from(grupo.rotation, { x: 0.5, duration: 1.4, ease: "power2.out" }, 0);

        // 2. Scroll: a fundação se abre nas três frentes.
        //    Anima a malha, com valores absolutos calculados a partir da
        //    altura de repouso — nada de "+=" sobre um alvo em movimento.
        const alvo = (chave: string, dy: number) => alturaOriginal[chave] + dy;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: host.closest("[data-cena-alcance]") ?? host,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
            defaults: { ease: "none", immediateRender: false },
          })
          .to(galao1.malha.position, { x: -0.92, y: alvo("galao1", 0.5), z: 0.5 }, 0)
          .to(galao1.malha.rotation, { z: -0.14, y: 0.34 }, 0)
          .to(galao2.malha.position, { x: 0.95, y: alvo("galao2", 0.12), z: 0.22 }, 0)
          .to(galao2.malha.rotation, { z: 0.12, y: -0.3 }, 0)
          .to(galao3.malha.position, { y: alvo("galao3", 0.95), z: 0.9 }, 0)
          .to(base.malha.position, { y: alvo("base", -0.5) }, 0)
          .to(grupo.scale, { x: 1.12, y: 1.12, z: 1.12 }, 0);
      }, host);

      limpar = () => {
        ctx.revert();
        cancelAnimationFrame(rafId);
        window.removeEventListener("pointermove", aoMover);
        observador.disconnect();
        ro.disconnect();
        pecas.forEach(({ geo, mat }) => {
          geo.dispose();
          mat.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      vivo = false;
      limpar?.();
    };
  }, [nivel]);

  /* Fallback estático — mesmo símbolo, sem custo de GPU. */
  if (nivel === "estatico" || nivel === null) {
    return (
      <div className={className}>
        <MarcaTridium
          className="h-full w-full"
          titulo=""
          galoes={[COR_GALAO, COR_GALAO, COR_GALAO]}
          base={COR_BASE}
        />
      </div>
    );
  }

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
