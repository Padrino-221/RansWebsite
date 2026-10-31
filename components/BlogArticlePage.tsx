import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoutePageShell } from "@/components/RoutePageShell";
import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { blogPostSlug } from "@/lib/blog";
import { SiteIcon } from "@/components/SiteIcon";

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const content = await getSiteContent();
  return content.blog.posts.find(post => blogPostSlug(post) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found | Rokteck" };
  return { title: `${post.title} | Rokteck Insights`, description: post.excerpt };
}

export async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const content = await getSiteContent();
  const paragraphs = (post.body || post.excerpt).split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean);
  const related = content.blog.posts.filter(item => blogPostSlug(item) !== slug).slice(0, 2);
  return <RoutePageShell title={post.title} summary={post.excerpt} showHeading={false}>
    <article className="blog-article-page">
      <header className="blog-article-heading container"><Link className="blog-back-link" href="/blog"><SiteIcon name="ArrowLeft" /> All insights</Link><p className="detail-eyebrow">ROKTECK INSIGHTS</p><h1>{post.title}</h1><p className="blog-article-deck">{post.excerpt}</p><div className="blog-meta">{post.author} <span aria-hidden="true">/</span> {post.date}</div></header>
      <figure className="blog-article-cover container"><img src={publicAssetPath(post.image)} alt={post.title} /></figure>
      <div className="blog-article-body"><div className="blog-article-prose">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div>
      <footer className="blog-article-footer container"><Link className="blog-back-link" href="/blog"><SiteIcon name="ArrowLeft" /> Back to all insights</Link><Link className="detail-button" href="/contact">Discuss this topic <SiteIcon name="ArrowUpRight" /></Link></footer>
      {related.length > 0 && <section className="blog-related container"><p className="detail-eyebrow">KEEP READING</p><h2>More insights</h2><div className="blog-related-grid">{related.map(item => <Link className="blog-related-card" key={item.id} href={`/blog/${blogPostSlug(item)}`}><span>{item.date}</span><strong>{item.title}</strong><SiteIcon className="blog-related-arrow" name="ArrowUpRight" /></Link>)}</div></section>}
    </article>
  </RoutePageShell>;
}
