import { ProjectCard } from "../../components/project-card";
import { SectionHeading } from "../../components/section-heading";
import { SiteLayout } from "../../components/site-layout";
import { getProjectsByStatus } from "../../lib/site";

function ProjectGroup({
  title,
  eyebrow,
  copy,
  projects,
}: {
  title: string;
  eyebrow: string;
  copy: string;
  projects: ReturnType<typeof getProjectsByStatus>;
}) {
  return (
    <section className="stack-section">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <p className="section-copy">{copy}</p>
      <div className="project-grid desktop:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <SiteLayout active="projects">
      <div className="page-stack">
        <section>
          <SectionHeading as="h1" eyebrow="Desk" title="Projects" />
          <p className="section-copy">
            Projects here are mostly notebook infrastructure: the archive itself, the threads it points to, and the
            public code that keeps the whole thing visible and maintainable.
          </p>
        </section>

        <ProjectGroup
          copy="The clearest public work, chosen because it best represents how the site is actually used."
          eyebrow="Shelf One"
          projects={getProjectsByStatus("featured")}
          title="Selected work"
        />

        <ProjectGroup
          copy="Things that are still moving: repositories, publishing infrastructure, and the site surface itself."
          eyebrow="Shelf Two"
          projects={getProjectsByStatus("active")}
          title="In progress"
        />

        <ProjectGroup
          copy="Older pieces that still explain the route here, even if they are no longer the center of the workflow."
          eyebrow="Shelf Three"
          projects={getProjectsByStatus("archived")}
          title="Past shelves"
        />
      </div>
    </SiteLayout>
  );
}
