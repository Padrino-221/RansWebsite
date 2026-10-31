import type { MetadataRoute } from "next";
import { blogPostSlug } from "@/lib/blog";
import { projectSlug } from "@/lib/projects";
import { siteOrigin } from "@/lib/seo";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const pages: MetadataRoute.Sitemap = [
    { url: siteOrigin, changeFrequency: "weekly", priority: 1 },
    { url: `${siteOrigin}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteOrigin}/service`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteOrigin}/work`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteOrigin}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteOrigin}/testimonial`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteOrigin}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteOrigin}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ];
  const articles: MetadataRoute.Sitemap = content.blog.posts.map(post => ({
    url: `${siteOrigin}/blog/${encodeURIComponent(blogPostSlug(post))}`,
    changeFrequency: "monthly",
    priority: 0.6,
    images: [new URL(post.image, `${siteOrigin}/`).toString()],
  }));
  const projectPages: MetadataRoute.Sitemap = content.projects.projects.map(project => ({
    url: `${siteOrigin}/projects/${encodeURIComponent(projectSlug(project))}`,
    changeFrequency: "monthly",
    priority: 0.7,
    images: [new URL(project.image, `${siteOrigin}/`).toString()],
  }));

  return [...pages, ...articles, ...projectPages];
}
