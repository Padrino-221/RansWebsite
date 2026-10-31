import { BlogArticlePage } from "@/components/BlogArticlePage";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { blogPostSlug } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getSiteContent()).blog.posts.find(item => blogPostSlug(item) === slug);
  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };
  return pageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${encodeURIComponent(slug)}`, image: post.image, type: "article" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogArticlePage params={params} />;
}
