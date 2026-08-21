import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getPhotos, savePhotos } from "../../../lib/data";
import { requireAdminApi } from "../../../lib/auth";
import { SERVICIOS } from "../../../lib/servicios";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 8 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const photos = await getPhotos();
  return NextResponse.json(photos);
}

export async function POST(request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("file");
  const category = form.get("category");
  const alt = form.get("alt") || "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (!SERVICIOS.some((s) => s.id === category)) {
    return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Formato no admitido. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "El archivo supera los 8MB" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const filename = `${id}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const photo = {
    id,
    category,
    alt: String(alt),
    url: `/uploads/${filename}`,
    createdAt: new Date().toISOString(),
  };

  const photos = await getPhotos();
  photos.unshift(photo);
  await savePhotos(photos);

  return NextResponse.json(photo, { status: 201 });
}
