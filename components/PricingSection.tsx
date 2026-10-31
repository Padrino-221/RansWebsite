import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

export async function PricingSection() {
  const content = await getSiteContent();
  const pricing = content.pricing;

  return (
    <section className="pricing sp">
      <div className="container">
        <header className="pricing-heading" data-aos="fade-up">
          <span className="section-kicker">{pricing.title}</span>
          <h2>{pricing.subtitle}</h2>
          <p>Choose a starting point. We can tailor the support as your needs change.</p>
        </header>
        <div className="pricing-list">
          {pricing.plans.map((plan, index) => (
            <article key={plan.id} className={`pricing-row${plan.isPopular ? " pricing-row-featured" : ""}`} data-aos="fade-up" data-aos-delay={index * 170}>
              <div className="pricing-name">
                <span>0{index + 1}{plan.isPopular ? " · Recommended" : ""}</span>
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className="pricing-amount">
                <strong>{plan.price.match(/\$?\s?\d+(?:\.\d+)?/)?.[0]?.replace(/\s/g, "") ?? plan.price}</strong>
                <span>/ month</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <a className="pricing-action" href="/contact">{plan.buttonText} <SiteIcon name="ArrowUpRight" /></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
