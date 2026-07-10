import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProjectLedger } from "../../components/project-ledger";
import { Reveal } from "../../components/reveal";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export const metadata = {
  title: "Work",
  description: "Selected networking research, systems writing, and tools by Xindan Zhang.",
};

export default function ProjectsPage() {
  const [featuredProject, ...otherProjects] = site.projects;

  return (
    <SiteLayout active="projects">
      <section className="page-intro work-intro">
        <p className="section-index">Work / Selected systems</p>
        <h1>Small systems, inspected closely.</h1>
        <p>
          Network experiments, public research notes, and publishing tools shaped around one principle: make behavior
          observable before making it elegant.
        </p>
      </section>

      <Reveal as="section" className="featured-project" aria-labelledby="featured-work-title">
        <div className="featured-project-media">
          <Image
            src={`${site.basePath}/network-field.webp`}
            alt="Transparent network paths visualizing signals moving through a system"
            fill
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          <div className="media-hud glass-surface">
            <span>Series status</span>
            <strong>4 notes / ongoing</strong>
          </div>
        </div>
        <div className="featured-project-copy">
          <p className="mono-label">Featured research thread</p>
          <h2 id="featured-work-title">{featuredProject.name}</h2>
          <p>{featuredProject.description}</p>
          <dl className="project-facts">
            <div>
              <dt>Focus</dt>
              <dd>Controller interfaces, conductor paths, and lossless behavior</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>Trace the implementation, rerun the experiment, preserve the useful detail</dd>
            </div>
          </dl>
          <div className="project-actions">
            <Link className="action-button is-primary" href={featuredProject.href}>
              {featuredProject.hrefLabel} <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">
              Nextmini.org <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="work-index" delay={80} aria-labelledby="work-index-title">
        <header className="section-header">
          <div>
            <p className="section-index">Index / Active and archived</p>
            <h2 id="work-index-title">More work</h2>
          </div>
          <p>Writing infrastructure, this site’s source, and the older build notes that document how it evolved.</p>
        </header>
        <ProjectLedger projects={otherProjects} />
      </Reveal>
    </SiteLayout>
  );
}
