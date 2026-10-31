import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

function footerHref(label: string) {
  const value = label.toLowerCase();
  if (value.includes("about")) return "/about";
  if (value.includes("service")) return "/service";
  if (value.includes("blog")) return "/blog";
  if (value.includes("project") || value.includes("brand")) return "/projects";
  if (value.includes("work")) return "/work";
  return "/contact";
}

export async function FooterSection() {
  const content = await getSiteContent();
  const footer = content.footer;
  const phoneHref = (value: string) => `tel:${value.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-invitation" data-aos="fade-up">
          <p>Technology challenges? Let’s solve them together.</p>
          <a href="/contact">Start a conversation <SiteIcon name="ArrowUpRight" /></a>
        </div>
        <div className="footer-main-grid" data-aos="fade-up" data-aos-delay="100">
          <div className="footer-brand-block">
            <a className="footer-brand" href="/" aria-label={`${content.site.title} home`}>
              <span className="footer-brand-mark"><img src={publicAssetPath(footer.logo)} alt="" /></span>
              <span className="footer-brand-name">{content.site.brandName}<small>{content.site.tagline}</small></span>
            </a>
            <p>{footer.description}</p>
            <div className="footer-socials">
              {footer.social.map((social) => {
                const network = social === "twitter" ? "x" : social;
                const label = social === "twitter" ? "X" : social === "linkedin" ? "LinkedIn" : social.charAt(0).toUpperCase() + social.slice(1);
                return <a key={social} href={`https://www.${network}.com/`} target="_blank" rel="noreferrer" aria-label={label}>{label}</a>;
              })}
            </div>
          </div>
          <nav className="footer-link-group" aria-label="Services">
            <h2>Services</h2>
            {footer.services.map((service) => <a key={service} href="/service">{service}</a>)}
          </nav>
          <nav className="footer-link-group" aria-label="Explore">
            <h2>Explore</h2>
            {footer.links.map((label) => <a key={label} href={footerHref(label)}>{label.toLowerCase().includes("brand") ? "Our Projects" : label}</a>)}
          </nav>
          <address className="footer-contact-block">
            <h2>Contact</h2>
            <a href={phoneHref(footer.contact.phone)}>{footer.contact.phone}</a>
            <a href={phoneHref(footer.contact.phone2)}>{footer.contact.phone2}</a>
            <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
            <span>{content.site.address}</span>
          </address>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {content.site.title}</span><a href="#top">Back to top <SiteIcon name="ArrowUp" size={16} /></a></div>
      </div>
    </footer>
  );
}
