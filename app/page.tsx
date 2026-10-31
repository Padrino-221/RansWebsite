import { SiteHeader } from "@/components/SiteHeader";
import { HomePageSummaries } from "@/components/HomePageSummaries";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WorkSection } from "@/components/WorkSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BlogSection } from "@/components/BlogSection";
import { CTAMain } from "@/components/CTAMain";
import { FooterSection } from "@/components/FooterSection";
import { getSiteContent } from "@/lib/site-content";

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <main className="min-h-screen bg-background">
      <div id="top" />
      <SiteHeader site={content.site} />
      <HeroSection />
      <HomePageSummaries />
      <AboutSection />
      <ServicesSection />
      <WorkSection />
      <ProjectsSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <CTAMain />
      <FooterSection />
    </main>
  );
}
