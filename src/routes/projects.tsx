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
      <section className="page-heading work-heading">
        <p className="command-line"><span>xindan@portfolio:~$</span> find ./work -type project</p>
        <div className="heading-grid"><div><p className="eyebrow">WORK / SELECTED SYSTEMS</p><h1>Small systems, inspected closely.</h1></div><p>Network experiments, public research notes, and publishing tools built around one principle: make behavior observable before making it elegant.</p></div>
      </section>

      <Reveal as="section" className="featured-project" aria-labelledby="featured-title">
        <figure className="project-figure">
          <div className="figure-bar"><span>NEXTMINI / TOPOLOGY.VIEW</span><span>FIG.01</span></div>
          <img src={`${site.basePath}/figures/nextmini-topology.svg`} alt="Bird's-eye architecture comparison between Mininet and Nextmini" />
          <figcaption>Architecture diagram from the Nextmini research project.</figcaption>
        </figure>
        <div className="featured-project-copy">
          <p className="command-line"><span>$</span> inspect nextmini --verbose</p>
          <span className="project-status is-featured">featured research</span>
          <h2 id="featured-title">{featuredProject.name}</h2>
          <p>{featuredProject.description}</p>
          <dl className="project-facts">
            <div><dt>FOCUS</dt><dd>Controller interfaces, conductor paths, and lossless behavior</dd></div>
            <div><dt>METHOD</dt><dd>Trace the implementation, rerun the experiment, preserve the useful detail</dd></div>
            <div><dt>OUTPUT</dt><dd>Four linked technical notes and a repeatable reading path</dd></div>
          </dl>
          <div className="project-actions">
            <Link className="command-button is-primary" to="/blog/series/$series/" params={{ series: "nextmini" }}>{featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={15} /></Link>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Nextmini.org <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="work-index" delay={70} aria-labelledby="work-index-title">
        <header className="section-heading"><div><p className="command-line"><span>$</span> ls -la ./work/more</p><h2 id="work-index-title">More work</h2></div><p>Writing infrastructure, source code, and the older build notes that record how this notebook evolved.</p></header>
        <ProjectLedger projects={otherProjects} />
      </Reveal>
    </>
  );
}
