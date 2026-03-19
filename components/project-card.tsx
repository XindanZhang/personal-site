import Link from "next/link";
import type { ProjectLink, ProjectStatus } from "../lib/site";

const statusLabels: Record<ProjectStatus, string> = {
  featured: "Selected",
  active: "In progress",
  archived: "Past",
};

function ProjectAction({ project }: { project: ProjectLink }) {
  const className = "project-action";

  if (project.external) {
    return (
      <a className={className} href={project.href} rel="noopener noreferrer" target="_blank">
        <span>{project.hrefLabel}</span>
        <span>→</span>
      </a>
    );
  }

  return (
    <Link className={className} href={project.href}>
      <span>{project.hrefLabel}</span>
      <span>→</span>
    </Link>
  );
}

export function ProjectCard({ project }: { project: ProjectLink }) {
  return (
    <article className="project-card">
      <div className="project-card-head">
        <span className={`project-status status-${project.status}`}>
          {statusLabels[project.status]}
        </span>
        <h3 className="project-title">{project.name}</h3>
      </div>

      <div className="project-card-body">
        <p className="project-summary">{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="project-card-foot">
        <ProjectAction project={project} />
      </div>
    </article>
  );
}
