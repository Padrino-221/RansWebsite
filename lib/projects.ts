import { slugify } from "@/lib/blog";

export interface ProjectLike {
  id: number;
  slug?: string;
  title: string;
}

export function projectSlug(project: ProjectLike) {
  const slug = slugify(project.slug?.trim() || project.title);
  return slug || `project-${project.id}`;
}
