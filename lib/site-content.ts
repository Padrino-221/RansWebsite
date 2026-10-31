import "server-only";
import { cache } from "react";
import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";
import fallback from "@/content.json";
import { mergeContentWithDefaults, type SiteContent } from "@/content";
import { slugify } from "@/lib/blog";

const dataDir = join(process.cwd(), "data");
const dataFile = join(dataDir, "site-content.json");
const databaseUrl = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;
const contentId = "main";
let schemaReady: Promise<void> | undefined;

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

async function ensureSchema() {
  if (!sql) return;
  if (!schemaReady) {
    schemaReady = sql`CREATE TABLE IF NOT EXISTS site_content (
      id text PRIMARY KEY,
      content jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`.then(() => undefined).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  await schemaReady;
}

async function readLegacyContent(): Promise<SiteContent> {
  try {
    return replaceLegacyProjectExamples(mergeContentWithDefaults(JSON.parse(await readFile(dataFile, "utf8"))));
  } catch {
    return replaceLegacyProjectExamples(mergeContentWithDefaults(fallback));
  }
}

function replaceLegacyProjectExamples(content: SiteContent): SiteContent {
  const projects = content.projects.projects;
  const untouchedLegacyExamples = projects.length === 3 && projects.every(project =>
    project.title === "Enterprise Resource Planning Implementation"
  );
  if (!untouchedLegacyExamples) return content;
  return { ...content, projects: { ...content.projects, projects: fallback.projects.projects } };
}

export const getSiteContent = cache(async () => readSiteContent());

export async function readSiteContent(): Promise<SiteContent> {
  if (!sql) return readLegacyContent();

  await ensureSchema();
  const rows = await sql`SELECT content FROM site_content WHERE id = ${contentId} LIMIT 1`;
  if (rows[0]) return replaceLegacyProjectExamples(mergeContentWithDefaults(rows[0].content));

  // Seed a new Neon database from any existing local CMS content, otherwise the shipped defaults.
  const initialContent = await readLegacyContent();
  await sql`INSERT INTO site_content (id, content) VALUES (${contentId}, ${JSON.stringify(initialContent)}::jsonb)
    ON CONFLICT (id) DO NOTHING`;
  const seeded = await sql`SELECT content FROM site_content WHERE id = ${contentId} LIMIT 1`;
  return mergeContentWithDefaults(seeded[0]?.content ?? initialContent);
}

export async function writeSiteContent(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContentValidationError("Site content must be a JSON object.");
  }
  const root = value as Record<string, unknown>;
  const testimonialsContent = root.testimonials;
  if (testimonialsContent && typeof testimonialsContent === "object" && !Array.isArray(testimonialsContent)) {
    const testimonials = (testimonialsContent as Record<string, unknown>).testimonials;
    if (Array.isArray(testimonials) && testimonials.length > 6) {
      throw new ContentValidationError("A maximum of six testimonials is allowed.");
    }
  }
  const blog = root.blog;
  if (blog && typeof blog === "object" && !Array.isArray(blog)) {
    const posts = (blog as Record<string, unknown>).posts;
    if (Array.isArray(posts)) {
      const seen = new Set<string>();
      for (const item of posts) {
        if (!item || typeof item !== "object" || Array.isArray(item)) continue;
        const post = item as Record<string, unknown>;
        const slug = slugify(String(post.slug || post.title || ""));
        if (!slug) throw new ContentValidationError("Each blog post needs a title or URL slug before saving.");
        if (seen.has(slug)) throw new ContentValidationError(`The blog URL “${slug}” is used more than once. Give each post a unique slug.`);
        seen.add(slug);
      }
    }
  }
  const projectsContent = root.projects;
  if (projectsContent && typeof projectsContent === "object" && !Array.isArray(projectsContent)) {
    const projects = (projectsContent as Record<string, unknown>).projects;
    if (Array.isArray(projects)) {
      const seen = new Set<string>();
      for (const item of projects) {
        if (!item || typeof item !== "object" || Array.isArray(item)) continue;
        const project = item as Record<string, unknown>;
        const slug = slugify(String(project.slug || project.title || ""));
        if (!slug) throw new ContentValidationError("Each project needs a title or URL slug before saving.");
        if (seen.has(slug)) throw new ContentValidationError(`The project URL “${slug}” is used more than once. Give each project a unique slug.`);
        seen.add(slug);
      }
    }
  }

  if (sql) {
    await ensureSchema();
    await sql`INSERT INTO site_content (id, content, updated_at)
      VALUES (${contentId}, ${JSON.stringify(value)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`;
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Neon is not configured. Set DATABASE_URL_POOLED or DATABASE_URL on the server before saving content.");
  }
  await mkdir(dataDir, { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryFile, dataFile);
}
