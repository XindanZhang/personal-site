import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "~/lib/blog";
import { formatMediumDate } from "~/lib/blog";
import { PostLink } from "./post-link";

export function PostTable({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="post-ledger">
      {posts.map((post, index) => (
        <article key={post.slug} className="post-row">
          <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="post-row-main">
            <div className="post-meta"><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time><span>{post.categoryLabel}</span><span>{post.seriesOrder ? `Part ${post.seriesOrder}` : "Note"}</span></div>
            <h2><PostLink slug={post.slug}>{post.title}</PostLink></h2>
            <p>{post.summary}</p>
            <div className="tag-line">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
          </div>
          <PostLink slug={post.slug} className="row-open"><ArrowUpRight aria-hidden="true" size={18} /><span className="sr-only">Read {post.title}</span></PostLink>
        </article>
      ))}
    </div>
  );
}
