"use client";

import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
      <div className="search-field glass-surface">
        <Search aria-hidden="true" size={18} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, topics, or tags"
          aria-label="Search writing"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" title="Clear search">
            <X aria-hidden="true" size={17} />
          </button>
        ) : null}
      </div>
      <p className="search-count" role="status" aria-live="polite">
        {visiblePosts.length} {visiblePosts.length === 1 ? "note" : "notes"}
      </p>

      <div className="archive-ledger">
        {visiblePosts.map((post, index) => (
          <article key={post.slug} className="archive-row">
            <div className="archive-index">{String(index + 1).padStart(2, "0")}</div>
            <div className="archive-entry">
              <div className="archive-meta">
                <time dateTime={post.dateTime}>{post.dateLabel}</time>
                <span>{post.categoryLabel}</span>
                <span>{post.label}</span>
              </div>
              <h2>
                <Link className="archive-link" href={`/blog/${post.slug}/`}>
                  {post.title}
                </Link>
              </h2>
              <p className="archive-summary">{post.summary}</p>
              <div className="archive-keywords" aria-label="Tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
            <ArrowUpRight className="row-arrow" aria-hidden="true" size={18} />
          </article>
        ))}
      </div>

      {visiblePosts.length === 0 ? (
        <div className="empty-state">
          <strong>No matching notes.</strong>
          <p>Try a broader system, protocol, or tool name.</p>
        </div>
      ) : null}
    </div>
  );
}
