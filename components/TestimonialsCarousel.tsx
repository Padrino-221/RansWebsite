"use client";

import { useEffect, useState } from "react";
import { publicAssetPath } from "@/lib/assets";

interface Testimonial {
  id: number;
  quote: string;
  client: string;
  role: string;
  imageSmall: string;
  imageBig: string;
}

export function TestimonialsCarousel({ title, subtitle, testimonials }: {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}) {
  const slides = testimonials.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(index => Math.min(index, Math.max(0, slides.length - 1)));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;
  const quote = slides[activeIndex];

  return (
    <section id="tes" className="testimonial sp">
      <div className="container">
        <div className="testimonial-layout">
          <div className="testimonial-side-label" data-aos="fade-right">
            <span className="section-kicker">{title}</span>
            <h2>{subtitle}</h2>
          </div>
          <div
            className="testimonial-carousel"
            role="region"
            aria-label="Client testimonials"
            aria-roledescription="carousel"
            data-aos="fade-left"
            data-aos-delay="120"
          >
            <figure className={`testimonial-quote ${quote.imageBig ? "" : "testimonial-quote-no-portrait"}`} key={`${quote.id}-${activeIndex}`} aria-roledescription="slide" aria-label={`${activeIndex + 1} of ${slides.length}`}>
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>{quote.quote}</blockquote>
              <figcaption>
                {quote.imageSmall ? <img src={publicAssetPath(quote.imageSmall)} alt="" /> : <span className="testimonial-avatar-fallback" aria-hidden="true">RC</span>}
                <span><strong>{quote.client}</strong><small>{quote.role}</small></span>
              </figcaption>
              {quote.imageBig && <img className="testimonial-portrait" src={publicAssetPath(quote.imageBig)} alt="" />}
            </figure>
            {slides.length > 1 && <div className="testimonial-indicators" role="img" aria-label={`Testimonial ${activeIndex + 1} of ${slides.length}`}>
              {slides.map((slide, index) => <span key={slide.id ?? index} className={`testimonial-indicator ${index === activeIndex ? "is-active" : ""}`} aria-hidden="true" />)}
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
