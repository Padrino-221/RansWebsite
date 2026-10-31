import { DetailPage } from "@/components/DetailPage";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getSiteContent()).detailPages.about;
  return pageMetadata({ title: page.title, description: page.intro, path: "/about" });
}

export default async function AboutPage() { const content = await getSiteContent(); return <DetailPage page={content.detailPages.about} />; }
