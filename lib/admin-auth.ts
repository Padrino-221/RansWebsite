import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";

const cookieName = "rokteck_cms_session";
const lifetimeSeconds = 60 * 60 * 12;
const credentialFile = join(process.cwd(), "data", "admin-credential.json");
const databaseUrl = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;
let credentialSchemaReady: Promise<void> | undefined;
type Credential = { salt: string; hash: string };
function localCredential(): Credential | null {
  try { return JSON.parse(readFileSync(credentialFile, "utf8")) as Credential; } catch { return null; }
}
const secret = () => process.env.CMS_ADMIN_PASSWORD;
async function savedCredential(): Promise<Credential | null> {
  if (sql) {
    if (!credentialSchemaReady) {
      credentialSchemaReady = sql`CREATE TABLE IF NOT EXISTS admin_credentials (
        id text PRIMARY KEY,
        salt text NOT NULL,
        hash text NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`.then(() => undefined).catch(error => { credentialSchemaReady = undefined; throw error; });
    }
    await credentialSchemaReady;
    const rows = await sql`SELECT salt, hash FROM admin_credentials WHERE id = 'cms-admin' LIMIT 1`;
    if (rows[0]) return { salt: String(rows[0].salt), hash: String(rows[0].hash) };
  }
  return localCredential();
}
async function signingSecret() { return (await savedCredential())?.hash ?? secret(); }

function signature(payload: string, password: string) {
  return createHmac("sha256", password).update(payload).digest("hex");
}

export async function isCmsConfigured() {
  return Boolean(secret() || await savedCredential());
}

export async function passwordMatches(candidate: string) {
  const credential = await savedCredential();
  if (!credential) {
    const configured = secret();
    if (!configured) return false;
    const left = Buffer.from(candidate);
    const right = Buffer.from(configured);
    return left.length === right.length && timingSafeEqual(left, right);
  }
  const left = scryptSync(candidate, Buffer.from(credential.salt, "hex"), 64);
  const right = Buffer.from(credential.hash, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function saveInitialPassword(password: string) {
  if (secret() || localCredential()) throw new Error("An admin password is already configured.");
  const salt = randomBytes(16);
  const credential = { salt: salt.toString("hex"), hash: scryptSync(password, salt, 64).toString("hex") };
  const directory = join(process.cwd(), "data");
  mkdirSync(directory, { recursive: true });
  const temporaryFile = `${credentialFile}.tmp`;
  writeFileSync(temporaryFile, `${JSON.stringify(credential)}\n`, { encoding: "utf8", mode: 0o600 });
  renameSync(temporaryFile, credentialFile);
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  if (!(await passwordMatches(currentPassword))) return false;
  const salt = randomBytes(16);
  const credential = { salt: salt.toString("hex"), hash: scryptSync(newPassword, salt, 64).toString("hex") };
  if (sql) {
    await savedCredential();
    await sql`INSERT INTO admin_credentials (id, salt, hash, updated_at)
      VALUES ('cms-admin', ${credential.salt}, ${credential.hash}, now())
      ON CONFLICT (id) DO UPDATE SET salt = EXCLUDED.salt, hash = EXCLUDED.hash, updated_at = now()`;
  } else {
    const directory = join(process.cwd(), "data");
    mkdirSync(directory, { recursive: true });
    const temporaryFile = `${credentialFile}.tmp`;
    writeFileSync(temporaryFile, `${JSON.stringify(credential)}\n`, { encoding: "utf8", mode: 0o600 });
    renameSync(temporaryFile, credentialFile);
  }
  return true;
}

export function isLocalRequest(request: Request) {
  try {
    const hostname = new URL(request.url).hostname.toLowerCase();
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch { return false; }
}

export async function setAdminSession() {
  const password = await signingSecret();
  if (!password) throw new Error("CMS_ADMIN_PASSWORD is not configured.");
  const payload = String(Date.now() + lifetimeSeconds * 1000);
  const value = `${payload}.${signature(payload, password)}`;
  (await cookies()).set(cookieName, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: lifetimeSeconds,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(cookieName);
}

export async function isAdminAuthenticated() {
  const password = await signingSecret();
  if (!password) return false;
  const raw = (await cookies()).get(cookieName)?.value;
  if (!raw) return false;
  const [payload, supplied] = raw.split(".");
  if (!payload || !supplied || Number(payload) < Date.now()) return false;
  const expected = signature(payload, password);
  const left = Buffer.from(supplied);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
