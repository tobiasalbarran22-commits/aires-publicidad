import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getPhotos, savePhotos } from "../../../../lib/data";
import { requireAdminApi } from "../../../../lib/auth";

export async function DELETE(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const photos = await getPhotos();
  const target = photos.find((p) => p.id === id);
  if (!target) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", target.url);
  await fs.unlink(filePath).catch(() => {});

  const next = photos.filter((p) => p.id !== id);
  await savePhotos(next);

  return NextResponse.json({ ok: true });
}
