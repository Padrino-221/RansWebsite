import Link from "next/link";
import { RoutePageShell } from "@/components/RoutePageShell";
import { publicAssetPath } from "@/content";
import type { SiteContent } from "@/content";
import { SiteIcon } from "@/components/SiteIcon";
import { projectSlug } from "@/lib/projects";

type Project = SiteContent["projects"]["projects"][number];

export function ProjectCaseStudyPage({ project, related }: { project: Project; related: Project[] }) {
  return <RoutePageShell title={project.title} summary={project.summary || "Project case study by Rokteck IT Solutions."} showHeading={false}>
    <article className="project-case-page">
      <header className="project-case-heading container">
        <Link className="project-case-back" href="/projects"><SiteIcon name="ArrowLeft" /> All projects</Link>
        <p className="detail-eyebrow">{project.category || "PROJECT CASE STUDY"}</p>
        <h1>{project.title}</h1>
        {project.summary && <p className="project-case-summary">{project.summary}</p>}
        {project.client && <p className="project-case-client"><span>CLIENT</span><strong>{project.client}</strong></p>}
      </header>
      {project.image && <figure className="project-case-image container"><img src={publicAssetPath(project.image)} alt={project.title} /></figure>}
      <div className="project-case-content container">
        {project.challenge && <section><p className="detail-eyebrow">THE CHALLENGE</p><h2>What needed to change</h2><p>{project.challenge}</p></section>}
        {project.approach && <section><p className="detail-eyebrow">THE APPROACH</p><h2>How the work was delivered</h2><p>{project.approach}</p></section>}
        {project.deliverables?.length > 0 && <section className="project-case-deliverables"><p className="detail-eyebrow">PROJECT SCOPE</p><h2>What the work included</h2><ul>{project.deliverables.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></section>}
        {project.outcome && <section className="project-case-outcome"><p className="detail-eyebrow">THE OUTCOME</p><h2>What changed</h2><p>{project.outcome}</p></section>}
      </div>
      {related.length > 0 && <section className="project-case-related container"><p className="detail-eyebrow">MORE PROJECTS</p><div>{related.map(item => <Link key={item.id} href={`/projects/${projectSlug(item)}`}><span>{item.category || "CASE STUDY"}</span><strong>{item.title}</strong><SiteIcon name="ArrowUpRight" /></Link>)}</div></section>}
      <section className="project-case-cta container"><div><p className="detail-eyebrow">YOUR NEXT PROJECT</p><h2>Planning a similar change?</h2><p>Talk with our team about the needs and constraints around your project.</p></div><Link className="detail-button" href="/contact">Start a conversation <SiteIcon name="ArrowUpRight" /></Link></section>
    </article>
  </RoutePageShell>;
}
