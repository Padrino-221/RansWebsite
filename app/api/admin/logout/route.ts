import { NextResponse } from "next/server";
import { clearAdminSession, hasSameOrigin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
