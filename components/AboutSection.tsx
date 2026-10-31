import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

export async function AboutSection() {
  const content = await getSiteContent();
  const about = content.about;

  return (
    <section id="about" className="about1 sp">
      <div className="container">
        <div className="about-overview">
          <div className="about-story-copy" data-aos="fade-right">
            <span className="section-kicker">{about.title}</span>
            <h2>{about.subtitle}</h2>
            <p>{about.description}</p>
            <a className="text-link" href="/about">Get to know us <SiteIcon name="ArrowUpRight" /></a>
          </div>
          <div className="about-story-visual" data-aos="zoom-in" data-aos-delay="180">
            <img className="about-image-main" src={publicAssetPath(content.media.about.main)} alt="Technology team collaborating" />
            <img className="about-image-inset" src={publicAssetPath(content.media.about.inset)} alt="IT support specialist" />
            <div className="about-image-note"><strong>24/7</strong><span>Support for your team</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
