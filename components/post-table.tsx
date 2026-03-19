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
    <div className="space-y-0">
      <div className="hidden border border-black bg-white tablet:flex">
        <div className="w-24 shrink-0 border-r border-black px-3 py-2 font-mono text-xs font-bold uppercase">
          Date
        </div>
        <div className="flex-1 border-r border-black px-3 py-2 font-mono text-xs font-bold uppercase">
          Title
        </div>
        <div className="w-36 shrink-0 border-r border-black px-3 py-2 font-mono text-xs font-bold uppercase">
          Category
        </div>
        <div className="w-32 shrink-0 px-3 py-2 font-mono text-xs font-bold uppercase">Tags</div>
      </div>

      {posts.map((post, index) => {
        const badgeTheme = getBadgeTheme(post.categoryLabel);

        return (
          <Link
            key={post.slug}
            className="group block border border-t-0 border-black bg-white transition-colors first:border-t hover:bg-gray-50"
            href={`/blog/${post.slug}/`}
          >
            <div className="hidden tablet:flex">
              <div className="w-24 shrink-0 border-r border-black px-3 py-3 font-mono text-sm">
                {formatShortDate(post.publishedAt)}
              </div>

              <div className="flex flex-1 flex-col justify-between border-r border-black px-3 py-3">
                <span className="font-mono text-sm font-medium underline decoration-transparent transition-colors group-hover:decoration-current">
                  {post.title}
                </span>
                <p className="mt-1 font-mono text-sm text-gray-600">{post.summary}</p>
              </div>

              <div className="w-36 shrink-0 border-r border-black px-3 py-3">
                <span
                  className="inline-flex items-center justify-center border border-black px-2 py-0.5 font-mono text-xs uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
                  style={{ backgroundColor: badgeTheme.background, color: badgeTheme.text }}
                >
                  {post.categoryLabel}
                </span>
              </div>

              <div className="w-32 shrink-0 px-3 py-3 font-mono text-sm">
                {post.tags.join(", ")}
              </div>
            </div>

            <div className="p-4 tablet:hidden">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="inline-flex items-center justify-center border border-black px-2 py-0.5 font-mono text-xs uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
                  style={{ backgroundColor: badgeTheme.background, color: badgeTheme.text }}
                >
                  {post.categoryLabel}
                </span>
                <span className="inline-flex items-center justify-center border border-black bg-white px-1.5 py-0.5 font-mono text-xs tracking-wider text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]">
                  {getRowLabel(post, index)}
                </span>
              </div>

              <h3 className="font-mono text-base font-bold underline decoration-transparent transition-colors group-hover:decoration-current">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 font-mono text-sm text-gray-600">{post.summary}</p>
              <div className="mt-2 flex items-center gap-2 font-mono text-xs text-gray-500">
                <span>{formatMediumDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.tags.join(", ")}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
