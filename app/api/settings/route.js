import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "../../../lib/data";
import { requireAdminApi } from "../../../lib/auth";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  const current = await getSettings();

  const next = {
    ...current,
    phones: Array.isArray(body.phones) ? body.phones.filter(Boolean) : current.phones,
    whatsapp: typeof body.whatsapp === "string" ? body.whatsapp.trim() : current.whatsapp,
    whatsappDisplay: typeof body.whatsappDisplay === "string" ? body.whatsappDisplay.trim() : current.whatsappDisplay,
    email: typeof body.email === "string" ? body.email.trim() : current.email,
    addressLine1: typeof body.addressLine1 === "string" ? body.addressLine1.trim() : current.addressLine1,
    addressLine2: typeof body.addressLine2 === "string" ? body.addressLine2.trim() : current.addressLine2,
    instagram: typeof body.instagram === "string" ? body.instagram.trim() : current.instagram,
    facebook: typeof body.facebook === "string" ? body.facebook.trim() : current.facebook,
    youtube: typeof body.youtube === "string" ? body.youtube.trim() : current.youtube,
  };

  await saveSettings(next);
  return NextResponse.json(next);
}
