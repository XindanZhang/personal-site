import { ArrowRight, ArrowUpRight, Github, Mail } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CopyEmailButton } from "~/components/copy-email-button";
import { Reveal } from "~/components/reveal";
import { site } from "~/lib/site";

const principles = [
  { label: "Focus", value: "Networking, protocol behavior, small systems experiments, and tools that make those systems observable." },
  { label: "Method", value: "Trace first, rerun with fewer assumptions, then preserve only the details that still matter." },
  { label: "Publishing", value: "Concrete enough to reproduce, concise enough to scan, and honest about where the investigation began." },
] as const;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Xindan Zhang" },
      { name: "description", content: "PhD student in Electrical and Computer Engineering at the University of Toronto." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const emailAddress = site.email.replace(/^mailto:/, "");
  return (
    <>
      <section className="page-intro about-intro">
        <p className="section-kicker">About</p>
        <div className="page-intro-grid"><h1>PhD student in ECE at the University of Toronto.</h1><p>{site.about.intro}</p></div>
      </section>

      <Reveal as="section" className="about-practice" aria-labelledby="profile-title">
        <header className="about-practice-header"><div><p className="section-kicker">Working practice</p><h2 id="profile-title">From a trace to a reusable result.</h2></div><p>{site.about.body}</p></header>
        <div className="about-principles">{principles.map((principle) => <article key={principle.label}><span>{principle.label}</span><p>{principle.value}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="about-capabilities" delay={60} aria-labelledby="toolkit-title">
        <header className="section-intro"><div><p className="section-kicker">Capabilities</p><h2 id="toolkit-title">A practical systems stack.</h2></div><p>Tools change. The workflow stays grounded in inspection, small experiments, and reproducible notes.</p></header>
        <div className="capability-map">{site.skillGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="about-timeline" delay={90} aria-labelledby="timeline-title">
        <header className="section-intro"><div><p className="section-kicker">Timeline</p><h2 id="timeline-title">The notebook so far.</h2></div><Link className="text-link" to="/blog/">Open archive <ArrowRight aria-hidden="true" size={14} /></Link></header>
        <div className="about-milestones">{site.timeline.map((entry) => <article key={entry.year}><time>{entry.year}</time><p>{entry.detail}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="contact-section" delay={110} aria-labelledby="contact-title">
        <div><p className="section-kicker">Contact</p><h2 id="contact-title">Have a thoughtful systems problem?</h2><p>Email is the best way to reach me.</p></div>
        <div className="contact-actions"><a className="action-link is-primary" href={site.email}><Mail aria-hidden="true" size={17} /> Email</a><CopyEmailButton email={emailAddress} /><a className="icon-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub"><Github aria-hidden="true" size={18} /></a><a className="text-link" href={site.source} target="_blank" rel="noopener noreferrer">Site source <ArrowUpRight aria-hidden="true" size={14} /></a></div>
      </Reveal>
    </>
  );
}
