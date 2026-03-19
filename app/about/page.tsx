import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export default function AboutPage() {
  return (
    <SiteLayout active="about">
      <div className="page-stack">
        <section>
          <SectionHeading as="h1" eyebrow="Profile" title="About" />
          <div className="space-y-4">
            <p className="section-copy">{site.about.intro}</p>
            <p className="eyebrow-copy">{site.about.body}</p>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="Method" title="Practice" />
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
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="Years" title="Timeline" />
          <div className="timeline-list">
            {site.timeline.map((entry) => (
              <div key={entry.year} className="timeline-entry">
                <span className="timeline-year">{entry.year}</span>
                <p className="m-0 text-[1rem] leading-7 text-[var(--muted)]">{entry.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="Links" title="Elsewhere" />
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
        </section>

        <div className="surface-note">
          <p className="m-0">
            Read the <Link className="inline-link" href="/blog/">journal</Link> or browse the{" "}
            <Link className="inline-link" href="/projects/">
              projects
            </Link>{" "}
            page for the parts of the site that change most often.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
