import { ProjectLedger } from "../../components/project-ledger";
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
      <p className="section-lead">{copy}</p>
      <ProjectLedger projects={projects} />
    </PromptSection>
  );
}

export default function ProjectsPage() {
  const featuredProjects = getProjectsByStatus("featured");
  const activeProjects = getProjectsByStatus("active");
  const archivedProjects = getProjectsByStatus("archived");

  return (
    <SiteLayout active="projects">
      <div className="project-terminal">
        <aside className="project-terminal-summary">
          <PromptSection command="cat /workspace/projects/README">
            <h1 className="shell-heading">Projects</h1>
            <p className="shell-copy">
              This page collects the code behind the site: active experiments, public repos, and the tools I still use.
            </p>
          </PromptSection>

          <PromptSection command="printf '%s %s\n' featured active archived">
            <div className="terminal-manifest">
              <div className="terminal-manifest-row">
                <p className="terminal-manifest-key">featured</p>
                <p className="shell-copy">{featuredProjects.length} public thread(s) worth opening first.</p>
              </div>
              <div className="terminal-manifest-row">
                <p className="terminal-manifest-key">active</p>
                <p className="shell-copy">{activeProjects.length} repository or publishing surface(s) still moving.</p>
              </div>
              <div className="terminal-manifest-row">
                <p className="terminal-manifest-key">archive</p>
                <p className="shell-copy">{archivedProjects.length} older pieces kept for context.</p>
              </div>
            </div>
          </PromptSection>
        </aside>

        <div className="project-terminal-groups">
          <ProjectGroup
            command="ls /workspace/projects/featured"
            copy="The clearest public work, chosen because it best represents how the site is actually used."
            projects={featuredProjects}
          />

          <ProjectGroup
            command="ls /workspace/projects/active"
            copy="Things that are still moving: repositories, publishing infrastructure, and the site surface itself."
            projects={activeProjects}
          />

          <ProjectGroup
            command="ls /workspace/projects/archive"
            copy="Older pieces that still explain the route here, even if they are no longer the center of the workflow."
            projects={archivedProjects}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
