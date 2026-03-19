import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../../components/copy-link-button";
import { SiteLayout } from "../../../components/site-layout";
import {
  formatIsoDate,
  getAllPosts,
  getBadgeTheme,
  getPostBySlug,
} from "../../../lib/blog";

const toolButtonClassName =
  "flex items-center gap-2 border border-black bg-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.segments,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const badgeTheme = getBadgeTheme(post.categoryLabel);

  return (
    <SiteLayout active="blog">
      <div className="space-y-6">
        <div className="flex items-center justify-between font-mono text-sm">
          <Link className={toolButtonClassName} href="/blog/">
            All
          </Link>
          <CopyLinkButton />
        </div>

        <div className="border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="border-b border-black px-3 py-3 tablet:px-4">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Link
                className="border border-black px-2 py-0.5 uppercase hover:brightness-95"
                href={`/blog/category/${post.categorySlug}/`}
                style={{ backgroundColor: badgeTheme.background, color: badgeTheme.text }}
              >
                {post.categoryLabel}
              </Link>
              {post.series && post.seriesSlug ? (
                <Link
                  className="border border-black bg-white px-2 py-0.5 hover:bg-gray-100"
                  href={`/blog/series/${post.seriesSlug}/`}
                >
                  Series
                </Link>
              ) : null}
            </div>
          </div>

          <div className="px-3 py-4 tablet:px-4">
            <h1 className="font-mono text-lg font-bold tablet:text-xl">{post.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-gray-600 tablet:gap-4">
              <span>{formatIsoDate(post.publishedAt)}</span>
              {post.tags.length > 0 ? (
                <span className="border-l border-black pl-2 tablet:pl-4">{post.tags.join(", ")}</span>
              ) : null}
            </div>
            <p className="mt-3 font-mono text-sm text-gray-600">
              <em>{post.summary}</em>
            </p>
          </div>
        </div>

        {post.sourceUrl || (post.series && post.seriesSlug) ? (
          <div className="grid gap-4 tablet:grid-cols-2">
            {post.sourceUrl ? (
              <div className="border border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="font-mono text-xs uppercase tracking-wider text-gray-500">Source</div>
                <a
                  className="mt-2 inline-block font-mono text-sm underline hover:no-underline"
                  href={post.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Official site
                </a>
              </div>
            ) : null}

            {post.series && post.seriesSlug ? (
              <div className="border border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="font-mono text-xs uppercase tracking-wider text-gray-500">Series</div>
                <Link
                  className="mt-2 inline-block font-mono text-sm underline hover:no-underline"
                  href={`/blog/series/${post.seriesSlug}/`}
                >
                  {post.series} series
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="overflow-hidden border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
          <article
            className="article-prose max-w-none overflow-x-hidden p-4 tablet:p-6"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
