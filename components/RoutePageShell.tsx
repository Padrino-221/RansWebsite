import { FooterSection } from "@/components/FooterSection";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteContent } from "@/lib/site-content";

interface RoutePageShellProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  showHeading?: boolean;
}

export async function RoutePageShell({ title, summary, children, showHeading = true }: RoutePageShellProps) {
  const content = await getSiteContent();
  return (
    <>
      <div id="top" />
      <SiteHeader site={content.site} />
      <main className="route-page">
        {showHeading && <header className="route-page-heading">
          <div className="container">
            <p>Rokteck IT Solutions</p>
            <h1>{title}</h1>
            <p>{summary}</p>
          </div>
        </header>}
        {children}
      </main>
      <FooterSection />
    </>
  );
}
