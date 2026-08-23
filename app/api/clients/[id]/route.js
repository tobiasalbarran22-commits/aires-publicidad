import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getClients, mutateClients } from "../../../../lib/data";
import { requireAdminApi } from "../../../../lib/auth";

export async function PUT(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const existing = await getClients();
  if (!existing.some((c) => c.id === id)) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  let updated;
  await mutateClients((current) =>
    current.map((c) => {
      if (c.id !== id) return c;
      updated = {
        ...c,
        name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : c.name,
        url: typeof body.url === "string" ? body.url.trim() || null : c.url,
      };
      return updated;
    })
  );
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const clients = await getClients();
  const target = clients.find((c) => c.id === id);
  if (!target) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  // Primero el documento y recién después la imagen: si se borrara el logo antes y el
  // guardado fallara, el cliente seguiría listado apuntando a un archivo inexistente
  // (logo roto en la landing, imposible de arreglar desde el panel).
  await mutateClients((current) => current.filter((c) => c.id !== id));
  if (target.logo && /^https?:\/\//.test(target.logo)) {
    await del(target.logo, { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
