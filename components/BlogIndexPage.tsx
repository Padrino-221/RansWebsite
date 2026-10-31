import Link from "next/link";
import { RoutePageShell } from "@/components/RoutePageShell";
import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { blogPostSlug } from "@/lib/blog";
import { SiteIcon } from "@/components/SiteIcon";

export async function BlogIndexPage() {
  const content = await getSiteContent();
  const blog = content.blog;
  const intro = content.detailPages.insights;
  const [featured, ...articles] = blog.posts;
  return <RoutePageShell title={intro.title} summary={intro.intro} showHeading={false}>
    <div className="blog-index-page">
      <header className="blog-index-intro container">
        <div><p className="detail-eyebrow">{intro.eyebrow}</p><h1>{intro.title}</h1><p>{intro.intro}</p></div>
        <span className="blog-index-mark" aria-hidden="true">R<span>·</span></span>
      </header>
      {featured && <section className="blog-featured container">
        <Link className="blog-featured-image" href={`/blog/${blogPostSlug(featured)}`}><img src={publicAssetPath(featured.image)} alt={featured.title} /></Link>
        <div className="blog-featured-copy"><p className="detail-eyebrow">FEATURED ARTICLE</p><span className="blog-meta">{featured.author} <span aria-hidden="true">/</span> {featured.date}</span><h2><Link href={`/blog/${blogPostSlug(featured)}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link className="text-link" href={`/blog/${blogPostSlug(featured)}`}>Read article <SiteIcon name="ArrowUpRight" /></Link></div>
      </section>}
      <section className="blog-index-list container">
        <header className="blog-index-list-heading"><div><p className="detail-eyebrow">THE LATEST</p><h2>{blog.subtitle}</h2></div><span>{blog.posts.length} {blog.posts.length === 1 ? "article" : "articles"}</span></header>
        {articles.length > 0 ? <div className="blog-index-grid">{articles.map(post => <article className="blog-index-card" key={post.id}>
          <Link className="blog-index-card-image" href={`/blog/${blogPostSlug(post)}`}><img src={publicAssetPath(post.image)} alt={post.title} /></Link>
          <div className="blog-index-card-copy"><span className="blog-meta">{post.author} <span aria-hidden="true">/</span> {post.date}</span><h3><Link href={`/blog/${blogPostSlug(post)}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="text-link" href={`/blog/${blogPostSlug(post)}`}>Read article <SiteIcon name="ArrowUpRight" /></Link></div>
        </article>)}</div> : !featured && <p className="blog-index-empty">New articles will appear here soon.</p>}
      </section>
      <section className="blog-index-cta container"><div><p className="detail-eyebrow">HAVE A QUESTION?</p><h2>Put an idea into practice.</h2><p>Talk with our team about the technology choices your organisation is considering.</p></div><Link className="detail-button" href="/contact">Talk to our team <SiteIcon name="ArrowUpRight" /></Link></section>
    </div>
  </RoutePageShell>;
}
