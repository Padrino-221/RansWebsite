import { getSiteContent } from "@/lib/site-content";
import { SiteIcon } from "@/components/SiteIcon";

interface CTAProps {
  className?: string;
}

export async function CTAMain({ className }: CTAProps = {}) {
  const content = await getSiteContent();
  const cta = content.cta;
  
  return (
    <div className="cta">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="heading1-w" data-aos="fade-right">
              <h2 className="title tg-element-title">
                {cta.title}
              </h2>
              <div className="space16"></div>
              <p>
                {cta.description}
              </p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="buttons" data-aos="fade-left" data-aos-delay="120">
              <a className="cta-btn1" href="/contact">
                {cta.button1Text} <span><SiteIcon name="ArrowRight" /></span>
              </a>
              <a className="cta-btn2" href="/service">
                {cta.button2Text} <span><SiteIcon name="ArrowRight" /></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
