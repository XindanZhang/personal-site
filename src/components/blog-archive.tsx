import { Link } from "@tanstack/react-router";
import type { BlogPost, BlogTaxonomyEntry } from "~/lib/blog";
import { formatMediumDate } from "~/lib/blog";
import { BlogSearch } from "./blog-search";

interface BlogArchiveProps {
  routeLabel: string;
  description: string;
  posts: BlogPost[];
  categories: BlogTaxonomyEntry[];
  tags: BlogTaxonomyEntry[];
  activeCategorySlug?: string;
  activeTagSlug?: string;
}

export function BlogArchive({ routeLabel, description, posts, categories, tags, activeCategorySlug, activeTagSlug }: BlogArchiveProps) {
  const searchablePosts = posts.map((post, index) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    categoryLabel: post.categoryLabel,
    tags: post.tags,
    dateLabel: formatMediumDate(post.publishedAt),
    dateTime: post.publishedAt,
    label: post.seriesOrder ? `Part ${post.seriesOrder}` : post.featured ? "Featured" : `Note ${index + 1}`,
  }));

  return (
    <div className="writing-page">
      <section className="page-heading writing-heading">
        <p className="command-line"><span>xindan@portfolio:~$</span> cd {routeLabel}</p>
        <div className="heading-grid">
          <div><p className="eyebrow">WRITING / INDEX</p><h1>Field notes</h1></div>
          <p>{description}</p>
        </div>
      </section>

      <aside className="filter-console" aria-label="Writing filters">
        <div className="filter-console-title"><span>FILTER.TABLE</span><span>{posts.length.toString().padStart(2, "0")} ROWS</span></div>
        <div className="filter-group">
          <span className="filter-label">streams</span>
          <div className="filter-list">
            <Link className={!activeCategorySlug && !activeTagSlug ? "is-active" : ""} to="/blog/" aria-current={!activeCategorySlug && !activeTagSlug ? "page" : undefined}>all <b>{getTotalCount(categories)}</b></Link>
            {categories.map((category) => (
              <Link key={category.slug} className={activeCategorySlug === category.slug ? "is-active" : ""} to="/blog/category/$category/" params={{ category: category.slug }} aria-current={activeCategorySlug === category.slug ? "page" : undefined}>
                {category.label} <b>{category.count}</b>
              </Link>
            ))}
          </div>
        </div>
        <details className="tag-filter">
          <summary>tags.list <span>[{tags.length}]</span></summary>
          <div className="filter-list tags">
            {tags.map((tag) => (
              <Link key={tag.slug} className={activeTagSlug === tag.slug ? "is-active" : ""} to="/blog/tag/$tag/" params={{ tag: tag.slug }} aria-current={activeTagSlug === tag.slug ? "page" : undefined}>#{tag.label} <b>{tag.count}</b></Link>
            ))}
          </div>
        </details>
      </aside>

      <BlogSearch posts={searchablePosts} />
    </div>
  );
}

function getTotalCount(categories: BlogTaxonomyEntry[]) {
  return categories.reduce((total, category) => total + category.count, 0);
}
