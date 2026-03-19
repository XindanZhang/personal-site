import Link from "next/link";
import { notFound } from "next/navigation";
import { PostTable } from "../../../../components/post-table";
import { SectionHeading } from "../../../../components/section-heading";
import { SiteLayout } from "../../../../components/site-layout";
import { getAllSeries, getSeriesBySlug } from "../../../../lib/blog";

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
      <div className="page-stack">
        <section>
          <SectionHeading as="h1" eyebrow="Series" title={series.name} />
          <p className="section-copy">
            A longer thread collected into one place so the overview, follow-up notes, and implementation details stay
            readable as a single sequence.
          </p>
        </section>

        <section className="stack-section">
          <SectionHeading eyebrow="Guide" title="Series overview" />
          <div className="article-support">
            <div className="support-card">
              <p className="support-label">Reading note</p>
              <p className="m-0 text-[1rem] leading-7 text-[var(--muted)]">
                Every published note in this thread, ordered so you can move from the initial overview to the deeper
                implementation details without guessing what comes next.
              </p>
            </div>

            {series.posts[0]?.sourceUrl ? (
              <div className="support-card">
                <p className="support-label">Official site</p>
                <a
                  className="inline-link"
                  href={series.posts[0].sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {series.posts[0].sourceUrl}
                </a>
              </div>
            ) : null}
          </div>

          <div className="hero-actions">
            <Link className="button-link is-secondary" href="/blog/">
              Back to journal
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="stack-section">
          <PostTable posts={series.posts} />
        </section>
      </div>
    </SiteLayout>
  );
}
