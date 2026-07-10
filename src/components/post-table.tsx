import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "~/lib/blog";
import { formatMediumDate } from "~/lib/blog";
import { PostLink } from "./post-link";

export function PostTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="post-ledger">
      {posts.map((post, index) => (
        <article key={post.slug} className="post-row">
          <PostLink slug={post.slug} className="post-row-link">
            <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="post-row-main"><div className="post-meta"><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time><span>{post.categoryLabel}</span><span>{post.seriesOrder ? `Part ${post.seriesOrder}` : "Note"}</span></div><h2>{post.title}</h2><p>{post.summary}</p></div>
            <ArrowUpRight className="row-open" aria-hidden="true" size={20} />
          </PostLink>
        </article>
      ))}
    </div>
  );
}
