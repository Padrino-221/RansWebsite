import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

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
          <a className="text-link" href="/contact">Discuss a project <SiteIcon name="ArrowUpRight" /></a>
        </header>
        <div className="project-mosaic">
          {projects.projects.map((project, index) => (
            <article key={project.id} className={`project-tile project-tile-${index + 1}`} data-aos="zoom-in" data-aos-delay={index * 150}>
              <img src={publicAssetPath(project.image)} alt="" />
              <div className="project-tile-caption">
                <span>0{index + 1} / Case study</span>
                <h3>{project.title}</h3>
              </div>
              <a href="/contact" aria-label={`Discuss a project like ${project.title}`}><SiteIcon name="ArrowUpRight" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
