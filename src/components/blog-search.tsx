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
      <div className="search-console">
        <label htmlFor="writing-search"><Search aria-hidden="true" size={17} /> grep</label>
        <input id="writing-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, topic, or tag" />
        {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search" title="Clear search"><X aria-hidden="true" size={17} /></button> : null}
        <output aria-live="polite">{visiblePosts.length.toString().padStart(2, "0")} matches</output>
      </div>

      <div className="post-ledger">
        {visiblePosts.map((post, index) => (
          <article key={post.slug} className="post-row">
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="post-row-main">
              <div className="post-meta"><time dateTime={post.dateTime}>{post.dateLabel}</time><span>{post.categoryLabel}</span><span>{post.label}</span></div>
              <h2><PostLink slug={post.slug}>{post.title}</PostLink></h2>
              <p>{post.summary}</p>
              <div className="tag-line" aria-label="Tags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            </div>
            <PostLink slug={post.slug} className="row-open"><ArrowUpRight aria-hidden="true" size={18} /><span className="sr-only">Read {post.title}</span></PostLink>
          </article>
        ))}
      </div>

      {visiblePosts.length === 0 ? <div className="empty-state"><strong>0 records returned.</strong><p>Try a broader system, protocol, or tool name.</p></div> : null}
    </div>
  );
}
