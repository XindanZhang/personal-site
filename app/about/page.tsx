import { ArrowRight, ArrowUpRight, Github, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CopyEmailButton } from "../../components/copy-email-button";
import { Reveal } from "../../components/reveal";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

const principles = [
  {
    label: "Focus",
    value: "Networking, protocol behavior, small systems experiments, and terminal-heavy workflows.",
  },
  {
    label: "Method",
    value: "Trace first, rerun with fewer assumptions, then preserve only the commands and details that still matter.",
  },
  {
    label: "Publishing",
    value: "Concrete enough to reproduce, concise enough to scan, and honest about where each investigation began.",
  },
] as const;

export const metadata = {
  title: "About",
  description: "About Xindan Zhang, a systems-focused builder and writer in Toronto.",
};

export default function AboutPage() {
  const emailAddress = site.email.replace(/^mailto:/, "");

  return (
    <SiteLayout active="about">
      <section className="page-intro about-intro">
        <p className="section-index">About / Xindan Zhang</p>
        <h1>I make technical behavior easier to see and revisit.</h1>
        <p>{site.about.intro}</p>
      </section>

      <Reveal as="section" className="about-profile" aria-labelledby="about-profile-title">
        <div className="about-visual">
          <Image
            src={`${site.basePath}/network-field.webp`}
            alt="Layered glass network paths representing observable systems"
            fill
            sizes="(max-width: 768px) 100vw, 44vw"
          />
          <div className="about-visual-caption glass-surface">
            <span>Working from</span>
            <strong>Toronto, Canada</strong>
          </div>
        </div>
        <div className="about-copy">
          <p className="mono-label">Public notebook / working practice</p>
          <h2 id="about-profile-title">From a trace to a durable note.</h2>
          <p>{site.about.body}</p>
          <div className="principle-list">
            {principles.map((principle, index) => (
              <div key={principle.label} className="principle-row">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{principle.label}</h3>
                  <p>{principle.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="toolkit-section" delay={60} aria-labelledby="toolkit-title">
        <header className="section-header">
          <div>
            <p className="section-index">Toolkit / What I reach for</p>
            <h2 id="toolkit-title">A practical systems stack.</h2>
          </div>
          <p>Tools change. The workflow stays grounded in inspection, small experiments, and reproducible notes.</p>
        </header>
        <div className="toolkit-grid">
          {site.skillGroups.map((group, index) => (
            <section key={group.title} className="toolkit-group">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="timeline-section" delay={90} aria-labelledby="timeline-title">
        <header className="section-header is-inline">
          <div>
            <p className="section-index">Log / Recent years</p>
            <h2 id="timeline-title">The notebook so far.</h2>
          </div>
          <Link className="text-link" href="/blog/">
            Open the archive <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </header>
        <div className="timeline-list">
          {site.timeline.map((entry) => (
            <div key={entry.year} className="timeline-entry">
              <time>{entry.year}</time>
              <p>{entry.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="contact-section glass-surface" delay={120} aria-labelledby="contact-title">
        <div>
          <p className="section-index">Contact / Open channel</p>
          <h2 id="contact-title">Have a thoughtful systems problem?</h2>
          <p>{site.availability}. The fastest route is email.</p>
        </div>
        <div className="contact-actions">
          <a className="action-button is-primary" href={site.email}>
            <Mail aria-hidden="true" size={17} /> Email Xindan
          </a>
          <CopyEmailButton email={emailAddress} />
          <a className="icon-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
            <Github aria-hidden="true" size={18} />
          </a>
          <a className="text-link" href={site.source} target="_blank" rel="noopener noreferrer">
            Site source <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </Reveal>
    </SiteLayout>
  );
}
