import { getSiteContent } from "@/lib/site-content";
import { ContentIcon } from "@/components/SiteIcon";

export async function HomePageSummaries() {
  const content = await getSiteContent();
  return (
    <div className="container">
      <div className="row hero-bottom-area">
        {content.highlights.map((item, index) => (
          <div className="col-lg-3 col-md-6" key={item.title}>
            <div className="single-box" data-aos="fade-up" data-aos-delay={index * 140}>
              <div className="icon" aria-hidden="true">
                <ContentIcon icon={item.icon} title={item.title} size={26} />
              </div>
              <div className="headding">
                <h5>{item.title}</h5>
                <p>{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

