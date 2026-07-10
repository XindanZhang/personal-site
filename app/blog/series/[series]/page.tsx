import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostTable } from "../../../../components/post-table";
import { SiteLayout } from "../../../../components/site-layout";
import { getAllSeries, getSeriesBySlug } from "../../../../lib/blog";

export function generateStaticParams() {
  return getAllSeries().map((series) => ({ series: series.slug }));
}

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) notFound();

  return (
    <SiteLayout active="blog">
      <section className="page-intro series-intro">
        <Link className="back-link" href="/blog/">
          <ArrowLeft aria-hidden="true" size={15} /> Writing index
        </Link>
        <p className="section-index">Series / {series.name}</p>
        <h1>{series.name}</h1>
        <p>
          One research thread, collected in sequence so the overview, follow-up experiments, and implementation details
          stay readable together.
        </p>
        {series.posts[0]?.sourceUrl ? (
          <a className="text-link" href={series.posts[0].sourceUrl} rel="noopener noreferrer" target="_blank">
            Project source <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        ) : null}
      </section>
      <section className="series-index" aria-label={`${series.name} articles`}>
        <PostTable posts={series.posts} />
      </section>
    </SiteLayout>
  );
}
