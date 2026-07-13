import { ArrowUpRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { BlogTaxonomyEntry } from "~/lib/blog";
import { PostLink } from "./post-link";

export interface SearchablePost {
  slug: string;
  title: string;
  summary: string;
  categoryLabel: string;
  categorySlug: string;
  tags: string[];
  dateTime: string;
}

export function BlogSearch({ posts, categories }: { posts: SearchablePost[]; categories: BlogTaxonomyEntry[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visiblePosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = activeCategory === "all" || post.categorySlug === activeCategory;
      const matchesQuery = !normalizedQuery || [post.title, post.summary, post.categoryLabel, ...post.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, normalizedQuery, posts]);

  const yearGroups = useMemo(() => {
    const groups = new Map<string, SearchablePost[]>();
    for (const post of visiblePosts) {
      const year = post.dateTime.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    }
    return [...groups.entries()];
  }, [visiblePosts]);

  return (
    <div className="writing-search">
      <div className="writing-toolbox">
        <div className="topic-filter" aria-label="Filter writing by recurring topic">
          <button className={activeCategory === "all" ? "is-active" : ""} type="button" aria-pressed={activeCategory === "all"} onClick={() => setActiveCategory("all")}>All <span>{posts.length}</span></button>
          {categories.map((category) => <button key={category.slug} className={activeCategory === category.slug ? "is-active" : ""} type="button" aria-pressed={activeCategory === category.slug} onClick={() => setActiveCategory(category.slug)}>{category.label} <span>{category.count}</span></button>)}
        </div>
        <div className="search-field">
          <label htmlFor="writing-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Search writing</span></label>
          <input id="writing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, topic, or tag" />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search" title="Clear search"><X aria-hidden="true" size={17} /></button> : null}
          <output aria-live="polite">{visiblePosts.length} of {posts.length}</output>
        </div>
      </div>

      <div className="writing-stream" aria-label="Writing archive">
        {yearGroups.map(([year, yearPosts]) => (
          <section className="writing-year-group" key={year} aria-labelledby={`writing-year-${year}`}>
            <header className="writing-year-marker"><h2 id={`writing-year-${year}`}>{year}</h2><p>{yearPosts.length} {yearPosts.length === 1 ? "note" : "notes"}</p></header>
            <div className="writing-year-posts">
              {yearPosts.map((post) => (
                <article key={post.slug} className="writing-entry">
                  <PostLink slug={post.slug} className="writing-entry-link">
                    <div className="writing-entry-meta"><time dateTime={post.dateTime}>{formatMonthDay(post.dateTime)}</time><span>{post.categoryLabel}</span></div>
                    <div className="writing-entry-main"><h3>{post.title}</h3><p>{post.summary}</p></div>
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </PostLink>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {visiblePosts.length === 0 ? <div className="empty-state"><strong>No matching notes.</strong><p>Try a broader system, protocol, or tool name.</p></div> : null}
    </div>
  );
}

function formatMonthDay(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(date));
}
