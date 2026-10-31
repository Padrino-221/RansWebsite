import { getSiteContent } from "@/lib/site-content";
import { ContentIcon, SiteIcon } from "@/components/SiteIcon";

export async function ServicesSection() {
  const content = await getSiteContent();
  const services = content.services;

  return (
    <section id="service" className="service sp">
      <div className="container">
        <div className="service-board">
          <header className="service-aside" data-aos="fade-right">
            <span className="section-kicker">{services.title}</span>
            <h2>{services.subtitle}</h2>
            <p>Practical technology support, built around the way your business works.</p>
            <a className="text-link" href="/contact">Talk to our team <SiteIcon name="ArrowUpRight" /></a>
          </header>
          <div className="service-list">
            {services.services.map((item, index) => (
              <article className="service-row" key={item.id} data-aos="fade-left" data-aos-delay={index * 120}>
                <span className="service-number">0{index + 1}</span>
                <span className="service-icon"><ContentIcon icon={item.icon} title={item.title} size={26} /></span>
                <div className="service-copy">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <a href={`/service#service-${item.id}`} className="service-go" aria-label={`View details for ${item.title}`}><SiteIcon name="ArrowUpRight" /></a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
