import "server-only";
import fallback from "@/content.json";

export type SiteContent = typeof fallback;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeContentWithDefaults(value: unknown): SiteContent {
  function merge(defaults: unknown, supplied: unknown): unknown {
    if (supplied === undefined) return defaults;
    if (Array.isArray(defaults) && Array.isArray(supplied)) {
      return supplied.map((entry, index) => merge(defaults[index], entry));
    }
    if (!isRecord(defaults) || !isRecord(supplied)) return supplied;
    const result: Record<string, unknown> = { ...defaults };
    for (const [key, entry] of Object.entries(supplied)) result[key] = merge(defaults[key], entry);
    return result;
  }
  return merge(fallback, value) as SiteContent;
}

export const defaultSiteContent = fallback;

export { publicAssetPath } from "@/lib/assets";
