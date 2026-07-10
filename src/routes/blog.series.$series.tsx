import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { PostTable } from "~/components/post-table";
import { getSeriesBySlug } from "~/lib/blog";

export const Route = createFileRoute("/blog/series/$series")({
  loader: ({ params }) => {
    const series = getSeriesBySlug(params.series);
    if (!series) throw notFound();
    return series;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Series"} | Xindan Zhang` },
      { name: "description", content: `The ${loaderData?.name ?? "selected"} research series, collected in reading order.` },
    ],
  }),
  component: SeriesPage,
});

function SeriesPage() {
  const series = Route.useLoaderData();
  return (
    <>
      <section className="page-intro series-intro">
        <Link className="back-link" to="/blog/"><ArrowLeft aria-hidden="true" size={15} /> All writing</Link>
        <div className="page-intro-grid">
          <div><p className="section-kicker">Series · {series.posts.length.toString().padStart(2, "0")} parts</p><h1>{series.name}</h1></div>
          <div><p>One research thread, ordered so the overview, experiments, and implementation details stay readable together.</p>{series.posts[0]?.sourceUrl ? <a className="text-link" href={series.posts[0].sourceUrl} target="_blank" rel="noopener noreferrer">Project source <ArrowUpRight aria-hidden="true" size={14} /></a> : null}</div>
        </div>
      </section>
      <section className="series-index" aria-label={`${series.name} articles`}><PostTable posts={series.posts} /></section>
    </>
  );
}
