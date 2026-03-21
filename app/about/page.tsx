import Link from "next/link";
import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

const quickOpen = [
  { label: "blog", href: "/blog/", note: "recent posts" },
  { label: "projects", href: "/projects/", note: "site code + repos" },
  { label: "nextmini", href: "/blog/series/nextmini/", note: "current series" },
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
                <h2 className="readme-heading">Focus</h2>
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
                <h2 className="readme-heading">Toolkit</h2>
                <div className="readme-group-list">
                  {site.skillGroups.map((group) => (
                    <section key={group.title} className="readme-group">
                      <h3 className="readme-group-title">{group.title}</h3>
                      <ul className="readme-tag-list">
                        {group.items.map((item) => (
                          <li key={item} className="readme-tag">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
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
          <PromptSection command="ls /personal-site/">
            <div className="readme-shortcuts">
              {quickOpen.map((entry) => (
                <Link key={entry.label} className="readme-shortcut-row" href={entry.href}>
                  <span className="readme-shortcut-label">{entry.label}</span>
                  <span className="readme-shortcut-link">{entry.href}</span>
                  <span className="readme-shortcut-note">{entry.note}</span>
                </Link>
              ))}
            </div>
          </PromptSection>

          <PromptSection command="cat ~/.contacts">
            <ul className="readme-link-list">
              <li className="readme-link-row">
                <span className="readme-link-label">github</span>
                <div className="readme-link-stack">
                  <a
                    className="terminal-inline-link readme-link-target"
                    href={site.github}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    XindanZhang
                  </a>
                  <span className="readme-link-meta">github.com/XindanZhang</span>
                </div>
              </li>
              <li className="readme-link-row">
                <span className="readme-link-label">email</span>
                <div className="readme-link-stack">
                  <a className="terminal-inline-link readme-link-target" href={site.email}>
                    xindan.zhang
                  </a>
                  <span className="readme-link-meta">mail.utoronto.ca</span>
                </div>
              </li>
            </ul>
          </PromptSection>
        </aside>
      </div>
    </SiteLayout>
  );
}
