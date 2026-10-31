import { NextResponse } from "next/server";
import { hasSameOrigin, isCmsConfigured, passwordMatches, setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isCmsConfigured())) return NextResponse.json({ error: "Set CMS_ADMIN_PASSWORD on the server before signing in." }, { status: 503 });
  let password = "";
  try { password = String((await request.json()).password ?? ""); } catch { /* invalid JSON */ }
  if (!(await passwordMatches(password))) return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
