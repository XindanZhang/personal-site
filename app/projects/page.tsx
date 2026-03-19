import { ProjectCard } from "../../components/project-card";
import { SectionHeading } from "../../components/section-heading";
import { SiteLayout } from "../../components/site-layout";
import { getProjectsByStatus } from "../../lib/site";

function ProjectGroup({ title, projects }: { title: string; projects: ReturnType<typeof getProjectsByStatus> }) {
  return (
    <div className="space-y-4">
      <h2 className="font-mono text-sm font-bold uppercase tracking-wider">{title}</h2>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <SiteLayout active="projects">
      <div className="space-y-6">
        <section>
          <SectionHeading as="h1" title="Projects" />
          <p className="font-mono text-sm">
            Pages, notes, and repositories that are actively tied to this site.
          </p>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />
        <ProjectGroup projects={getProjectsByStatus("featured")} title="Featured" />

        <hr className="my-4 w-full border-0 border-t border-black" />
        <ProjectGroup projects={getProjectsByStatus("active")} title="Active" />

        <hr className="my-4 w-full border-0 border-t border-black" />
        <ProjectGroup projects={getProjectsByStatus("archived")} title="Archived" />
      </div>
    </SiteLayout>
  );
}
