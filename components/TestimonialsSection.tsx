import { getSiteContent } from "@/lib/site-content";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

export async function TestimonialsSection() {
  const content = await getSiteContent();
  const testimonials = content.testimonials;

  return <TestimonialsCarousel
    title={testimonials.title}
    subtitle={testimonials.subtitle}
    testimonials={testimonials.testimonials.slice(0, 6)}
  />;
}
