import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudyPage } from "@/components/ProjectCaseStudyPage";
import { getSiteContent } from "@/lib/site-content";
import { projectSlug } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getSiteContent()).projects.projects.find(item => projectSlug(item) === slug);
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } };
  return pageMetadata({
    title: project.title,
    description: project.summary || `${project.title} project case study by Rokteck IT Solutions.`,
    path: `/projects/${encodeURIComponent(slug)}`,
    image: project.image,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const content = await getSiteContent();
  const project = content.projects.projects.find(item => projectSlug(item) === slug);
  if (!project) notFound();
  const related = content.projects.projects.filter(item => projectSlug(item) !== slug).slice(0, 2);
  return <ProjectCaseStudyPage project={project} related={related} />;
}
