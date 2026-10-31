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
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return pageMetadata({
    title: "IT Support, Consulting & Technology Solutions",
    description: content.hero.description,
    path: "/",
    image: `/${content.media.hero.team.replace(/^\//, "")}`,
  });
}

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
