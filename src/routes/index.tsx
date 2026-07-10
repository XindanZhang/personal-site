import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PostLink } from "~/components/post-link";
import { Reveal } from "~/components/reveal";
import { formatMediumDate, getAllPosts } from "~/lib/blog";
import { site } from "~/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xindan Zhang | Systems, networks, and field notes" },
      { name: "description", content: site.description },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const featuredProject = site.projects[0];

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-axis" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="hero-topline">
          <span>Systems · Networks · Tools</span>
          <span><i className="status-dot" aria-hidden="true" /> U of T ECE</span>
        </div>
        <h1 id="home-title"><span>Xindan</span><span>Zhang.</span></h1>
        <div className="hero-intro">
          <p className="hero-role">PhD student in Electrical &amp; Computer Engineering at U of T.</p>
          <div>
            <p>{site.home.heroTitle}</p>
            <div className="hero-actions">
              <Link className="action-link is-primary" to="/projects/">View selected work <ArrowRight aria-hidden="true" size={18} /></Link>
              <a className="action-link" href={site.email}><Mail aria-hidden="true" size={17} /> Email</a>
            </div>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true"><span>01 / Observe</span><span>02 / Test</span><span>03 / Document</span></div>
      </section>

      <Reveal as="section" className="selected-work" aria-labelledby="selected-work-title">
        <header className="section-intro">
          <div><p className="section-kicker">Selected work · {site.projects.length.toString().padStart(2, "0")}</p><h2 id="selected-work-title">Built to make behavior visible.</h2></div>
          <Link className="text-link" to="/projects/">All work <ArrowRight aria-hidden="true" size={16} /></Link>
        </header>

        <div className="home-work-list">
          <Link className="home-work-row" to="/blog/series/$series/" params={{ series: "nextmini" }}>
            <span className="work-number">01</span><div><p className="work-meta">Technical notes · Active</p><h3>{featuredProject.name}</h3><p>{featuredProject.description}</p></div><span className="work-link">Read series <ArrowUpRight aria-hidden="true" size={17} /></span>
          </Link>
          <a className="home-work-row" href={site.projects[1].href} target="_blank" rel="noopener noreferrer">
            <span className="work-number">02</span><div><p className="work-meta">Design &amp; engineering · Open source</p><h3>{site.projects[1].name}</h3><p>{site.projects[1].description}</p></div><span className="work-link">View source <ArrowUpRight aria-hidden="true" size={17} /></span>
          </a>
        </div>
      </Reveal>

      <Reveal as="section" className="writing-preview" delay={60} aria-labelledby="writing-preview-title">
        <header className="section-intro"><div><p className="section-kicker">Recent writing</p><h2 id="writing-preview-title">Notes worth reopening.</h2></div><Link className="text-link" to="/blog/">Browse the archive <ArrowRight aria-hidden="true" size={16} /></Link></header>
        <div className="writing-preview-list">
          {recentPosts.map((post, index) => (
            <PostLink key={post.slug} slug={post.slug} className="writing-preview-row">
              <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
              <div className="post-meta"><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time><span>{post.categoryLabel}</span></div>
              <div><h3>{post.title}</h3><p>{post.summary}</p></div>
              <ArrowUpRight aria-hidden="true" size={20} />
            </PostLink>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="practice-band" delay={90} aria-labelledby="practice-title">
        <div className="practice-statement"><p className="section-kicker">Working practice</p><h2 id="practice-title">“{site.home.quote}”</h2><p>{site.home.heroBody}</p><Link className="text-link" to="/about/">More about the practice <ArrowRight aria-hidden="true" size={16} /></Link></div>
        <div className="practice-index">
          <div><span>01</span><h3>Observe</h3><p>Start from traces, behavior, and the smallest reproducible case.</p></div>
          <div><span>02</span><h3>Test</h3><p>Remove assumptions and rerun the path until the result is explainable.</p></div>
          <div><span>03</span><h3>Document</h3><p>Keep the commands, context, and evidence that remain useful later.</p></div>
        </div>
      </Reveal>
    </>
  );
}
