import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { hasSameOrigin, isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";
const maxBytes = 10 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function matchesImageSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, i) => bytes[i] === byte);
  if (type === "image/gif") return /^GIF8[79]a$/.test(String.fromCharCode(...bytes.slice(0, 6)));
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (type === "image/avif") return String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" && /^(avif|avis)$/.test(String.fromCharCode(...bytes.slice(8, 12)));
  return false;
}

function cloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > maxBytes + 256 * 1024) return NextResponse.json({ error: "Images must be 10 MB or smaller." }, { status: 413 });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server." }, { status: 503 });
  }

  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: "Could not read the uploaded image." }, { status: 400 }); }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
  if (file.size < 1 || file.size > maxBytes) return NextResponse.json({ error: "Images must be between 1 byte and 10 MB." }, { status: 413 });
  const extension = extensions[file.type];
  if (!extension) return NextResponse.json({ error: "Use a JPEG, PNG, WebP, GIF, or AVIF image." }, { status: 415 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesImageSignature(file.type, bytes)) return NextResponse.json({ error: "The file contents do not match a supported image format." }, { status: 415 });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "rokteck-cms";
  const params = { folder, public_id: randomUUID(), timestamp };
  const cloudForm = new FormData();
  cloudForm.set("file", new Blob([bytes], { type: file.type }), `${params.public_id}.${extension}`);
  cloudForm.set("api_key", apiKey);
  cloudForm.set("timestamp", timestamp);
  cloudForm.set("folder", folder);
  cloudForm.set("public_id", params.public_id);
  cloudForm.set("signature", cloudinarySignature(params, apiSecret));

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
      method: "POST",
      body: cloudForm,
    });
    if (!response.ok) return NextResponse.json({ error: "Cloudinary rejected the upload. Check the server credentials and account upload settings." }, { status: 502 });
    const uploaded = await response.json() as { secure_url?: unknown };
    if (typeof uploaded.secure_url !== "string" || !uploaded.secure_url.startsWith("https://")) {
      return NextResponse.json({ error: "Cloudinary returned an invalid image URL." }, { status: 502 });
    }
    return NextResponse.json({ url: uploaded.secure_url });
  } catch {
    return NextResponse.json({ error: "Cloudinary could not store the image. Check the server's network access and credentials." }, { status: 502 });
  }
}
