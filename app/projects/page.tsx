import { ProjectCard } from "../../components/project-card";
import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { getProjectsByStatus } from "../../lib/site";

function ProjectGroup({
  command,
  copy,
  projects,
}: {
  command: string;
  copy: string;
  projects: ReturnType<typeof getProjectsByStatus>;
}) {
  return (
    <PromptSection command={command}>
      <p className="shell-copy">{copy}</p>
      <div className="project-grid desktop:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </PromptSection>
  );
}

export default function ProjectsPage() {
  return (
    <SiteLayout active="projects">
      <div className="page-stack">
        <PromptSection command="cat /workspace/projects/README">
          <h1 className="shell-heading">Projects</h1>
          <p className="shell-copy">
            Projects here are mostly notebook infrastructure: the archive itself, the threads it points to, and the
            public code that keeps the whole thing visible and maintainable.
          </p>
        </PromptSection>

        <ProjectGroup
          command="ls /workspace/projects/featured"
          copy="The clearest public work, chosen because it best represents how the site is actually used."
          projects={getProjectsByStatus("featured")}
        />

        <ProjectGroup
          command="ls /workspace/projects/active"
          copy="Things that are still moving: repositories, publishing infrastructure, and the site surface itself."
          projects={getProjectsByStatus("active")}
        />

        <ProjectGroup
          command="ls /workspace/projects/archive"
          copy="Older pieces that still explain the route here, even if they are no longer the center of the workflow."
          projects={getProjectsByStatus("archived")}
        />
      </div>
    </SiteLayout>
  );
}
