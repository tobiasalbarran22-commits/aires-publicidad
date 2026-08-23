import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getClients, saveClients } from "../../../../lib/data";
import { requireAdminApi } from "../../../../lib/auth";

export async function PUT(request, { params }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const { id } = params;
  const body = await request.json().catch(() => ({}));
  const clients = await getClients();
  const target = clients.find((c) => c.id === id);
  if (!target) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  if (typeof body.name === "string" && body.name.trim()) target.name = body.name.trim();
  if (typeof body.url === "string") target.url = body.url.trim() || null;

  await saveClients(clients);
  return NextResponse.json(target);
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
  if (target.logo && /^https?:\/\//.test(target.logo)) {
    await del(target.logo).catch(() => {});
  }
  const next = clients.filter((c) => c.id !== id);
  await saveClients(next);

  return NextResponse.json({ ok: true });
}
