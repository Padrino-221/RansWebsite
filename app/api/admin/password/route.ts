import { NextResponse } from "next/server";
import { changeAdminPassword, hasSameOrigin, isAdminAuthenticated, setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Sign in again to change the admin password." }, { status: 401 });

  let currentPassword = "";
  let newPassword = "";
  try {
    const body = await request.json();
    currentPassword = String(body.currentPassword ?? "");
    newPassword = String(body.newPassword ?? "");
  } catch { /* invalid JSON */ }

  if (newPassword.length < 12) return NextResponse.json({ error: "Choose a new password with at least 12 characters." }, { status: 400 });
  if (currentPassword === newPassword) return NextResponse.json({ error: "Choose a different password from your current one." }, { status: 400 });
  if (!(await changeAdminPassword(currentPassword, newPassword))) {
    return NextResponse.json({ error: "Your current password is not correct." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
