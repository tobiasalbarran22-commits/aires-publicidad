import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getPhotos, mutatePhotos } from "../../../../lib/data";
import { requireAdminApi } from "../../../../lib/auth";

export async function PUT(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const body = await request.json().catch(() => ({}));
  if (body.cover !== true) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  const existing = await getPhotos();
  const target = existing.find((p) => p.id === id);
  if (!target) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  // Portada única por tipo de cartel: al marcar esta, se desmarca cualquier
  // otra foto de la misma categoría que ya lo fuera.
  const next = await mutatePhotos((current) =>
    current.map((p) => {
      if (p.id === id) return { ...p, isCover: true };
      if (p.category === target.category) return { ...p, isCover: false };
      return p;
    })
  );

  return NextResponse.json(next.find((p) => p.id === id));
}

export async function DELETE(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const photos = await getPhotos();
  const target = photos.find((p) => p.id === id);
  if (!target) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  // Primero el documento y recién después la imagen: si se borrara el archivo antes y el
  // guardado fallara, la foto seguiría en la galería del tipo de cartel con la imagen rota.
  await mutatePhotos((current) => current.filter((p) => p.id !== id));

  // Las fotos semilla (las que ya venían en el repo, con url tipo
  // "/uploads/ig-02.jpg") no son blobs — son archivos estáticos del build.
  // Solo hay que borrar del Blob store las que sí se subieron desde el admin.
  if (/^https?:\/\//.test(target.url)) {
    await del(target.url, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
