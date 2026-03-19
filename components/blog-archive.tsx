import Link from "next/link";
import type { BlogPost, BlogTaxonomyEntry } from "../lib/blog";
import { site } from "../lib/site";
import { PostTable } from "./post-table";
import { SectionHeading } from "./section-heading";

interface BlogArchiveProps {
  title: string;
  description: string;
  posts: BlogPost[];
  categories: BlogTaxonomyEntry[];
  tags: BlogTaxonomyEntry[];
  activeCategorySlug?: string;
  activeTagSlug?: string;
}

const filterLinkClass = `
  filter-chip
`;

export function BlogArchive({
  title,
  description,
  posts,
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: BlogArchiveProps) {
  return (
    <div className="space-y-6">
      <section>
        <SectionHeading as="h1" eyebrow="Journal" title={title} />
        <p className="section-copy">{description}</p>
      </section>

      <section className="archive-filter">
        <div className="filter-group">
          <p className="filter-label">Browse by thread</p>
          <div className="filter-wrap">
            <Link
              className={`${filterLinkClass} ${!activeCategorySlug && !activeTagSlug ? "is-active" : ""}`}
              href="/blog/"
            >
              All notes
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                className={`${filterLinkClass} ${activeCategorySlug === category.slug ? "is-active" : ""}`}
                href={`/blog/category/${category.slug}/`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <p className="filter-label">Keywords</p>
          <div className="filter-wrap">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                className={`${filterLinkClass} ${activeTagSlug === tag.slug ? "is-active" : ""}`}
                href={`/blog/tag/${tag.slug}/`}
              >
                #{tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Archive" title="Archive ledger" />
      </section>
      {posts.length > 0 ? (
        <PostTable posts={posts} />
      ) : (
        <div className="surface-note">
          No posts found in this view yet. Return to the full archive and browse another category.
        </div>
      )}

      <div className="surface-note">
        Check the{" "}
        <Link className="inline-link" href="/projects/">
          projects
        </Link>{" "}
        page for related site links, or use{" "}
        <a className="inline-link" href={site.email}>
          email
        </a>{" "}
        if you want to reach out directly.
      </div>
    </div>
  );
}
