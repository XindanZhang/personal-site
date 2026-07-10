import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ProjectLink, ProjectStatus } from "../lib/site";
import { PointerGlow } from "./pointer-glow";

const statusLabels: Record<ProjectStatus, string> = {
  featured: "Featured",
  active: "Active",
  archived: "Archive",
};

function ProjectAction({ project }: { project: ProjectLink }) {
  const content = (
    <>
      {project.hrefLabel}
      {project.external ? (
        <ArrowUpRight aria-hidden="true" size={16} />
      ) : (
        <ArrowRight aria-hidden="true" size={16} />
      )}
    </>
  );

  if (project.external) {
    return (
      <a className="project-ledger-action" href={project.href} rel="noopener noreferrer" target="_blank">
        {content}
      </a>
    );
  }

  return (
    <Link className="project-ledger-action" href={project.href}>
      {content}
    </Link>
  );
}

export function ProjectLedger({ projects }: { projects: ProjectLink[] }) {
  return (
    <div className="project-ledger">
      {projects.map((project, index) => (
        <PointerGlow key={project.name} as="article" className="project-ledger-row pointer-glow">
          <div className="project-ledger-index">{String(index + 1).padStart(2, "0")}</div>
          <div className="project-ledger-main">
            <div className="project-ledger-heading">
              <span className={`project-status status-${project.status}`}>{statusLabels[project.status]}</span>
              <h3>{project.name}</h3>
            </div>
            <p>{project.description}</p>
            <div className="project-tags" aria-label="Project technologies">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <ProjectAction project={project} />
        </PointerGlow>
      ))}
    </div>
  );
}
