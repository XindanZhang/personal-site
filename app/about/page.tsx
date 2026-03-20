import Link from "next/link";
import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export default function AboutPage() {
  return (
    <SiteLayout active="about">
      <div className="page-stack">
        <PromptSection command="cat /home/xindan/README">
          <h1 className="shell-heading">README</h1>
          <p className="shell-copy">{site.about.intro}</p>
          <p className="shell-copy">{site.about.body}</p>
        </PromptSection>

        <PromptSection command="ls /home/xindan/skills">
          <div className="practice-grid">
            {site.skillGroups.map((group) => (
              <div key={group.title} className="practice-card">
                <h2 className="practice-title">{group.title}</h2>
                <div className="practice-items">
                  {group.items.map((item) => (
                    <span key={item} className="practice-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PromptSection>

        <PromptSection command="history | tail -n 3">
          <div className="timeline-list">
            {site.timeline.map((entry) => (
              <div key={entry.year} className="timeline-entry">
                <span className="timeline-year">{entry.year}</span>
                <p className="shell-copy timeline-copy">{entry.detail}</p>
              </div>
            ))}
          </div>
        </PromptSection>

        <PromptSection command="links">
          <div className="elsewhere-links">
            <a className="button-link is-secondary" href={site.github} rel="noopener noreferrer" target="_blank">
              GitHub
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button-link is-secondary" href={site.email}>
              Email
              <span aria-hidden="true">↗</span>
            </a>
            <Link className="button-link is-secondary" href="/blog/">
              Journal
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button-link is-secondary" href="/blog/series/nextmini/">
              Nextmini series
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <p className="shell-copy">
            Read the <Link className="inline-link" href="/blog/">journal</Link> or browse the{" "}
            <Link className="inline-link" href="/projects/">
              projects
            </Link>{" "}
            page for the parts of the site that change most often.
          </p>
        </PromptSection>
      </div>
    </SiteLayout>
  );
}
