import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { getClients, mutateClients } from "../../../lib/data";
import { requireAdminApi } from "../../../lib/auth";

const ALLOWED = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 4 * 1024 * 1024;

export const dynamic = "force-dynamic";

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
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = await put(`uploads/${filename}`, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  const client = {
    id,
    name,
    url: url || null,
    logo: blob.url,
    createdAt: new Date().toISOString(),
  };

  await mutateClients((current) => [...current, client]);

  return NextResponse.json(client, { status: 201 });
}
