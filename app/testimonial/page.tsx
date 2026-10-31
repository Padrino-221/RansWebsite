import { RoutePageShell } from "@/components/RoutePageShell";
import { TestimonialsSection } from "@/components/TestimonialsSection";

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