import Link from "next/link";
import { PostTable } from "../components/post-table";
import { PromptSection } from "../components/prompt-section";
import { ProjectCard } from "../components/project-card";
import { SiteLayout } from "../components/site-layout";
import { getAllSeries, getFeaturedPosts } from "../lib/blog";
import { getProjectsByStatus, site } from "../lib/site";

export default function HomePage() {
  const featuredProject = getProjectsByStatus("featured")[0];
  const highlightedPosts = getFeaturedPosts();
  const nextminiSeries = getAllSeries().find((series) => series.slug === "nextmini");

  return (
    <SiteLayout active="home">
      <div className="terminal-home">
        <PromptSection caret command="whoami" typeDelayMs={140} typeDurationMs={360} typed>
          <h1 className="shell-heading">{site.home.heroTitle}</h1>
          <p className="shell-copy">{site.home.heroBody}</p>
          <p className="shell-copy">{site.home.body}</p>
          <p className="shell-copy shell-quote">{site.home.quote}</p>
        </PromptSection>

        <PromptSection command="ls /workspace" typeDelayMs={420} typeDurationMs={520} typed>
          <div className="directory-grid">
            <Link className="directory-entry" href="/blog/">
              <span className="directory-name">journal/</span>
              <span className="directory-note">{site.home.blogSummary}</span>
            </Link>
            <Link className="directory-entry" href="/projects/">
              <span className="directory-name">projects/</span>
              <span className="directory-note">{site.home.projectsSummary}</span>
            </Link>
            <Link className="directory-entry" href="/friends/">
              <span className="directory-name">friends/</span>
              <span className="directory-note">{site.friendsIntro}</span>
            </Link>
            <Link className="directory-entry" href="/about/">
              <span className="directory-name">about/</span>
              <span className="directory-note">{site.about.body}</span>
            </Link>
          </div>
        </PromptSection>

        <PromptSection command="tail -n 5 /journal/index.log" typeDelayMs={760} typeDurationMs={760} typed>
          <PostTable posts={highlightedPosts} />
        </PromptSection>

        {featuredProject || nextminiSeries ? (
          <PromptSection command="ls /workspace/projects" typeDelayMs={1120} typeDurationMs={720} typed>
            <div className="shell-grid">
              {featuredProject ? <ProjectCard project={featuredProject} /> : null}
              {nextminiSeries ? (
                <div className="support-card">
                  <p className="support-label">series</p>
                  <p className="shell-copy">
                    {nextminiSeries.name} spans {nextminiSeries.posts.length} connected notes from the overview to
                    controller internals and runtime behavior.
                  </p>
                  <Link className="terminal-inline-link" href={`/blog/series/${nextminiSeries.slug}/`}>
                    open /blog/series/{nextminiSeries.slug}
                  </Link>
                </div>
              ) : null}
            </div>
          </PromptSection>
        ) : null}

        <PromptSection command="cat /status/now.txt" typeDelayMs={1480} typeDurationMs={620} typed>
          <ul className="terminal-note-list">
            {site.home.sideNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="availability-note">{site.availability}</p>
          <p className="shell-copy">
            email=
            <a className="terminal-inline-link" href={site.email}>
              xindan.zhang@mail.utoronto.ca
            </a>{" "}
            github=
            <a className="terminal-inline-link" href={site.github} rel="noopener noreferrer" target="_blank">
              XindanZhang
            </a>
          </p>
        </PromptSection>
      </div>
    </SiteLayout>
  );
}
