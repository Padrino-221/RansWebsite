import { RoutePageShell } from "@/components/RoutePageShell";
import { getSiteContent } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ArrowUpRight, Globe2, Mail, MapPin, PhoneCall } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: "Contact Rokteck IT Solutions",
  description: "Talk with Rokteck IT Solutions about practical technology, managed IT support and digital solutions for your business.",
  path: "/contact",
});

export default async function ContactPage() {
  const content = await getSiteContent();
  const contactEmail = content.footer.contact.email || content.site.email;
  const phoneHref = (value: string) => `tel:${value.replace(/[^+\d]/g, "")}`;
  const websiteHref = /^https?:\/\//i.test(content.site.website) ? content.site.website : `https://${content.site.website}`;
  return (
    <RoutePageShell
      title="Contact Rokteck"
      summary="Tell us what you are working toward. Our team is ready to discuss practical IT solutions for your business."
      showHeading={false}
    >
      <div className="contact-page">
        <header className="contact-page-hero container">
          <div>
            <p className="detail-eyebrow">CONTACT ROKTECK</p>
            <h1>Let’s make technology work better for your business.</h1>
            <p className="contact-page-intro">Tell us what you’re working toward. We’ll help you find a practical next step for your business.</p>
          </div>
          <aside className="contact-page-note">
            <span>BASED IN</span>
            <strong>{content.site.address}</strong>
            <p>Supporting organisations with tailored technology and IT solutions.</p>
          </aside>
        </header>

        <section className="contact-page-main container" aria-label="Contact options">
          <div className="contact-start-panel">
            <p className="contact-panel-index">01 <span>START A CONVERSATION</span></p>
            <h2>Have a challenge in mind?</h2>
            <p>Share what your team needs, from day-to-day IT support to a new technology project. We’ll get the conversation started.</p>
            <a className="contact-email-link" href={`mailto:${contactEmail}`}>
              Email our team <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="contact-methods">
            <article className="contact-method">
              <span className="contact-method-icon"><PhoneCall aria-hidden="true" size={21} /></span>
              <div><p>CALL OUR TEAM</p><a href={phoneHref(content.site.phone)}>{content.site.phone}</a><a href={phoneHref(content.site.secondaryPhone)}>{content.site.secondaryPhone}</a></div>
              <ArrowUpRight className="contact-method-arrow" aria-hidden="true" size={18} />
            </article>
            <article className="contact-method">
              <span className="contact-method-icon"><Mail aria-hidden="true" size={21} /></span>
              <div><p>EMAIL</p><a href={`mailto:${contactEmail}`}>{contactEmail}</a><span>For enquiries and project discussions</span></div>
              <ArrowUpRight className="contact-method-arrow" aria-hidden="true" size={18} />
            </article>
            <article className="contact-method">
              <span className="contact-method-icon"><Globe2 aria-hidden="true" size={21} /></span>
              <div><p>ONLINE</p><a href={websiteHref} target="_blank" rel="noreferrer">{content.site.website}</a><span>Find out more about Rokteck</span></div>
              <ArrowUpRight className="contact-method-arrow" aria-hidden="true" size={18} />
            </article>
            <div className="contact-location"><MapPin aria-hidden="true" size={17} /><span>Serving businesses in {content.site.address}</span></div>
          </div>
        </section>

        <section className="contact-next container" aria-labelledby="contact-next-heading">
          <div className="contact-next-heading"><p className="detail-eyebrow">WHAT HAPPENS NEXT</p><h2 id="contact-next-heading">A clear path from first contact to a plan.</h2></div>
          <div className="contact-next-steps">
            <article><span>01</span><h3>Tell us what you need</h3><p>Give us a little context about your goals or technology challenge.</p></article>
            <article><span>02</span><h3>Talk it through</h3><p>We’ll discuss the situation and the kind of support that may fit.</p></article>
            <article><span>03</span><h3>Choose your next step</h3><p>Agree on a practical direction and how you’d like to move forward.</p></article>
          </div>
        </section>
      </div>
    </RoutePageShell>
  );
}
