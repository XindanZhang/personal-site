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
  border border-black bg-white px-3 py-1 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
  transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px]
  hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]
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
        <SectionHeading as="h1" title={title} />
        <p className="font-mono text-sm">{description}</p>
      </section>

      <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

      <section className="space-y-3">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider">View by category</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className={`${filterLinkClass} ${!activeCategorySlug && !activeTagSlug ? "bg-[#d4a72c]" : ""}`}
            href="/blog/"
          >
            All
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              className={`${filterLinkClass} ${activeCategorySlug === category.slug ? "bg-[#d4a72c]" : ""}`}
              href={`/blog/category/${category.slug}/`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-gray-500">Tags:</span>
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              className={`${filterLinkClass} px-2 py-0.5 text-xs ${activeTagSlug === tag.slug ? "bg-gray-200" : "bg-gray-100"}`}
              href={`/blog/tag/${tag.slug}/`}
            >
              #{tag.label}
            </Link>
          ))}
        </div>
      </section>

      <hr className="my-4 w-full border-0 border-t border-black" />

      {posts.length > 0 ? (
        <PostTable posts={posts} />
      ) : (
        <div className="border border-black bg-gray-50 p-4 font-mono text-sm text-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
          No posts found in this view yet. Return to the full archive and browse another category.
        </div>
      )}

      <div className="border border-black bg-gray-50 p-4 font-mono text-sm text-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
        Check the <Link className="font-medium text-black underline hover:no-underline" href="/projects/">Projects</Link> page for related site links, or use{" "}
        <a className="font-medium text-black underline hover:no-underline" href={site.email}>
          email
        </a>{" "}
        if you want to reach out directly.
      </div>
    </div>
  );
}
