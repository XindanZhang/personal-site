import Link from "next/link";
import type { ProjectLink, ProjectStatus } from "../lib/site";

const statusStyles: Record<ProjectStatus, string> = {
  featured: "bg-[#177a45] text-white",
  active: "bg-[#177a45] text-white",
  archived: "bg-white text-black",
};

function ProjectAction({ project }: { project: ProjectLink }) {
  const className =
    "flex flex-1 items-center justify-center gap-1 px-4 py-2 font-mono text-sm transition-colors hover:bg-gray-100";

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
    <div className="group flex flex-col border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between border-b border-black px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-base font-bold">{project.name}</h3>
        </div>
        <span
          className={`inline-flex items-center justify-center border border-black px-2 py-0.5 font-mono text-xs uppercase tracking-widest shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] ${statusStyles[project.status]}`}
        >
          {project.status.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex-1 font-mono text-sm text-gray-600">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-black bg-gray-100 px-1.5 py-0.5 font-mono text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex border-t border-black">
        <ProjectAction project={project} />
      </div>
    </div>
  );
}
