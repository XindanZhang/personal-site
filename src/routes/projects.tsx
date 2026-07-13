import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "~/components/reveal";
import { site } from "~/lib/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | Xindan Zhang" },
      { name: "description", content: "Research and publishing projects in networked systems." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [featuredProject, ...otherProjects] = site.projects;
  return (
    <>
      <section className="page-intro work-intro">
        <p className="section-kicker">Projects · {site.projects.length.toString().padStart(2, "0")}</p>
        <div className="page-intro-grid"><h1>Projects.</h1><p>Two ongoing projects: a source-guided study of Nextmini and the publishing system behind this site.</p></div>
      </section>

      <section className="work-composition" aria-label="Projects">
        <Reveal as="article" className="project-card work-feature">
          <header className="work-feature-top"><span>Research series</span><time>2025—26</time></header>
          <div className="work-feature-layout">
            <div className="work-feature-title"><span className="work-project-number">01 / Networked systems</span><h2>{featuredProject.name}</h2></div>
            <div className="work-feature-body">
              <p>{featuredProject.description}</p>
              <p className="work-scope">Controller interfaces <i aria-hidden="true" /> Conductor behavior <i aria-hidden="true" /> Lossless execution</p>
              <div className="project-actions">
                <Link className="action-link is-primary" to="/blog/series/$series/" params={{ series: "nextmini" }}>{featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={17} /></Link>
                <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Nextmini.org <ArrowUpRight aria-hidden="true" size={14} /></a>
              </div>
            </div>
          </div>
        </Reveal>

        {otherProjects.map((project) => (
          <Reveal as="article" className="project-card work-companion" delay={70} key={project.name}>
            <header className="work-feature-top"><span>Publishing system</span><time>2026</time></header>
            <div className="work-companion-layout">
              <div className="work-companion-title"><p className="work-project-number">02 / Web publishing</p><h2>{project.name}</h2></div>
              <div className="work-companion-body"><p>{project.description}</p><p className="work-tag-line">{project.tags.join(" · ")}</p>{project.external ? <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel} <ArrowUpRight aria-hidden="true" size={15} /></a> : <Link className="text-link" to={project.href}>{project.hrefLabel} <ArrowRight aria-hidden="true" size={15} /></Link>}</div>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
