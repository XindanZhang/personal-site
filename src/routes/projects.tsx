import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ProjectLedger } from "~/components/project-ledger";
import { Reveal } from "~/components/reveal";
import { site } from "~/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Work | Xindan Zhang" },
      { name: "description", content: "Selected networking notes, systems work, and publishing tools." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [featuredProject, ...otherProjects] = site.projects;
  return (
    <>
      <section className="page-intro work-intro">
        <p className="section-kicker">Selected work · {site.projects.length.toString().padStart(2, "0")} projects</p>
        <div className="page-intro-grid"><h1>Systems made legible.</h1><p>Networking notes and publishing tools built around one principle: observe behavior before polishing the interface.</p></div>
      </section>

      <Reveal as="section" className="featured-project is-text-only" aria-labelledby="featured-title">
        <div className="featured-project-copy">
          <div className="project-label"><span>01</span><span>Featured notes</span><span>2025–26</span></div>
          <h2 id="featured-title">{featuredProject.name}</h2>
          <p>{featuredProject.description}</p>
          <dl className="project-facts">
            <div><dt>Format</dt><dd>Four-part code-reading series</dd></div>
            <div><dt>Focus</dt><dd>Controller paths, processor behavior, and lossless runtime</dd></div>
            <div><dt>Output</dt><dd>Four linked technical notes organized as a repeatable reading path</dd></div>
          </dl>
          <div className="project-actions">
            <Link className="action-link is-primary" to="/blog/series/$series/" params={{ series: "nextmini" }}>{featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={17} /></Link>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Reference: Nextmini.org <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="work-index" delay={70} aria-labelledby="work-index-title">
        <header className="section-intro"><div><p className="section-kicker">Project index</p><h2 id="work-index-title">More work</h2></div><p>The publishing system behind this portfolio and technical notebook.</p></header>
        <ProjectLedger projects={otherProjects} />
      </Reveal>
    </>
  );
}
