import { ArrowRight, ArrowUpRight, BookOpen, Mail } from "lucide-react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { PostLink } from "~/components/post-link";
import { Reveal } from "~/components/reveal";
import { formatMediumDate, getAllPosts, getSeriesBySlug } from "~/lib/blog";
import { site } from "~/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xindan Zhang | Systems, networks, and field notes" },
      { name: "description", content: site.description },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const nextmini = getSeriesBySlug("nextmini");

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-terminal-bar">
          <span>SESSION 01</span><span>TTY / PORTFOLIO</span><span className="hero-terminal-state">CONNECTED</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="command-line hero-command"><span>xindan@toronto:~$</span> whoami<span className="block-cursor" aria-hidden="true" /></p>
            <p className="hero-kicker">NETWORK SYSTEMS / TOOLING / FIELD NOTES</p>
            <h1 id="home-title">Xindan Zhang <small>also Cindy</small></h1>
            <p className="hero-lede">{site.home.heroTitle}</p>
            <div className="hero-actions">
              <Link className="command-button is-primary" to="/projects/">Open work index <ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="command-button" to="/blog/">Read logs <BookOpen aria-hidden="true" size={16} /></Link>
              <a className="icon-button hero-email" href={site.email} aria-label="Email Xindan" title="Email Xindan"><Mail aria-hidden="true" size={18} /></a>
            </div>
          </div>

          <div className="system-monitor" aria-label="Current profile details">
            <div className="monitor-header"><span>WHOAMI.OUT</span><span>8.4 KB</span></div>
            <dl>
              <div><dt>USER</dt><dd>XINDAN_ZHANG</dd></div>
              <div><dt>ALIAS</dt><dd>CINDY</dd></div>
              <div><dt>NODE</dt><dd>TORONTO_CA</dd></div>
              <div><dt>FOCUS</dt><dd>NETWORK_SYSTEMS</dd></div>
              <div><dt>ACTIVE</dt><dd>NEXTMINI</dd></div>
              <div><dt>STATUS</dt><dd><i className="live-dot" aria-hidden="true" /> OPEN_TO_COLLABORATE</dd></div>
            </dl>
            <div className="signal-map" aria-label="A compact network path from terminal to controller to data plane">
              <span>TTY</span><i /><span>CTRL</span><i /><span>DATA</span><i /><span>TRACE</span>
            </div>
          </div>
        </div>
        <div className="hero-status-rail">
          <span><b>STATUS</b> {site.availability}</span><span><b>LOCAL</b> Toronto, Canada</span><span><b>NOW</b> Nextmini internals</span>
        </div>
      </section>

      <Reveal as="section" className="home-section current-thread" aria-labelledby="thread-title">
        <header className="section-heading">
          <div><p className="command-line"><span>$</span> ls ./research/nextmini</p><h2 id="thread-title">Current thread</h2></div>
          <p>A four-part field guide from controller surface to packet behavior, with the implementation details left intact.</p>
        </header>
        <div className="thread-layout">
          <div className="thread-readme">
            <span>README / NEXTMINI</span>
            <blockquote>{site.home.quote}</blockquote>
            <a className="text-link" href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">Project site <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
          <ol className="thread-files">
            {nextmini?.posts.map((post, index) => (
              <li key={post.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <PostLink slug={post.slug}><strong>{post.title}</strong><small>{post.summary}</small></PostLink>
                <ArrowRight aria-hidden="true" size={16} />
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal as="section" className="home-section recent-logs" delay={60} aria-labelledby="logs-title">
        <header className="section-heading compact">
          <div><p className="command-line"><span>$</span> tail -n 3 ./writing.log</p><h2 id="logs-title">Recent logs</h2></div>
          <Link className="text-link" to="/blog/">All writing <ArrowRight aria-hidden="true" size={14} /></Link>
        </header>
        <div className="home-log-list">
          {recentPosts.map((post, index) => (
            <article key={post.slug} className="home-log-row">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time>
              <div><small>{post.categoryLabel}</small><h3><PostLink slug={post.slug}>{post.title}</PostLink></h3><p>{post.summary}</p></div>
              <ArrowUpRight aria-hidden="true" size={17} />
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" className="home-section stack-section" delay={100} aria-labelledby="stack-title">
        <div className="stack-copy"><p className="command-line"><span>$</span> inspect --practice</p><h2 id="stack-title">Built around observable behavior.</h2><p>{site.home.heroBody}</p><Link className="command-button" to="/about/">More about me <ArrowRight aria-hidden="true" size={15} /></Link></div>
        <div className="stack-directory">
          {site.skillGroups.map((group, index) => <div key={group.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.title}</strong><p>{group.items.join(" / ")}</p></div>)}
        </div>
      </Reveal>
    </>
  );
}
