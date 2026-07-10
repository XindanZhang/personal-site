import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../../components/copy-link-button";
import { ReadingProgress } from "../../../components/reading-progress";
import { SiteLayout } from "../../../components/site-layout";
import { formatMediumDate, getAllPosts, getPostBySlug } from "../../../lib/blog";
import { site } from "../../../lib/site";

interface BlogPostPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.segments }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    authors: [{ name: site.name }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const posts = getAllPosts();
  const postIndex = posts.findIndex((entry) => entry.slug === post.slug);
  const newerPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const olderPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;
  const readingMinutes = Math.max(1, Math.round(post.html.replace(/<[^>]*>/g, " ").split(/\s+/).length / 220));

  return (
    <SiteLayout active="blog">
      <ReadingProgress />
      <article className="article-page">
        <header className="article-header">
          <Link className="back-link" href="/blog/">
            <ArrowLeft aria-hidden="true" size={15} /> Writing index
          </Link>
          <div className="article-taxonomy">
            <Link href={`/blog/category/${post.categorySlug}/`}>{post.categoryLabel}</Link>
            {post.series && post.seriesSlug ? (
              <Link href={`/blog/series/${post.seriesSlug}/`}>{post.series}</Link>
            ) : null}
          </div>
          <h1>{post.title}</h1>
          <p className="article-deck">{post.summary}</p>
          <div className="article-byline">
            <span>
              <CalendarDays aria-hidden="true" size={15} />
              <time dateTime={post.publishedAt.toISOString()}>{formatMediumDate(post.publishedAt)}</time>
            </span>
            <span>
              <Clock3 aria-hidden="true" size={15} /> {readingMinutes} min read
            </span>
            {post.updatedAt ? <span>Updated {formatMediumDate(post.updatedAt)}</span> : null}
            <CopyLinkButton />
          </div>
        </header>

        <div className={`article-content-grid ${post.headings.length === 0 ? "without-outline" : ""}`}>
          <div className="article-body">
            {post.sourceUrl ? (
              <a className="article-source glass-surface" href={post.sourceUrl} rel="noopener noreferrer" target="_blank">
                <span>Related project</span>
                <strong>{new URL(post.sourceUrl).hostname.replace(/^www\./, "")}</strong>
                <ArrowUpRight aria-hidden="true" size={17} />
              </a>
            ) : null}
            <div className="article-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

            <nav className="article-pagination" aria-label="Adjacent articles">
              {newerPost ? (
                <Link href={`/blog/${newerPost.slug}/`}>
                  <span>
                    <ArrowLeft aria-hidden="true" size={15} /> Newer note
                  </span>
                  <strong>{newerPost.title}</strong>
                </Link>
              ) : <span />}
              {olderPost ? (
                <Link href={`/blog/${olderPost.slug}/`} className="is-next">
                  <span>
                    Older note <ArrowRight aria-hidden="true" size={15} />
                  </span>
                  <strong>{olderPost.title}</strong>
                </Link>
              ) : null}
            </nav>
          </div>

          {post.headings.length > 0 ? (
            <aside className="article-outline glass-surface">
              <p>On this page</p>
              <nav aria-label="Table of contents">
                {post.headings.map((heading) => (
                  <a key={heading.slug} className={heading.depth > 2 ? "is-sub" : ""} href={`#${heading.slug}`}>
                    {heading.text}
                  </a>
                ))}
              </nav>
              <div className="article-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </aside>
          ) : null}
        </div>
      </article>
    </SiteLayout>
  );
}
