import { NextResponse } from "next/server";
import { hasSameOrigin, isAdminAuthenticated } from "@/lib/admin-auth";
import { ContentValidationError, readSiteContent, writeSiteContent } from "@/lib/site-content";

export async function GET() {
  return NextResponse.json(await readSiteContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Sign in to save website content." }, { status: 401 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1_000_000) return NextResponse.json({ error: "Content exceeds the 1 MB limit." }, { status: 413 });
  let value: unknown;
  try { value = await request.json(); } catch { return NextResponse.json({ error: "The submitted content is not valid JSON." }, { status: 400 }); }
  try {
    await writeSiteContent(value);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save website content. Check the server database configuration and try again." }, { status: 500 });
  }
}
