import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getPhotos, mutatePhotos } from "../../../../lib/data";
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

  // Las fotos semilla (las que ya venían en el repo, con url tipo
  // "/uploads/ig-02.jpg") no son blobs — son archivos estáticos del build.
  // Solo hay que borrar del Blob store las que sí se subieron desde el admin.
  if (/^https?:\/\//.test(target.url)) {
    await del(target.url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
  }

  await mutatePhotos((current) => current.filter((p) => p.id !== id));

  return NextResponse.json({ ok: true });
}
