import Link from "next/link";
import { RoutePageShell } from "@/components/RoutePageShell";
import { publicAssetPath } from "@/content";
import { SiteIcon } from "@/components/SiteIcon";

export interface DetailPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  metrics: { value: string; label: string }[];
  sections: { eyebrow: string; title: string; body: string; items: { title: string; body: string }[] }[];
  closingTitle: string;
  closingText: string;
  closingButton: string;
}

export function DetailPage({ page }: { page: DetailPageContent }) {
  return <RoutePageShell title={page.title} summary={page.intro} showHeading={false}>
    <article className="detail-page">
      <section className="detail-hero container">
        <div className="detail-hero-copy">
          <p className="detail-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="detail-intro">{page.intro}</p>
          <Link className="detail-button" href="/contact">Start a conversation <SiteIcon name="ArrowUpRight" /></Link>
        </div>
        <div className="detail-hero-image"><img src={publicAssetPath(page.image)} alt="Rokteck technology team at work" /></div>
      </section>
      <section className="detail-metrics container" aria-label="Our approach">
        {page.metrics.map((metric, index) => <div className="detail-metric" key={`${metric.value}-${index}`}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
      </section>
      {page.sections.map((section, index) => <section className={`detail-content-section ${index % 2 ? "detail-content-alt" : ""}`} key={`${section.title}-${index}`}>
        <div className="container detail-content-inner">
          <header className="detail-section-heading"><p className="detail-eyebrow">{section.eyebrow}</p><h2>{section.title}</h2><p>{section.body}</p></header>
          <div className="detail-item-grid">{section.items.map((item, itemIndex) => <article className="detail-item" key={`${item.title}-${itemIndex}`}><span className="detail-item-index">{String(itemIndex + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
        </div>
      </section>)}
      <section className="detail-closing container"><div><p className="detail-eyebrow">LET'S TALK</p><h2>{page.closingTitle}</h2><p>{page.closingText}</p></div><Link className="detail-button" href="/contact">{page.closingButton} <SiteIcon name="ArrowUpRight" /></Link></section>
    </article>
  </RoutePageShell>;
}
