import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "../lib/blog";
import { formatMediumDate } from "../lib/blog";

function getRowLabel(post: BlogPost, index: number) {
  if (post.seriesOrder) return `Part ${post.seriesOrder}`;
  if (post.featured) return "Featured";
  return `Note ${index + 1}`;
}

export function PostTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="archive-ledger">
      {posts.map((post, index) => (
        <article key={post.slug} className="archive-row">
          <div className="archive-index">{String(index + 1).padStart(2, "0")}</div>
          <div className="archive-entry">
            <div className="archive-meta">
              <time dateTime={post.publishedAt.toISOString()}>{formatMediumDate(post.publishedAt)}</time>
              <span>{post.categoryLabel}</span>
              <span>{getRowLabel(post, index)}</span>
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
  );
}
