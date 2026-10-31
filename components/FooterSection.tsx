import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

function footerHref(label: string) {
  const value = label.toLowerCase();
  if (value.includes("about")) return "/about";
  if (value.includes("service")) return "/service";
  if (value.includes("blog") || value.includes("insight")) return "/blog";
  if (value.includes("project")) return "/projects";
  if (value.includes("work")) return "/work";
  if (value.includes("contact")) return "/contact";
  return null;
}

function socialProfile(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.pathname === "/") return null;
    const host = url.hostname.replace(/^www\./, "");
    const label = host === "x.com" || host === "twitter.com" ? "X" : host === "youtube.com" || host === "youtu.be" ? "YouTube" : host === "linkedin.com" ? "LinkedIn" : host === "instagram.com" ? "Instagram" : host;
    return { href: url.href, label };
  } catch {
    return null;
  }
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
            {footer.social.map(socialProfile).filter((social): social is NonNullable<typeof social> => social !== null).length > 0 && <div className="footer-socials">
              {footer.social.map(socialProfile).filter((social): social is NonNullable<typeof social> => social !== null).map((social) => <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>{social.label}</a>)}
            </div>}
          </div>
          <nav className="footer-link-group" aria-label="Services">
            <h2>Services</h2>
            {content.services.services.map((service) => <a key={service.id} href={`/service#service-${service.id}`}>{service.title}</a>)}
          </nav>
          <nav className="footer-link-group" aria-label="Explore">
            <h2>Explore</h2>
            {footer.links.map((label) => {
              const href = footerHref(label);
              return href ? <a key={label} href={href}>{label}</a> : null;
            })}
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
