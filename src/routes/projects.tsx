import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
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

      <section className="work-composition" aria-label="Selected projects">
        <Reveal as="article" className="work-feature">
          <header className="work-feature-top"><span>Featured research notes</span><time>2025—26</time></header>
          <div className="work-feature-layout">
            <div className="work-feature-title"><span className="work-project-number">01 / Research thread</span><h2>{featuredProject.name}</h2></div>
            <div className="work-feature-body">
              <p>{featuredProject.description}</p>
              <p className="work-scope">Controller paths <i aria-hidden="true" /> Processor behavior <i aria-hidden="true" /> Lossless runtime</p>
              <div className="project-actions">
                <Link className="action-link is-primary" to="/blog/series/$series/" params={{ series: "nextmini" }}>{featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={17} /></Link>
                <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Nextmini.org <ArrowUpRight aria-hidden="true" size={14} /></a>
              </div>
            </div>
          </div>
        </Reveal>

        {otherProjects.map((project) => (
          <Reveal as="article" className="work-companion" delay={70} key={project.name}>
            <div className="work-companion-title"><p className="section-kicker">Built alongside · {project.status}</p><h2>{project.name}</h2></div>
            <div className="work-companion-body"><p>{project.description}</p><p className="work-tag-line">{project.tags.join(" · ")}</p>{project.external ? <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel} <ArrowUpRight aria-hidden="true" size={15} /></a> : <Link className="text-link" to={project.href}>{project.hrefLabel} <ArrowRight aria-hidden="true" size={15} /></Link>}</div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
