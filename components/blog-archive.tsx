import Link from "next/link";
import type { BlogPost, BlogTaxonomyEntry } from "../lib/blog";
import { formatMediumDate } from "../lib/blog";
import { BlogSearch } from "./blog-search";

interface BlogArchiveProps {
  pathCommand: string;
  description: string;
  posts: BlogPost[];
  categories: BlogTaxonomyEntry[];
  tags: BlogTaxonomyEntry[];
  activeCategorySlug?: string;
  activeTagSlug?: string;
}

export function BlogArchive({
  pathCommand,
  description,
  posts,
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: BlogArchiveProps) {
  const searchablePosts = posts.map((post, index) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    categoryLabel: post.categoryLabel,
    tags: post.tags,
    dateLabel: formatMediumDate(post.publishedAt),
    dateTime: post.publishedAt.toISOString(),
    label: post.seriesOrder ? `Part ${post.seriesOrder}` : post.featured ? "Featured" : `Note ${index + 1}`,
  }));

  return (
    <div className="writing-page">
      <section className="page-intro writing-intro">
        <p className="section-index">Writing / {pathCommand.replace(/^pwd:\s*/, "")}</p>
        <h1>Field notes from inside the system.</h1>
        <p>{description}</p>
      </section>

      <div className="taxonomy-panel glass-surface">
        <div className="taxonomy-row">
          <span className="taxonomy-label">Streams</span>
          <div className="filter-wrap">
            <Link
              className={`filter-chip ${!activeCategorySlug && !activeTagSlug ? "is-active" : ""}`}
              href="/blog/"
              aria-current={!activeCategorySlug && !activeTagSlug ? "page" : undefined}
            >
              All <span>{posts.length}</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                className={`filter-chip ${activeCategorySlug === category.slug ? "is-active" : ""}`}
                href={`/blog/category/${category.slug}/`}
                aria-current={activeCategorySlug === category.slug ? "page" : undefined}
              >
                {category.label} <span>{category.count}</span>
              </Link>
            ))}
          </div>
        </div>
        <details className="tag-disclosure">
          <summary>Browse tags</summary>
          <div className="filter-wrap is-tags">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                className={`filter-chip ${activeTagSlug === tag.slug ? "is-active" : ""}`}
                href={`/blog/tag/${tag.slug}/`}
                aria-current={activeTagSlug === tag.slug ? "page" : undefined}
              >
                #{tag.label} <span>{tag.count}</span>
              </Link>
            ))}
          </div>
        </details>
      </div>

      <BlogSearch posts={searchablePosts} />
    </div>
  );
}
