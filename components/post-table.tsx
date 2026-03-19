import Link from "next/link";
import type { BlogPost } from "../lib/blog";
import { formatMediumDate, formatShortDate, getBadgeTheme } from "../lib/blog";

interface PostTableProps {
  posts: BlogPost[];
}

function getRowLabel(post: BlogPost, index: number) {
  if (post.seriesOrder) {
    return `Part ${post.seriesOrder}`;
  }

  if (post.featured) {
    return "Featured";
  }

  return String(index + 1).padStart(2, "0");
}

export function PostTable({ posts }: PostTableProps) {
  return (
    <div className="archive-ledger">
      {posts.map((post, index) => {
        const badgeTheme = getBadgeTheme(post.categoryLabel);

        return (
          <article key={post.slug} className="archive-row">
            <div className="archive-date">
              <span className="archive-date-short">{formatShortDate(post.publishedAt)}</span>
              <span className="archive-date-long">{formatMediumDate(post.publishedAt)}</span>
            </div>

            <div className="archive-entry">
              <div className="archive-title-row">
                <div className="archive-meta">
                  <span
                    className="archive-category"
                    style={{ backgroundColor: badgeTheme.background, color: badgeTheme.text }}
                  >
                    {post.categoryLabel}
                  </span>
                  <span className="archive-number">{getRowLabel(post, index)}</span>
                </div>
              </div>

              <Link className="archive-link" href={`/blog/${post.slug}/`}>
                {post.title}
              </Link>
              <p className="archive-summary">{post.summary}</p>

              <div className="archive-keywords">
                {post.tags.map((tag) => (
                  <span key={tag} className="archive-keyword">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
