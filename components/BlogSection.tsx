import { publicAssetPath } from "@/content";
import { getSiteContent } from "@/lib/site-content";
import { blogPostSlug } from "@/lib/blog";
import { SiteIcon } from "@/components/SiteIcon";

export async function BlogSection() {
  const content = await getSiteContent();
  const blog = content.blog;

  return (
    <section id="blog" className="blog sp">
      <div className="container">
        <header className="blog-heading" data-aos="fade-up">
          <div>
            <span className="section-kicker">{blog.title}</span>
            <h2>{blog.subtitle}</h2>
          </div>
          <p>Perspectives on the technology shaping work and business.</p>
        </header>
        <div className="blog-editorial-list">
          {blog.posts.map((post, index) => (
            <article key={post.id} className={`blog-story${index === 0 ? " blog-story-featured" : ""}`} data-aos="fade-up" data-aos-delay={index * 140}>
              <a href={`/blog/${blogPostSlug(post)}`} className="blog-story-image" aria-label={`Read ${post.title}`}>
                <img src={publicAssetPath(post.image)} alt="" />
              </a>
              <div className="blog-story-copy">
                <span className="blog-meta">{post.author} <span aria-hidden="true">/</span> {post.date}</span>
                <h3><a href={`/blog/${blogPostSlug(post)}`}>{post.title}</a></h3>
                <p>{post.excerpt}</p>
                <a className="text-link" href={`/blog/${blogPostSlug(post)}`}>Read article <SiteIcon name="ArrowUpRight" /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
