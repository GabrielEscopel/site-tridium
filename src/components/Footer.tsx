/* =============================================================================
   RODAPÉ GLOBAL
   -----------------------------------------------------------------------------
   Sempre no tema escuro institucional, em qualquer rota: é o ponto em que as
   três frentes voltam a ser um grupo só.
   ============================================================================= */

import Link from "next/link";
import Image from "next/image";
import {
  contato,
  frentes,
  grupo,
  logos,
  whatsappLink,
} from "@/content/site";
import { Pendente } from "./ui";

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer data-front="engenharia" className="bg-surface text-ink">
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr_1fr] lg:gap-16">
          {/* Marca */}
          <div>
            <Image
              src={logos.horizSobreEscuro}
              alt={grupo.nome}
              width={567}
              height={128}
              className="h-9 w-auto"
            />
            <p className="t-body mt-6 max-w-[34ch] text-muted">
              {grupo.descricao}
            </p>
            <p className="t-label mt-8 text-faint">{grupo.assinatura}</p>
          </div>

          {/* Frentes */}
          <nav aria-labelledby="rodape-frentes">
            <h2 id="rodape-frentes" className="t-label text-faint">
              Frentes
            </h2>
            <ul className="mt-6 space-y-4">
              {frentes.map((f) => (
                <li key={f.id}>
                  <Link
                    href={f.href}
                    className="group inline-flex items-baseline gap-3 no-underline"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] rounded-full"
                      style={{ backgroundColor: f.accent }}
                    />
                    <span className="text-ink transition-colors duration-200 group-hover:text-accent-texto">
                      {f.nome}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <div>
            <h2 className="t-label text-faint">Contato</h2>
            <ul className="mt-6 space-y-4">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink transition-colors duration-200 hover:text-accent-texto"
                >
                  WhatsApp {contato.whatsappExibicao}
                </a>
              </li>
              <li>
                <a
                  href={contato.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink transition-colors duration-200 hover:text-accent-texto"
                >
                  Instagram {contato.instagramHandle}
                </a>
              </li>
              <li className="text-muted">
                {contato.email.startsWith("[") ? (
                  <Pendente titulo="Definir e-mail institucional">
                    E-mail pendente
                  </Pendente>
                ) : (
                  <a
                    href={`mailto:${contato.email}`}
                    className="text-ink transition-colors duration-200 hover:text-accent-texto"
                  >
                    {contato.email}
                  </a>
                )}
              </li>
            </ul>

            <h2 className="t-label mt-10 text-faint">Onde estamos</h2>
            <address className="mt-6 not-italic text-muted">
              <p>{grupo.endereco.completo}</p>
              {grupo.endereco.cep.startsWith("[") && (
                <p className="mt-3">
                  <Pendente titulo="Único campo que falta no endereço">
                    CEP pendente
                  </Pendente>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-label text-faint">
            © {ano} {grupo.nome}
          </p>
          <p className="t-label text-faint">
            {grupo.cidade} · {grupo.estado}
          </p>
        </div>
      </div>
    </footer>
  );
}
