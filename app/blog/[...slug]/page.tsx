import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../../components/copy-link-button";
import { PromptSection } from "../../../components/prompt-section";
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
  const fileName = `${post.segments.at(-1) ?? post.slug}.md`;

  return (
    <SiteLayout active="blog">
      <div className="article-layout">
        <div className="article-main">
          <PromptSection caret command={`cat /blog/${post.slug}.md`}>
            <div className="article-kicker">
              <Link
                className="article-pill"
                href={`/blog/category/${post.categorySlug}/`}
                style={{ backgroundColor: "transparent", borderColor: badgeTheme.text, color: badgeTheme.text }}
              >
                {post.categoryLabel}
              </Link>
              {post.series && post.seriesSlug ? (
                <Link className="article-pill is-outline" href={`/blog/series/${post.seriesSlug}/`}>
                  {post.series}
                </Link>
              ) : null}
            </div>

            <h1 className="shell-heading">{post.title}</h1>
            <div className="article-meta">
              <span>{formatIsoDate(post.publishedAt)}</span>
              {post.updatedAt ? <span>Updated {formatIsoDate(post.updatedAt)}</span> : null}
              {post.tags.length > 0 ? <span>{post.tags.map((tag) => `#${tag}`).join(" · ")}</span> : null}
            </div>
            <p className="shell-copy">{post.summary}</p>
            <div className="article-toolbar">
              <Link className="journal-link" href="/blog/">
                cd /blog
              </Link>
              <CopyLinkButton />
            </div>
            {post.sourceUrl ? (
              <p className="shell-copy">
                source_url=
                <a
                  className="terminal-inline-link"
                  href={post.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {post.sourceUrl}
                </a>
              </p>
            ) : null}
            {post.series && post.seriesSlug ? (
              <p className="shell-copy">
                series=
                <Link className="terminal-inline-link" href={`/blog/series/${post.seriesSlug}/`}>
                  {post.series}
                </Link>
              </p>
            ) : null}
          </PromptSection>

          {post.headings.length > 0 ? (
            <PromptSection command={`grep '^##' ./${fileName}`}>
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
            </PromptSection>
          ) : null}

          <PromptSection command={`sed -n '1,$p' ./${fileName}`}>
            <article
              className="article-prose max-w-none overflow-x-hidden"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </PromptSection>
        </div>
      </div>
    </SiteLayout>
  );
}
