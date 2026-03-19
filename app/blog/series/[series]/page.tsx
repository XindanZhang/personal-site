import Link from "next/link";
import { notFound } from "next/navigation";
import { PostTable } from "../../../../components/post-table";
import { SectionHeading } from "../../../../components/section-heading";
import { SiteLayout } from "../../../../components/site-layout";
import { getAllSeries, getSeriesBySlug } from "../../../../lib/blog";

const buttonClassName =
  "inline-flex items-center justify-center gap-1.5 border border-black bg-white px-3 py-1 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]";

export function generateStaticParams() {
  return getAllSeries().map((series) => ({
    series: series.slug,
  }));
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    notFound();
  }

  return (
    <SiteLayout active="blog">
      <div className="space-y-6">
        <section>
          <SectionHeading as="h1" title={`${series.name} series`} />
          <p className="font-mono text-sm">
            Posts collected under one thread so it is easier to follow future updates.
          </p>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <section className="space-y-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider">Series overview</h2>
          <p className="font-mono text-sm text-gray-600">
            Every published note in this thread, ordered for easy reading.
          </p>

          <div className="flex flex-wrap gap-3">
            {series.posts[0]?.sourceUrl ? (
              <a
                className={`${buttonClassName} bg-[#d4a72c] text-black`}
                href={series.posts[0].sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Official site
                <span aria-hidden="true">→</span>
              </a>
            ) : null}

            <Link className={buttonClassName} href="/blog/">
              Back to archive
            </Link>
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-black" />

        <PostTable posts={series.posts} />
      </div>
    </SiteLayout>
  );
}
