import Link from "next/link";
import { PostTable } from "../components/post-table";
import { ProjectCard } from "../components/project-card";
import { SectionHeading } from "../components/section-heading";
import { SiteLayout } from "../components/site-layout";
import { getAllSeries, getFeaturedPosts } from "../lib/blog";
import { getProjectsByStatus, site } from "../lib/site";

export default function HomePage() {
  const featuredProject = getProjectsByStatus("featured")[0];
  const highlightedPosts = getFeaturedPosts();
  const nextminiSeries = getAllSeries().find((series) => series.slug === "nextmini");

  return (
    <SiteLayout active="home">
      <div className="page-stack">
        <section className="orbital-hero">
          <div className="terminal-panel">
            <div className="terminal-prompt">
              <span className="prompt-host">xz@orbit</span>
              <span className="prompt-command">launch notebook --mode universe</span>
              <span aria-hidden="true" className="terminal-caret" />
            </div>
            <p className="hero-kicker">Signal log</p>
            <h1 className="hero-title">{site.home.heroTitle}</h1>
            <p className="hero-summary">{site.home.heroBody}</p>
            <p className="hero-quote">
              <em>{site.home.quote}</em>
            </p>
            <p className="eyebrow-copy">{site.home.body}</p>

            <div className="hero-actions">
              <Link className="button-link is-primary" href="/blog/">
                Open journal
                <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button-link is-secondary" href="/projects/">
                Browse projects
                <span aria-hidden="true">↗</span>
              </Link>
              <a className="button-link is-tertiary" href={site.email}>
                Email
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className="availability-note">{site.availability}</p>
          </div>

          <aside className="signal-panel field-notes-card">
            <p className="notes-title">{site.home.sideTitle}</p>
            <ul className="note-list">
              {site.home.sideNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="stack-section">
          <SectionHeading eyebrow="Journal" title="Signal map" />
          <p className="section-copy">{site.home.blogSummary}</p>
          <PostTable posts={highlightedPosts} />
        </section>

        <section className="stack-section">
          <SectionHeading eyebrow="Overview" title="Dock" />
          <div className="desk-grid">
            <div className="desk-card">
              <p className="desk-card-kicker">Journal</p>
              <h2 className="desk-card-title">A clear signal first, a feed second.</h2>
              <p className="desk-card-copy">
                Browse the full archive by thread, revisit series notes, or jump straight into the posts that still
                matter after the week ends.
              </p>
              <Link className="button-link is-secondary" href="/blog/">
                Open journal
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="desk-card">
              <p className="desk-card-kicker">Projects</p>
              <h2 className="desk-card-title">The infrastructure around the notebook.</h2>
              <p className="desk-card-copy">{site.home.projectsSummary}</p>
              <Link className="button-link is-secondary" href="/projects/">
                Browse projects
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="desk-card">
              <p className="desk-card-kicker">Reading</p>
              <h2 className="desk-card-title">A small ring of sites and tools worth returning to.</h2>
              <p className="desk-card-copy">
                The reading page keeps the references, products, and neighboring sites that shape how this archive is
                built.
              </p>
              <Link className="button-link is-secondary" href="/friends/">
                Browse reading list
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="desk-card">
              <p className="desk-card-kicker">About</p>
              <h2 className="desk-card-title">Context for the work and the pace behind it.</h2>
              <p className="desk-card-copy">
                The about page collects the practice areas, timeline, and outside links that explain the site without
                turning it into a resume dump.
              </p>
              <Link className="button-link is-secondary" href="/about/">
                Read about
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        {featuredProject || nextminiSeries ? (
          <section className="stack-section">
            <SectionHeading eyebrow="Thread" title="Current workbench" />
            <div className="desk-grid">
              {featuredProject ? <ProjectCard project={featuredProject} /> : null}

              <div className="surface-note">
                <p className="notes-title">Series</p>
                <p className="m-0 text-[1rem] leading-7 text-[var(--page-ink)]">
                  {nextminiSeries
                    ? `${nextminiSeries.name} currently spans ${nextminiSeries.posts.length} connected notes, from the overview through controller internals and runtime behavior.`
                    : "Longer threads live here when a single post is too small to hold the whole idea."}
                </p>
                {nextminiSeries ? (
                  <div className="mt-4">
                    <Link className="button-link is-secondary" href={`/blog/series/${nextminiSeries.slug}/`}>
                      Open {nextminiSeries.name}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <section className="surface-note">
          You can reach me at{" "}
          <a className="inline-link" href={site.email}>
            xindan.zhang@mail.utoronto.ca
          </a>
          , browse the code on{" "}
          <a className="inline-link" href={site.github} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
          , or start with the <Link className="inline-link" href="/blog/">journal</Link>.
        </section>
      </div>
    </SiteLayout>
  );
}
