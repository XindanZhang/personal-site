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
      <section className="page-intro writing-intro">
        <p className="section-kicker">Writing · {posts.length.toString().padStart(2, "0")} {posts.length === 1 ? "note" : "notes"}</p>
        <div className="page-intro-grid"><h1>Writing.</h1><p>{description}</p></div>
      </section>

      <div className="writing-controls" aria-label="Writing filters">
        <nav className="category-tabs" aria-label="Categories">
          <Link className={!activeCategorySlug && !activeTagSlug ? "is-active" : ""} to="/blog/" aria-current={!activeCategorySlug && !activeTagSlug ? "page" : undefined}>All <b>{getTotalCount(categories)}</b></Link>
          {categories.map((category) => <Link key={category.slug} className={activeCategorySlug === category.slug ? "is-active" : ""} to="/blog/category/$category/" params={{ category: category.slug }} aria-current={activeCategorySlug === category.slug ? "page" : undefined}>{category.label} <b>{category.count}</b></Link>)}
        </nav>
        <details className="tag-menu">
          <summary>Tags <span>{tags.length}</span></summary>
          <div className="tag-menu-list">
            {tags.map((tag) => (
              <Link key={tag.slug} className={activeTagSlug === tag.slug ? "is-active" : ""} to="/blog/tag/$tag/" params={{ tag: tag.slug }} aria-current={activeTagSlug === tag.slug ? "page" : undefined}>#{tag.label} <b>{tag.count}</b></Link>
            ))}
          </div>
        </details>
        <Link className="bookmark-control" to="/bookmarks/">Bookmarks</Link>
      </div>

      <BlogSearch posts={searchablePosts} />
    </div>
  );
}

function getTotalCount(categories: BlogTaxonomyEntry[]) {
  return categories.reduce((total, category) => total + category.count, 0);
}
