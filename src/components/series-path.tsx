import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "~/lib/blog";
import { formatMediumDate } from "~/lib/blog";
import { PostLink } from "./post-link";

export function SeriesPath({ posts }: { posts: BlogPost[] }) {
  return (
    <ol className="series-path">
      {posts.map((post, index) => (
        <li key={post.slug} className="series-path-item">
          <PostLink slug={post.slug} className="series-path-link">
            <div className="series-part"><span>Part</span><strong>{String(post.seriesOrder ?? index + 1).padStart(2, "0")}</strong></div>
            <div className="series-path-copy"><div className="post-meta"><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time><span>{post.categoryLabel}</span></div><h2>{post.title}</h2><p>{post.summary}</p></div>
            <ArrowUpRight aria-hidden="true" size={20} />
          </PostLink>
        </li>
      ))}
    </ol>
  );
}
