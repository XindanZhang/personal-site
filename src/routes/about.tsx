import { ArrowRight, ArrowUpRight, Github, Mail } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CopyEmailButton } from "~/components/copy-email-button";
import { Reveal } from "~/components/reveal";
import { site } from "~/lib/site";

const principles = [
  { label: "Focus", value: "Networked systems, protocol behavior, and the tools required to observe both precisely." },
  { label: "Method", value: "Read the source, collect the trace, isolate the behavior, and test the explanation." },
  { label: "Writing", value: "State only what the evidence supports, preserve enough detail to reproduce the result, and make the limits explicit." },
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
        <div className="page-intro-grid"><h1>PhD student in Electrical and Computer Engineering at the University of Toronto.</h1><p>{site.about.intro}</p></div>
      </section>

      <Reveal as="section" className="about-practice" aria-labelledby="profile-title">
        <header className="about-practice-header"><div><p className="section-kicker">Research practice</p><h2 id="profile-title">Evidence first. Explanation second.</h2></div><p>{site.about.body}</p></header>
        <div className="about-principles">{principles.map((principle) => <article key={principle.label}><span>{principle.label}</span><p>{principle.value}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="about-capabilities" delay={60} aria-labelledby="toolkit-title">
        <header className="section-intro"><div><p className="section-kicker">Capabilities</p><h2 id="toolkit-title">Tools for systems research.</h2></div><p>The stack changes with the question; the method remains grounded in source code, instrumentation, and controlled experiments.</p></header>
        <div className="capability-map">{site.skillGroups.map((group) => <article key={group.title}><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="about-timeline" delay={90} aria-labelledby="timeline-title">
        <header className="section-intro"><div><p className="section-kicker">Timeline</p><h2 id="timeline-title">Selected milestones.</h2></div><Link className="text-link" to="/blog/">View all blogs <ArrowRight aria-hidden="true" size={14} /></Link></header>
        <div className="about-milestones">{site.timeline.map((entry) => <article key={entry.year}><time>{entry.year}</time><p>{entry.detail}</p></article>)}</div>
      </Reveal>

      <Reveal as="section" className="contact-section" delay={110} aria-labelledby="contact-title">
        <div><p className="section-kicker">Contact</p><h2 id="contact-title">Open to questions, collaborations, and research conversations.</h2><p>Email is the most reliable way to reach me.</p></div>
        <div className="contact-actions"><a className="action-link is-primary" href={site.email}><Mail aria-hidden="true" size={17} /> Email</a><CopyEmailButton email={emailAddress} /><a className="icon-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" title="GitHub"><Github aria-hidden="true" size={18} /></a><a className="text-link" href={site.source} target="_blank" rel="noopener noreferrer">Site source <ArrowUpRight aria-hidden="true" size={14} /></a></div>
      </Reveal>
    </>
  );
}
