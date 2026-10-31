import { DetailPage } from "@/components/DetailPage";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getSiteContent()).detailPages.projects;
  return pageMetadata({ title: page.title, description: page.intro, path: "/projects" });
}

export default async function ProjectsPage() { const content = await getSiteContent(); return <DetailPage page={content.detailPages.projects} />; }
