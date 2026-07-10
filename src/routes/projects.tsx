import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ProjectLedger } from "~/components/project-ledger";
import { Reveal } from "~/components/reveal";
import { site } from "~/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Work | Xindan Zhang" },
      { name: "description", content: "Selected networking research, systems writing, and tools by Xindan Zhang." },
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
        <div className="page-intro-grid"><h1>Systems made legible.</h1><p>Network experiments, public research, and publishing tools built around one principle: observe behavior before polishing the interface.</p></div>
      </section>

      <Reveal as="section" className="featured-project" aria-labelledby="featured-title">
        <div className="featured-project-copy">
          <div className="project-label"><span>01</span><span>Featured research</span><span>2025–26</span></div>
          <h2 id="featured-title">{featuredProject.name}</h2>
          <p>{featuredProject.description}</p>
          <dl className="project-facts">
            <div><dt>Role</dt><dd>Independent researcher and technical writer</dd></div>
            <div><dt>Contribution</dt><dd>Traced controller paths and organized the findings into a repeatable reading path</dd></div>
            <div><dt>Result</dt><dd>Four linked technical notes covering the controller, processor, and lossless path</dd></div>
          </dl>
          <div className="project-actions">
            <Link className="action-link is-primary" to="/blog/series/$series/" params={{ series: "nextmini" }}>{featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={17} /></Link>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Reference: Nextmini.org <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
        <figure className="project-figure"><img src={`${site.basePath}/figures/nextmini-topology.svg`} alt="Bird's-eye architecture comparison between Mininet and Nextmini" /><figcaption><span>Nextmini topology</span><span>Figure 01</span></figcaption></figure>
      </Reveal>

      <Reveal as="section" className="work-index" delay={70} aria-labelledby="work-index-title">
        <header className="section-intro"><div><p className="section-kicker">Project index</p><h2 id="work-index-title">More work</h2></div><p>The publishing system behind this portfolio and an interactive Three.js character study.</p></header>
        <ProjectLedger projects={otherProjects} />
      </Reveal>
    </>
  );
}
