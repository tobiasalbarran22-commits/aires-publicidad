import { NextResponse } from "next/server";
import { getPricing, mutatePricing } from "../../../lib/data";
import { requireAdminApi } from "../../../lib/auth";
import { SERVICIOS } from "../../../lib/servicios";

export const dynamic = "force-dynamic";

export async function GET() {
  const pricing = await getPricing();
  return NextResponse.json(pricing);
}

export async function PUT(request) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));

  const next = await mutatePricing((current) => {
    const items = Array.isArray(body.items)
      ? SERVICIOS.map((s) => {
          const found = body.items.find((i) => i.id === s.id);
          const base = found ? Number(found.base) : undefined;
          const prevFound = (current.items || []).find((i) => i.id === s.id);
          return { id: s.id, base: Number.isFinite(base) && base >= 0 ? base : prevFound?.base || 0 };
        })
      : current.items;

    return {
      note: typeof body.note === "string" ? body.note : current.note,
      sizeMultipliers: {
        chico: numOr(body.sizeMultipliers?.chico, current.sizeMultipliers?.chico, 1),
        mediano: numOr(body.sizeMultipliers?.mediano, current.sizeMultipliers?.mediano, 1.6),
        grande: numOr(body.sizeMultipliers?.grande, current.sizeMultipliers?.grande, 2.4),
      },
      ledMultiplier: numOr(body.ledMultiplier, current.ledMultiplier, 1.35),
      items,
    };
  });

  return NextResponse.json(next);
}

function numOr(value, fallback, fallback2) {
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) return n;
  const f = Number(fallback);
  if (Number.isFinite(f) && f > 0) return f;
  return fallback2;
}
