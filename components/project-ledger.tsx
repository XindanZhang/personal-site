import Link from "next/link";
import type { ProjectLink, ProjectStatus } from "../lib/site";

const statusLabels: Record<ProjectStatus, string> = {
  featured: "featured",
  active: "active",
  archived: "archive",
};

function ProjectLedgerAction({ project }: { project: ProjectLink }) {
  if (project.external) {
    return (
      <a className="project-ledger-action" href={project.href} rel="noopener noreferrer" target="_blank">
        {project.hrefLabel} →
      </a>
    );
  }

  return (
    <Link className="project-ledger-action" href={project.href}>
      {project.hrefLabel} →
    </Link>
  );
}

export function ProjectLedger({ projects }: { projects: ProjectLink[] }) {
  return (
    <div className="project-ledger">
      {projects.map((project) => (
        <article key={project.name} className="project-ledger-row">
          <div className="project-ledger-column project-ledger-column-status">
            <span className={`project-status status-${project.status}`}>{statusLabels[project.status]}</span>
          </div>

          <div className="project-ledger-column project-ledger-column-main">
            <h3 className="project-ledger-name">{project.name}</h3>
            <p className="project-ledger-summary">{project.description}</p>
          </div>

          <div className="project-ledger-column project-ledger-column-tags">
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="project-ledger-column project-ledger-column-action">
            <ProjectLedgerAction project={project} />
          </div>
        </article>
      ))}
    </div>
  );
}
