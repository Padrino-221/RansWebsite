import { NextResponse } from "next/server";
import { hasSameOrigin, isCmsConfigured, isLocalRequest, saveInitialPassword, setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!isLocalRequest(request)) return NextResponse.json({ error: "Initial setup is only available from this computer. Configure CMS_ADMIN_PASSWORD on the server for remote setup." }, { status: 403 });
  if (await isCmsConfigured()) return NextResponse.json({ error: "An admin password is already configured." }, { status: 409 });
  let password = "";
  try { password = String((await request.json()).password ?? ""); } catch { /* invalid JSON */ }
  if (password.length < 12) return NextResponse.json({ error: "Choose a password with at least 12 characters." }, { status: 400 });
  try {
    saveInitialPassword(password);
    await setAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not set up the admin password." }, { status: 409 });
  }
}
