import { BlogIndexPage } from "@/components/BlogIndexPage";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getSiteContent()).detailPages.insights;
  return pageMetadata({ title: page.title, description: page.intro, path: "/blog" });
}

export default function BlogPage() { return <BlogIndexPage />; }
