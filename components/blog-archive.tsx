import Link from "next/link";
import type { BlogPost, BlogTaxonomyEntry } from "../lib/blog";
import { site } from "../lib/site";
import { PostTable } from "./post-table";
import { PromptSection } from "./prompt-section";

interface BlogArchiveProps {
  pathCommand: string;
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
  pathCommand,
  description,
  posts,
  categories,
  tags,
  activeCategorySlug,
  activeTagSlug,
}: BlogArchiveProps) {
  return (
    <div className="journal-layout">
      <aside className="journal-sidebar">
        <PromptSection as="section" command={pathCommand}>
          <p className="shell-copy">{description}</p>
        </PromptSection>

        <PromptSection as="section" command="ls /journal/categories">
          <div className="filter-group">
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
        </PromptSection>

        <PromptSection as="section" command="ls /journal/tags">
          <div className="filter-group">
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
        </PromptSection>
      </aside>

      <div className="journal-main">
        <PromptSection as="section" command="ls -ltr /journal">
          {posts.length > 0 ? (
            <PostTable posts={posts} />
          ) : (
            <div className="terminal-empty">No entries in this view yet.</div>
          )}
        </PromptSection>

        <PromptSection as="section" command="printf '%s\n' /projects /contact">
          <p className="shell-copy">
            related=
            <Link className="terminal-inline-link" href="/projects/">
              /projects
            </Link>{" "}
            contact=
            <a className="terminal-inline-link" href={site.email}>
              {site.email.replace("mailto:", "")}
            </a>
          </p>
        </PromptSection>
      </div>
    </div>
  );
}
