import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getClients, saveClients } from "../../../lib/data";
import { requireAdminApi } from "../../../lib/auth";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 4 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const url = String(form.get("url") || "").trim();
  const file = form.get("file");

  if (!name) {
    return NextResponse.json({ error: "Falta el nombre del cliente" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el logo" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Formato no admitido. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "El logo supera los 4MB" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const filename = `${id}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const client = {
    id,
    name,
    url: url || null,
    logo: `/uploads/${filename}`,
    createdAt: new Date().toISOString(),
  };

  const clients = await getClients();
  clients.push(client);
  await saveClients(clients);

  return NextResponse.json(client, { status: 201 });
}
