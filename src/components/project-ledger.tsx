import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ProjectLink } from "~/lib/site";

export function ProjectLedger({ projects }: { projects: ProjectLink[] }) {
  return (
    <div className="project-ledger">
      {projects.map((project, index) => (
        <article key={project.name} className="project-row">
          <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="project-row-main">
            <div className="project-heading"><span className={`project-status is-${project.status}`}>{project.status}</span><h3>{project.name}</h3></div>
            <p>{project.description}</p>
            <div className="tag-line">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          {project.external ? (
            <a className="project-action" href={project.href} target="_blank" rel="noopener noreferrer">{project.hrefLabel}<ArrowUpRight aria-hidden="true" size={15} /></a>
          ) : (
            <Link className="project-action" to={project.href}>{project.hrefLabel}<ArrowRight aria-hidden="true" size={15} /></Link>
          )}
        </article>
      ))}
    </div>
  );
}
