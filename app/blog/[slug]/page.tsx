import { BlogArticlePage } from "@/components/BlogArticlePage";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogArticlePage params={params} />;
}
