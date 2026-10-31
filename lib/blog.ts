export interface BlogPostLike {
  slug?: string;
  title: string;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function blogPostSlug(post: BlogPostLike) {
  return slugify(post.slug?.trim() || post.title);
}
