import Link from "next/link";
import { notFound } from "next/navigation";
import { PostTable } from "../../../../components/post-table";
import { PromptSection } from "../../../../components/prompt-section";
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
        <PromptSection command={`cat /blog/series/${series.slug}.txt`}>
          <h1 className="shell-heading">{series.name}</h1>
          <p className="shell-copy">
            A longer thread collected into one place so the overview, follow-up notes, and implementation details stay
            readable as a single sequence.
          </p>
          {series.posts[0]?.sourceUrl ? (
            <p className="shell-copy">
              source_url=
              <a
                className="terminal-inline-link"
                href={series.posts[0].sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {series.posts[0].sourceUrl}
              </a>
            </p>
          ) : null}
          <Link className="terminal-inline-link" href="/blog/">
            cd /blog
          </Link>
        </PromptSection>

        <PromptSection command={`ls -1 /blog/series/${series.slug}`}>
          <PostTable posts={series.posts} />
        </PromptSection>
      </div>
    </SiteLayout>
  );
}
