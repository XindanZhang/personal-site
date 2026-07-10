import { ArrowUpRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PostLink } from "./post-link";

export interface SearchablePost {
  slug: string;
  title: string;
  summary: string;
  categoryLabel: string;
  tags: string[];
  dateLabel: string;
  dateTime: string;
  label: string;
}

export function BlogSearch({ posts }: { posts: SearchablePost[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visiblePosts = useMemo(() => {
    if (!normalizedQuery) return posts;
    return posts.filter((post) =>
      [post.title, post.summary, post.categoryLabel, ...post.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery, posts]);

  return (
    <div className="writing-search">
      <div className="search-field">
        <label htmlFor="writing-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Search writing</span></label>
        <input id="writing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, topic, or tag" />
        {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search" title="Clear search"><X aria-hidden="true" size={17} /></button> : null}
        <output aria-live="polite">{visiblePosts.length} {visiblePosts.length === 1 ? "result" : "results"}</output>
      </div>

      <div className="post-ledger">
        {visiblePosts.map((post, index) => (
          <article key={post.slug} className="post-row">
            <PostLink slug={post.slug} className="post-row-link">
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="post-row-main"><div className="post-meta"><time dateTime={post.dateTime}>{post.dateLabel}</time><span>{post.categoryLabel}</span><span>{post.label}</span></div><h2>{post.title}</h2><p>{post.summary}</p></div>
              <ArrowUpRight className="row-open" aria-hidden="true" size={20} />
            </PostLink>
          </article>
        ))}
      </div>

      {visiblePosts.length === 0 ? <div className="empty-state"><strong>No matching notes.</strong><p>Try a broader system, protocol, or tool name.</p></div> : null}
    </div>
  );
}
