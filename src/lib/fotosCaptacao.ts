"use client";

/* =============================================================================
   FOTOS DA CAPTAÇÃO — guardadas no navegador, reduzidas antes de guardar
   -----------------------------------------------------------------------------
   POR QUE NÃO NO `localStorage`, como o resto da gestão: ele guarda texto e
   tem cerca de 5 MB para TUDO que o site salvar. Uma foto de celular sozinha
   passa disso, e em base64 ela ainda cresce um terço. Dez fotos de um imóvel
   estourariam a cota e derrubariam também a agenda e as metas, que dividem o
   mesmo espaço.

   O IndexedDB guarda o arquivo como Blob, sem base64, e a cota é de centenas
   de megabytes na maioria dos navegadores. Mesmo assim a foto É REDUZIDA
   ANTES DE ENTRAR: 1600px no lado maior e JPEG a 80%, que é o suficiente para
   conferir enquadramento e mandar para quem vai publicar. Original de 4 MB
   vira algo entre 200 e 500 kB.

   ⚠ CONTINUA SENDO ESTE NAVEGADOR, E SÓ ELE. Trocar de computador, trocar de
   celular ou limpar os dados do site apaga as fotos. Elas não chegam à
   imobiliária e não vão para o site — servem para o corretor montar a ficha e
   conferir o que já tem. Quando houver login e servidor, o lugar delas é lá,
   e este arquivo vira o cliente de upload.

   O navegador também pode apagar tudo sozinho se o disco ficar cheio, a menos
   que o site peça armazenamento persistente. É o que `pedirPersistencia` faz,
   uma vez, quando a primeira foto entra.
   ============================================================================= */

const BANCO = "tridium-corretor";
const DEPOSITO = "fotos-captacao";
const VERSAO = 1;

/** Lado maior, em pixels, depois da redução. */
const LADO_MAXIMO = 1600;
/** Qualidade do JPEG. 0,8 é o ponto em que o arquivo cai muito e o olho
    ainda não vê diferença numa foto de imóvel. */
const QUALIDADE = 0.8;
/** Teto por captação, para a lista não virar um álbum. */
export const MAXIMO_DE_FOTOS = 10;

export interface FotoGuardada {
  id: string;
  captacao: string;
  /** O arquivo já reduzido. */
  blob: Blob;
  /** Nome do arquivo original, para a pessoa se reconhecer na lista. */
  nome: string;
  /** Ordem dentro da captação. A primeira é a capa. */
  ordem: number;
}

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(BANCO, VERSAO);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DEPOSITO)) {
        const dep = db.createObjectStore(DEPOSITO, { keyPath: "id" });
        /* Índice por captação: ler as fotos de um imóvel sem varrer o
           depósito inteiro. */
        dep.createIndex("captacao", "captacao", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Pede ao navegador que não apague estes dados quando o disco apertar. */
async function pedirPersistencia(): Promise<void> {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    /* Navegador sem a API, ou que recusou. Segue sem garantia. */
  }
}

/* -----------------------------------------------------------------------------
   REDUÇÃO
   -----------------------------------------------------------------------------
   `createImageBitmap` lê o arquivo fora da thread principal e já respeita a
   orientação EXIF — sem isso, foto tirada de pé no celular entra deitada.
   ----------------------------------------------------------------------------- */

export async function reduzir(arquivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo, {
    imageOrientation: "from-image",
  });

  const escala = Math.min(
    1,
    LADO_MAXIMO / Math.max(bitmap.width, bitmap.height)
  );
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const tela = document.createElement("canvas");
  tela.width = largura;
  tela.height = altura;
  const ctx = tela.getContext("2d");
  if (!ctx) {
    bitmap.close();
    /* Sem canvas não há redução; guardar o original é melhor que perder a
       foto, e a cota do IndexedDB aguenta o caso raro. */
    return arquivo;
  }
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    tela.toBlob(resolve, "image/jpeg", QUALIDADE)
  );
  return blob ?? arquivo;
}

/* -----------------------------------------------------------------------------
   O DEPÓSITO
   ----------------------------------------------------------------------------- */

export async function lerFotos(captacao: string): Promise<FotoGuardada[]> {
  try {
    const db = await abrir();
    return await new Promise<FotoGuardada[]>((resolve, reject) => {
      const tx = db.transaction(DEPOSITO, "readonly");
      const req = tx.objectStore(DEPOSITO).index("captacao").getAll(captacao);
      req.onsuccess = () =>
        resolve(
          (req.result as FotoGuardada[]).sort((a, b) => a.ordem - b.ordem)
        );
      req.onerror = () => reject(req.error);
    });
  } catch {
    /* Aba anônima com IndexedDB bloqueado, ou navegador sem suporte. */
    return [];
  }
}

export async function guardarFotos(
  captacao: string,
  arquivos: File[],
  jaTem: number
): Promise<{ guardadas: number; recusadas: string[] }> {
  const recusadas: string[] = [];
  const cabem = Math.max(0, MAXIMO_DE_FOTOS - jaTem);
  if (cabem === 0) {
    return { guardadas: 0, recusadas: arquivos.map((a) => a.name) };
  }

  await pedirPersistencia();

  const aceitos = arquivos.slice(0, cabem);
  for (const extra of arquivos.slice(cabem)) recusadas.push(extra.name);

  let guardadas = 0;
  for (const [i, arquivo] of aceitos.entries()) {
    try {
      const blob = await reduzir(arquivo);
      const db = await abrir();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DEPOSITO, "readwrite");
        tx.objectStore(DEPOSITO).put({
          id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
          captacao,
          blob,
          nome: arquivo.name,
          ordem: jaTem + i,
        } satisfies FotoGuardada);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      guardadas += 1;
    } catch {
      /* Arquivo que não é imagem de verdade, ou cota estourada. A foto que
         falhou é nomeada para a pessoa saber qual não entrou. */
      recusadas.push(arquivo.name);
    }
  }

  return { guardadas, recusadas };
}

export async function apagarFoto(id: string): Promise<void> {
  try {
    const db = await abrir();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(DEPOSITO, "readwrite");
      tx.objectStore(DEPOSITO).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* Nada a fazer: a tela recarrega a lista e mostra o que sobrou. */
  }
}

/** Apaga todas as fotos de uma captação. Chamado quando ela é removida —
    senão as imagens ficam órfãs no depósito, ocupando espaço para sempre. */
export async function apagarFotosDe(captacao: string): Promise<void> {
  const fotos = await lerFotos(captacao);
  for (const f of fotos) await apagarFoto(f.id);
}
