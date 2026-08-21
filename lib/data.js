import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJSON(file, fallback) {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJSON(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

export const getSettings = () => readJSON("settings.json", {});
export const saveSettings = (data) => writeJSON("settings.json", data);

export const getClients = () => readJSON("clients.json", []);
export const saveClients = (data) => writeJSON("clients.json", data);

export const getPhotos = () => readJSON("photos.json", []);
export const savePhotos = (data) => writeJSON("photos.json", data);

export const getPricing = () => readJSON("pricing.json", {});
export const savePricing = (data) => writeJSON("pricing.json", data);
