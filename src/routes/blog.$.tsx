import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { CopyLinkButton } from "~/components/copy-link-button";
import { PostLink } from "~/components/post-link";
import { ReadingProgress } from "~/components/reading-progress";
import { formatMediumDate, getAllPosts, getPostBySlug } from "~/lib/blog";
import { site } from "~/lib/site";

export const Route = createFileRoute("/blog/$")({
  loader: ({ params }) => {
    const post = getPostBySlug(params._splat ?? "");
    if (!post) throw notFound();
    const posts = getAllPosts();
    const index = posts.findIndex((entry) => entry.slug === post.slug);
    return {
      post,
      newerPost: index > 0 ? posts[index - 1] : undefined,
      olderPost: index < posts.length - 1 ? posts[index + 1] : undefined,
    };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return {
      meta: [
        { title: `${post.title} | ${site.name}` },
        { name: "description", content: post.summary },
        { name: "author", content: site.name },
        { property: "og:type", content: "article" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.summary },
        { property: "article:published_time", content: post.publishedAt },
        ...(post.updatedAt ? [{ property: "article:modified_time", content: post.updatedAt }] : []),
      ],
      links: [{ rel: "canonical", href: `https://xindanzhang.github.io/personal-site/blog/${post.slug}/` }],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, newerPost, olderPost } = Route.useLoaderData();
  return (
    <>
      <ReadingProgress />
      <article className="article-page">
        <header className="article-header">
          <Link className="back-link" to="/blog/"><ArrowLeft aria-hidden="true" size={15} /> writing.index</Link>
          <p className="command-line"><span>xindan@portfolio:~$</span> less {post.slug}.md</p>
          <div className="article-taxonomy">
            <Link to="/blog/category/$category/" params={{ category: post.categorySlug }}>{post.categoryLabel}</Link>
            {post.series && post.seriesSlug ? <Link to="/blog/series/$series/" params={{ series: post.seriesSlug }}>{post.series}</Link> : null}
          </div>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.summary}</p>
          <div className="article-byline">
            <span><CalendarDays aria-hidden="true" size={15} /><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time></span>
            <span><Clock3 aria-hidden="true" size={15} />{post.readingMinutes} min read</span>
            {post.updatedAt ? <span>Updated {formatMediumDate(post.updatedAt)}</span> : null}
            <CopyLinkButton />
          </div>
        </header>

        <div className={`article-grid ${post.headings.length === 0 ? "without-outline" : ""}`}>
          <div className="article-main">
            {post.sourceUrl ? <a className="article-source" href={post.sourceUrl} target="_blank" rel="noopener noreferrer"><span>RELATED.PROJECT</span><strong>{new URL(post.sourceUrl).hostname.replace(/^www\./, "")}</strong><ArrowUpRight aria-hidden="true" size={16} /></a> : null}
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            <nav className="article-pagination" aria-label="Adjacent articles">
              {newerPost ? <PostLink slug={newerPost.slug}><span><ArrowLeft aria-hidden="true" size={14} /> Newer</span><strong>{newerPost.title}</strong></PostLink> : <span />}
              {olderPost ? <PostLink slug={olderPost.slug} className="is-next"><span>Older <ArrowRight aria-hidden="true" size={14} /></span><strong>{olderPost.title}</strong></PostLink> : null}
            </nav>
          </div>
          {post.headings.length > 0 ? (
            <aside className="article-outline">
              <div className="outline-header"><span>CONTENTS</span><span>{post.headings.length.toString().padStart(2, "0")}</span></div>
              <nav aria-label="Table of contents">{post.headings.map((heading) => <a key={heading.slug} className={heading.depth > 2 ? "is-sub" : ""} href={`#${heading.slug}`}>{heading.text}</a>)}</nav>
              <div className="article-tags">{post.tags.map((tag) => <Link key={tag} to="/blog/tag/$tag/" params={{ tag: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }}>#{tag}</Link>)}</div>
            </aside>
          ) : null}
        </div>
      </article>
    </>
  );
}
