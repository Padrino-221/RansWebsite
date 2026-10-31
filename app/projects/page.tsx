import { ProjectsIndexPage } from "@/components/ProjectsIndexPage";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const projects = (await getSiteContent()).projects;
  return pageMetadata({ title: "Projects & Case Studies", description: projects.subtitle, path: "/projects" });
}

export default function ProjectsPage() { return <ProjectsIndexPage />; }
