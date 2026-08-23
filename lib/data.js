import { put, head, BlobNotFoundError } from "@vercel/blob";

/**
 * Vercel corre las funciones serverless con el filesystem en solo lectura
 * (fuera de /tmp), así que estos datos ya no pueden vivir en data/*.json
 * como al principio: cualquier guardado desde el panel admin tiraba
 * "EROFS: read-only file system" en producción, aunque anduviera bien en
 * local. Vercel Blob es el reemplazo — mismo formato JSON, ahora en la nube.
 */
async function readJSON(pathname, fallback) {
  try {
    const { url } = await head(`data/${pathname}`);
    // "cache: no-store" solo evita el caché propio de Next — el CDN de Blob
    // igual podía servir una copia de hasta 60s (o más vieja, de antes de
    // bajar cacheControlMaxAge) si no se le pide explícitamente revalidar.
    const res = await fetch(url, { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
    if (!res.ok) return fallback;
    return await res.json();
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
    // Por defecto Vercel Blob cachea 30 días. A un mismo pathname lo
    // reescribimos en cada guardado del admin, así que un valor tan alto
    // podía dejar servidores de borde mostrando datos viejos por semanas.
    // 60s es el mínimo permitido y alcanza de sobra para este panel.
    cacheControlMaxAge: 60,
  });
}

export const getSettings = () => readJSON("settings.json", {});
export const saveSettings = (data) => writeJSON("settings.json", data);

export const getClients = () => readJSON("clients.json", []);
export const saveClients = (data) => writeJSON("clients.json", data);

export const getPhotos = () => readJSON("photos.json", []);
export const savePhotos = (data) => writeJSON("photos.json", data);

export const getPricing = () => readJSON("pricing.json", {});
export const savePricing = (data) => writeJSON("pricing.json", data);
