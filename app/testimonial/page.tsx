import { RoutePageShell } from "@/components/RoutePageShell";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Client Testimonials",
  description: "See how businesses describe their experience working with Rokteck IT Solutions for technology, IT support and digital services.",
  path: "/testimonial",
});

export default function TestimonialsPage() {
  return (
    <RoutePageShell
      title="Client Testimonials"
      summary="Read what clients have to say about working with Rokteck."
    >
      <TestimonialsSection />
    </RoutePageShell>
  );
}
