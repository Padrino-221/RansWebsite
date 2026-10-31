import Link from "next/link";
import { RoutePageShell } from "@/components/RoutePageShell";
import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { projectSlug } from "@/lib/projects";
import { SiteIcon } from "@/components/SiteIcon";

export async function ProjectsIndexPage() {
  const content = await getSiteContent();
  const { projects } = content.projects;

  return <RoutePageShell title="Projects & Case Studies" summary={content.projects.subtitle} showHeading={false}>
    <div className="projects-index-page">
      <header className="projects-index-heading container">
        <div><p className="detail-eyebrow">{content.projects.title}</p><h1>Projects and case studies.</h1><p>{content.projects.subtitle}</p></div>
        <span className="projects-index-count"><strong>{String(projects.length).padStart(2, "0")}</strong><small>PROJECTS</small></span>
      </header>
      <section className="projects-index-list container" aria-label="Projects and case studies">
        {projects.length ? projects.map((project, index) => <article className="projects-index-card" key={project.id}>
          <Link className="projects-index-image" href={`/projects/${projectSlug(project)}`} aria-label={`View ${project.title}`}>
            <img src={publicAssetPath(project.image)} alt={project.title} />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </Link>
          <div className="projects-index-copy">
            <p className="detail-eyebrow">{project.category || "PROJECT CASE STUDY"}</p>
            <h2><Link href={`/projects/${projectSlug(project)}`}>{project.title}</Link></h2>
            {project.summary && <p>{project.summary}</p>}
            {project.client && <span className="projects-index-client">CLIENT <strong>{project.client}</strong></span>}
            <Link className="projects-index-link" href={`/projects/${projectSlug(project)}`}>View project <SiteIcon name="ArrowUpRight" /></Link>
          </div>
        </article>) : <p className="projects-index-empty">Projects and case studies will appear here when the owner adds them in the CMS.</p>}
      </section>
      <section className="projects-index-cta container"><div><p className="detail-eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s discuss what your team needs.</h2></div><Link className="detail-button" href="/contact">Talk to our team <SiteIcon name="ArrowUpRight" /></Link></section>
    </div>
  </RoutePageShell>;
}
