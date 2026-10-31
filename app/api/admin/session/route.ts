import { NextResponse } from "next/server";
import { isAdminAuthenticated, isCmsConfigured } from "@/lib/admin-auth";

export async function GET() {
  return NextResponse.json({ configured: isCmsConfigured(), authenticated: await isAdminAuthenticated() });
}
