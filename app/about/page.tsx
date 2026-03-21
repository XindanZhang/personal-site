import Link from "next/link";
import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

const readmeSections = [
  { line: "12", heading: "## focus", note: "what I work on and how I like to debug" },
  { line: "24", heading: "## toolkit", note: "languages, topics, and publishing stack" },
  { line: "39", heading: "## history", note: "how this notebook has changed over time" },
  { line: "52", heading: "## links", note: "where to reach me and what to open next" },
] as const;

const readmeFacts = [
  {
    label: "focus",
    value: "networking, protocol behavior, small systems experiments, and terminal-heavy workflows",
  },
  {
    label: "method",
    value: "trace first, rerun with fewer assumptions, then write down only the commands that still matter",
  },
  {
    label: "stack",
    value: "next.js, tailwind css, markdown content, and static export for github pages",
  },
  {
    label: "status",
    value: site.availability,
  },
] as const;

export default function AboutPage() {
  return (
    <SiteLayout active="about">
      <div className="manpage-layout">
        <div className="manpage-main">
          <PromptSection command="sed -n '1,160p' README.md">
            <article className="readme-sheet">
              <section className="readme-section">
                <p className="readme-kicker"># README.md</p>
                <h1 className="shell-heading">Cindy</h1>
                <p className="shell-copy">{site.about.intro}</p>
                <p className="shell-copy">{site.about.body}</p>
              </section>

              <section className="readme-section">
                <h2 className="readme-heading">focus</h2>
                <div className="readme-grid">
                  {readmeFacts.map((fact) => (
                    <dl key={fact.label} className="readme-kv">
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </dl>
                  ))}
                </div>
              </section>

              <section className="readme-section">
                <h2 className="readme-heading">toolkit</h2>
                <div className="readme-grid">
                  {site.skillGroups.map((group) => (
                    <dl key={group.title} className="readme-kv">
                      <dt>{group.title}</dt>
                      <dd>{group.items.join(" / ")}</dd>
                    </dl>
                  ))}
                </div>
              </section>
            </article>
          </PromptSection>

          <PromptSection command="tail -n 6 ~/.local/share/site.history">
            <div className="timeline-list">
              {site.timeline.map((entry) => (
                <div key={entry.year} className="timeline-entry">
                  <span className="timeline-year">{entry.year}</span>
                  <p className="shell-copy timeline-copy">{entry.detail}</p>
                </div>
              ))}
            </div>
          </PromptSection>
        </div>

        <aside className="manpage-sidebar">
          <PromptSection command="grep -n '^##' README.md">
            <div className="readme-outline">
              {readmeSections.map((section) => (
                <div key={section.heading} className="readme-outline-row">
                  <span className="readme-outline-line">{section.line}</span>
                  <span className="readme-outline-heading">{section.heading}</span>
                  <span className="readme-outline-note">{section.note}</span>
                </div>
              ))}
            </div>
          </PromptSection>

          <PromptSection command="printf '%s\\n' github email journal nextmini">
            <ul className="readme-link-list">
              <li className="readme-link-row">
                <span className="readme-link-label">github</span>
                <a
                  className="terminal-inline-link readme-link-target"
                  href={site.github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  XindanZhang
                </a>
                <span className="readme-link-meta">github.com/XindanZhang</span>
              </li>
              <li className="readme-link-row">
                <span className="readme-link-label">email</span>
                <a className="terminal-inline-link readme-link-target" href={site.email}>
                  xindan.zhang
                </a>
                <span className="readme-link-meta">mail.utoronto.ca</span>
              </li>
              <li className="readme-link-row">
                <span className="readme-link-label">journal</span>
                <Link className="terminal-inline-link readme-link-target" href="/blog/">
                  /blog/
                </Link>
                <span className="readme-link-meta">recent logs and writeups</span>
              </li>
              <li className="readme-link-row">
                <span className="readme-link-label">nextmini</span>
                <Link className="terminal-inline-link readme-link-target" href="/blog/series/nextmini/">
                  nextmini series
                </Link>
                <span className="readme-link-meta">/blog/series/nextmini/</span>
              </li>
            </ul>
            <p className="shell-copy">
              Read the <Link className="inline-link" href="/blog/">journal</Link> or browse the{" "}
              <Link className="inline-link" href="/projects/">
                projects
              </Link>{" "}
              page for the parts of the site that change most often.
            </p>
          </PromptSection>
        </aside>
      </div>
    </SiteLayout>
  );
}
