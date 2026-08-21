import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "aires_admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const a = Buffer.from(String(candidate || ""));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken() {
  const expiry = String(Date.now() + MAX_AGE_MS);
  return `${expiry}.${sign(expiry)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig) return false;
  const expected = sign(expiry);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(expiry) > Date.now();
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export const SESSION_MAX_AGE_SECONDS = MAX_AGE_MS / 1000;

export async function requireAdminApi() {
  const ok = await isAdmin();
  if (!ok) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}
