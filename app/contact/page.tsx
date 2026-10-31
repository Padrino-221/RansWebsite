import { RoutePageShell } from "@/components/RoutePageShell";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <RoutePageShell
      title="Contact Rokteck"
      summary="Tell us what you are working toward. Our team is ready to discuss practical IT solutions for your business."
    >
      <section className="contact-route sp">
        <div className="container">
          <div className="contact-route-grid">
            <article className="contact-route-item">
              <h2>Call our team</h2>
              <a href={`tel:${content.site.phone.replace(/[^+\d]/g, "")}`}>{content.site.phone}</a>
              <a href={`tel:${content.site.secondaryPhone.replace(/[^+\d]/g, "")}`}>{content.site.secondaryPhone}</a>
            </article>
            <article className="contact-route-item">
              <h2>Email us</h2>
              <a href={`mailto:${content.site.email}`}>{content.site.email}</a>
            </article>
            <article className="contact-route-item">
              <h2>Visit us online</h2>
              <a href="https://www.rokteck.com">{content.site.website}</a>
              <p>{content.site.address}</p>
            </article>
          </div>
        </div>
      </section>
    </RoutePageShell>
  );
}
