import { DetailPage } from "@/components/DetailPage";
import { getSiteContent } from "@/lib/site-content";
export default async function ProjectsPage() { const content = await getSiteContent(); return <DetailPage page={content.detailPages.projects} />; }
