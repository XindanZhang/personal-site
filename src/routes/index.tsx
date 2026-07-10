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
      <section className="profile-session" aria-labelledby="home-title">
        <div className="session-command"><span>xindan@toronto:~$</span> profile --brief</div>
        <div className="profile-copy">
          <h1 id="home-title">Xindan Zhang <span>/ Cindy</span></h1>
          <p className="terminal-role">network_systems :: tooling :: field_notes</p>
          <p className="terminal-lede">{site.home.heroTitle}</p>
          <div className="inline-status">
            <span><b>STATE</b> OPEN_TO_COLLABORATE</span>
            <span><b>NODE</b> TORONTO_CA</span>
            <span><b>ACTIVE</b> NEXTMINI</span>
          </div>
          <div className="terminal-actions">
            <Link className="terminal-action is-primary" to="/projects/">[01] ./work <ArrowRight aria-hidden="true" size={14} /></Link>
            <Link className="terminal-action" to="/blog/"><BookOpen aria-hidden="true" size={14} /> [02] cat notes.log</Link>
            <a className="terminal-action" href={site.email}><Mail aria-hidden="true" size={14} /> [03] mail</a>
          </div>
        </div>
        <div className="boot-log" aria-label="Session startup status">
          <span><b>[ OK ]</b> profile mounted</span>
          <span><b>[ OK ]</b> network trace ready</span>
          <span><b>[ OK ]</b> notes indexed</span>
        </div>
      </section>

      <Reveal as="section" className="home-console-grid" aria-label="Current work and recent writing">
        <section className="console-pane" aria-labelledby="logs-title">
          <header className="console-title">
            <span id="logs-title">tail -n 3 ~/writing.log</span>
            <Link to="/blog/">OPEN ALL</Link>
          </header>
          <div className="compact-log-list">
            {recentPosts.map((post, index) => (
              <article key={post.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p><time dateTime={post.publishedAt}>{formatMediumDate(post.publishedAt)}</time> / {post.categoryLabel}</p>
                  <h2><PostLink slug={post.slug}>{post.title}</PostLink></h2>
                  <small>{post.summary}</small>
                </div>
                <ArrowUpRight aria-hidden="true" size={14} />
              </article>
            ))}
          </div>
        </section>

        <section className="console-pane" aria-labelledby="thread-title">
          <header className="console-title">
            <span id="thread-title">tree ~/research/nextmini</span>
            <span><i className="live-dot" aria-hidden="true" /> RUNNING</span>
          </header>
          <div className="console-intro">
            <p>{site.home.quote}</p>
            <a href="https://nextmini.org/" target="_blank" rel="noopener noreferrer">nextmini.org <ArrowUpRight aria-hidden="true" size={12} /></a>
          </div>
          <ol className="process-list">
            {nextmini?.posts.map((post, index) => (
              <li key={post.slug}>
                <span>{index === (nextmini.posts.length - 1) ? "└─" : "├─"}</span>
                <PostLink slug={post.slug}><strong>{post.title}.md</strong><small>{post.summary}</small></PostLink>
                <ArrowRight aria-hidden="true" size={13} />
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      <Reveal as="section" className="home-stack" delay={70} aria-labelledby="stack-title">
        <header className="console-title"><span id="stack-title">inspect --practice</span><span>04 GROUPS</span></header>
        <div className="stack-summary">
          <div><h2>Built around observable behavior.</h2><p>{site.home.heroBody}</p><Link className="terminal-action" to="/about/">./about <ArrowRight aria-hidden="true" size={13} /></Link></div>
          <div className="stack-directory">
            {site.skillGroups.map((group, index) => <div key={group.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{group.title}</strong><p>{group.items.join(" / ")}</p></div>)}
          </div>
        </div>
      </Reveal>

      <div className="active-prompt" aria-label="Terminal ready">
        <span>xindan@toronto:~$</span><i className="prompt-cursor" aria-hidden="true" />
      </div>
    </>
  );
}
