import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { ContentIcon, SiteIcon } from "@/components/SiteIcon";

export async function WorkSection() {
  const content = await getSiteContent();
  const work = content.work;

  return (
    <section id="work" className="work sp">
      <div className="container">
        <header className="work-heading" data-aos="fade-up">
          <div>
            <span className="section-kicker">{work.title}</span>
            <h2>{work.subtitle}</h2>
          </div>
          <p>{work.description}</p>
        </header>
        <div className="work-feature-layout">
          <div className="work-steps">
            {work.features.map((feature, index) => (
              <article className="work-step" key={feature.id} data-aos="fade-right" data-aos-delay={index * 150}>
                <span className="work-step-number">0{index + 1}</span>
                <div className="work-step-icon"><ContentIcon icon={feature.icon} title={feature.title} size={23} /></div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
            <a className="text-link" href="/service">Explore our services <SiteIcon name="ArrowUpRight" /></a>
          </div>
          <div className="work-photo-stack" aria-label="Rokteck teams at work" data-aos="zoom-in" data-aos-delay="180">
            <img className="work-photo-primary" src={publicAssetPath(content.media.work.primary)} alt="Technology team collaborating" />
            <img className="work-photo-small work-photo-one" src={publicAssetPath(content.media.work.smallOne)} alt="IT specialist at work" />
            <img className="work-photo-small work-photo-two" src={publicAssetPath(content.media.work.smallTwo)} alt="Business team working together" />
            <span className="work-photo-caption">People first. Technology that works.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
