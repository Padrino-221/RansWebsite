import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";
import { projectSlug } from "@/lib/projects";
import Link from "next/link";

export async function ProjectsSection() {
  const content = await getSiteContent();
  const projects = content.projects;

  return (
    <section id="project" className="project sp">
      <div className="container">
        <header className="project-heading" data-aos="fade-up">
          <div>
            <span className="section-kicker">{projects.title}</span>
            <h2>{projects.subtitle}</h2>
          </div>
          <Link className="text-link" href="/projects">View all projects <SiteIcon name="ArrowUpRight" /></Link>
        </header>
        <div className="project-mosaic">
          {projects.projects.map((project, index) => (
            <article key={project.id} className={`project-tile project-tile-${index + 1}`} data-aos="zoom-in" data-aos-delay={index * 150}>
              <img src={publicAssetPath(project.image)} alt="" />
              <div className="project-tile-caption">
                <span>0{index + 1} / Case study</span>
                <h3>{project.title}</h3>
              </div>
              <Link href={`/projects/${projectSlug(project)}`} aria-label={`View ${project.title} case study`}><SiteIcon name="ArrowUpRight" /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
