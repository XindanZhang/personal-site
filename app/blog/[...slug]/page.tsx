import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../../components/copy-link-button";
import { SiteLayout } from "../../../components/site-layout";
import {
  formatIsoDate,
  getAllPosts,
  getBadgeTheme,
  getPostBySlug,
} from "../../../lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.segments,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const badgeTheme = getBadgeTheme(post.categoryLabel);

  return (
    <SiteLayout active="blog">
      <div className="article-layout">
        <div className="article-main">
          <div className="article-toolbar">
            <Link className="journal-link" href="/blog/">
              Journal
            </Link>
            <CopyLinkButton />
          </div>

          <header className="stack-section">
            <div className="article-kicker">
              <Link
                className="article-pill"
                href={`/blog/category/${post.categorySlug}/`}
                style={{ backgroundColor: badgeTheme.background, color: badgeTheme.text }}
              >
                {post.categoryLabel}
              </Link>
              {post.series && post.seriesSlug ? (
                <Link className="article-pill is-outline" href={`/blog/series/${post.seriesSlug}/`}>
                  {post.series}
                </Link>
              ) : null}
            </div>

            <h1 className="article-title">{post.title}</h1>
            <div className="article-meta">
              <span>{formatIsoDate(post.publishedAt)}</span>
              {post.updatedAt ? <span>Updated {formatIsoDate(post.updatedAt)}</span> : null}
              {post.tags.length > 0 ? <span>{post.tags.map((tag) => `#${tag}`).join(" · ")}</span> : null}
            </div>
            <p className="article-summary">{post.summary}</p>
          </header>

          {post.sourceUrl || (post.series && post.seriesSlug) ? (
            <section className="article-support">
              {post.sourceUrl ? (
                <div className="support-card">
                  <p className="support-label">Official site</p>
                  <a
                    className="inline-link"
                    href={post.sourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {post.sourceUrl}
                  </a>
                </div>
              ) : null}

              {post.series && post.seriesSlug ? (
                <div className="support-card">
                  <p className="support-label">Thread</p>
                  <Link className="inline-link" href={`/blog/series/${post.seriesSlug}/`}>
                    {post.series} series
                  </Link>
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="support-card">
            <article
              className="article-prose max-w-none overflow-x-hidden"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </div>

        {post.headings.length > 0 ? (
          <aside className="article-outline">
            <h2 className="outline-title">On this page</h2>
            <nav className="outline-list" aria-label="Table of contents">
              {post.headings.map((heading) => (
                <a
                  key={heading.slug}
                  className={`outline-link ${heading.depth > 2 ? "is-sub" : ""}`}
                  href={`#${heading.slug}`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}
      </div>
    </SiteLayout>
  );
}
