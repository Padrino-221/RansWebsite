import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";
import Image from "next/image";

export async function HeroSection() {
  const content = await getSiteContent();
  const hero = content.hero;
  const titleParts = hero.mainTitle.split(/(IT Solutions)/i);

  return (
    <section className="hero1">
      <div className="hero-layout container">
        <div className="hero-copy" data-aos="fade-right">
            <span className="section-kicker">{hero.subtitle}</span>
          <h1>{titleParts.map((part, index) => part.toLowerCase() === "it solutions" ? <span key={index}>{part}</span> : part)}</h1>
          <p className="hero-description">{hero.description}</p>
          <div className="buttons hero-buttons">
            <a className="theme-btn1" href="/contact">{hero.ctaButtonText}<span><SiteIcon name="ArrowRight" /></span></a>
            <a className="play-btn" href="#work"><span><SiteIcon name="Play" size={17} /></span>{hero.watchDemoText}</a>
          </div>
        </div>
        <div className="hero-visual-stage" data-aos="zoom-in" data-aos-delay="180">
          <Image className="hero-visual-team" src={publicAssetPath(content.media.hero.team)} alt="Business team collaborating" width={1536} height={1024} sizes="(max-width: 767px) 94vw, (max-width: 991px) 50vw, 460px" quality={75} />
          <Image className="hero-visual-person" src={publicAssetPath(content.media.hero.person)} alt="Technology professional with a laptop" width={1024} height={1536} sizes="(max-width: 767px) 68vw, (max-width: 991px) 55vw, 530px" quality={75} preload />
          <img className="hero-visual-doodle hero-visual-doodle-one" src={publicAssetPath(content.media.hero.doodleOne)} alt="" />
          <img className="hero-visual-doodle hero-visual-doodle-two" src={publicAssetPath(content.media.hero.doodleTwo)} alt="" />
          <div className="hero-visual-experience-card" aria-label="8 Years Experience">
            <strong>+8</strong>
            <span><small>Years</small><b>Experience</b></span>
          </div>
          <img className="hero-visual-card hero-visual-community" src={publicAssetPath(content.media.hero.communityCard)} alt="12,000+ people already joined the technology and IT solution community" />
        </div>
      </div>
    </section>
  );
}
