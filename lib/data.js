import { put, head, BlobNotFoundError } from "@vercel/blob";

/**
 * Vercel corre las funciones serverless con el filesystem en solo lectura
 * (fuera de /tmp), así que estos datos ya no pueden vivir en data/*.json
 * como al principio: cualquier guardado desde el panel admin tiraba
 * "EROFS: read-only file system" en producción, aunque anduviera bien en
 * local. Vercel Blob es el reemplazo — mismo formato JSON, ahora en la nube.
 *
 * Se lee vía head() + su downloadUrl (no la url normal): probado a fondo,
 * la url pública "de exhibición" puede servir una copia vieja desde algún
 * borde de CDN incluso pidiendo explícitamente no usar caché — el
 * downloadUrl (?download=1) no tuvo ese problema en la práctica.
 *
 * Esto es "mejor esfuerzo", no una garantía de consistencia estricta: con
 * guardados muy seguidos y encimados (varios en el mismo segundo) puede
 * haber alguna demora en que se refleje el último. Para el uso real de este
 * panel — un solo administrador subiendo una foto por vez — no se vio
 * ningún caso de pérdida de datos, solo con ráfagas artificiales de
 * pruebas automatizadas disparando varias escrituras casi en simultáneo.
 */
async function readJSON(pathname, fallback) {
  try {
    const meta = await head(`data/${pathname}`);
    const res = await fetch(meta.downloadUrl, { cache: "no-store" });
    if (!res.ok) return fallback;
    return JSON.parse(await res.text());
  } catch (err) {
    if (err instanceof BlobNotFoundError) return fallback;
    throw err;
  }
}

async function writeJSON(pathname, data) {
  await put(`data/${pathname}`, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Lee, aplica `mutator` al valor actual, y guarda el resultado. */
async function mutateJSON(pathname, fallback, mutator) {
  const current = await readJSON(pathname, fallback);
  const next = mutator(current);
  await writeJSON(pathname, next);
  return next;
}

export const getSettings = () => readJSON("settings.json", {});
export const mutateSettings = (mutator) => mutateJSON("settings.json", {}, mutator);

export const getClients = () => readJSON("clients.json", []);
export const mutateClients = (mutator) => mutateJSON("clients.json", [], mutator);

export const getPhotos = () => readJSON("photos.json", []);
export const mutatePhotos = (mutator) => mutateJSON("photos.json", [], mutator);

export const getPricing = () => readJSON("pricing.json", {});
export const mutatePricing = (mutator) => mutateJSON("pricing.json", {}, mutator);
