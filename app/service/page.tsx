import Link from "next/link";
import { ContentIcon, SiteIcon } from "@/components/SiteIcon";
import { RoutePageShell } from "@/components/RoutePageShell";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = (await getSiteContent()).detailPages.services;
  return pageMetadata({ title: page.title, description: page.intro, path: "/service" });
}

export default async function ServicesPage() {
  const content = await getSiteContent();
  const page = content.detailPages.services;
  const services = content.services.services;

  return (
    <RoutePageShell title={page.title} summary={page.intro} showHeading={false}>
      <article className="service-detail-page">
        <header className="service-detail-hero container">
          <div className="service-detail-hero-copy">
            <p className="detail-eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="service-detail-intro">{page.intro}</p>
            <Link className="detail-button" href="/contact">Discuss your needs <SiteIcon name="ArrowUpRight" /></Link>
          </div>
          <nav className="service-directory" aria-label="Services offered">
            <p className="service-directory-label">OUR SERVICE AREAS</p>
            {services.map((service, index) => (
              <a href={`#service-${service.id}`} className="service-directory-link" key={service.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{service.title}</strong>
                <SiteIcon name="ArrowUpRight" size={17} />
              </a>
            ))}
          </nav>
        </header>

        <section className="service-detail-list" aria-label="Rokteck services">
          {services.map((service, index) => (
            <article className="service-detail-row" id={`service-${service.id}`} key={service.id}>
              <div className="container service-detail-row-inner">
                <div className="service-detail-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="service-detail-content">
                  <div className="service-detail-icon"><ContentIcon icon={service.icon} title={service.title} size={27} /></div>
                  <p className="detail-eyebrow">SERVICE {String(index + 1).padStart(2, "0")}</p>
                  <h2>{service.title}</h2>
                  <p className="service-detail-description">{service.detail || service.description}</p>
                  <ul className="service-detail-includes">
                    {(service.includes ?? []).map((item) => <li key={item}><SiteIcon name="ArrowRight" size={15} />{item}</li>)}
                  </ul>
                  <Link href="/contact" className="service-detail-cta">Talk to us about this service <SiteIcon name="ArrowUpRight" size={17} /></Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {page.sections.map((section, index) => (
          <section className={`service-detail-support ${index % 2 ? "service-detail-support-alt" : ""}`} key={`${section.title}-${index}`}>
            <div className="container service-detail-support-inner">
              <header className="service-detail-support-heading">
                <p className="detail-eyebrow">{section.eyebrow}</p>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </header>
              <div className="service-detail-support-items">
                {section.items.map((item, itemIndex) => (
                  <article key={`${item.title}-${itemIndex}`}>
                    <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="service-detail-closing container">
          <div><p className="detail-eyebrow">LET'S TALK</p><h2>{page.closingTitle}</h2><p>{page.closingText}</p></div>
          <Link className="detail-button" href="/contact">{page.closingButton}<SiteIcon name="ArrowUpRight" /></Link>
        </section>
      </article>
    </RoutePageShell>
  );
}
