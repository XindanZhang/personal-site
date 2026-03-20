import Link from "next/link";
import { PostTable } from "../components/post-table";
import { PromptSection } from "../components/prompt-section";
import { SiteLayout } from "../components/site-layout";
import { getAllSeries, getFeaturedPosts } from "../lib/blog";
import { getProjectsByStatus, site } from "../lib/site";

const workspaceEntries = [
  {
    permissions: "drwxr-xr-x",
    owner: "xindan",
    group: "staff",
    size: "224",
    modifiedAt: "Mar 19 11:20",
    href: "/blog/",
    label: "journal/",
    note: site.home.blogSummary,
  },
  {
    permissions: "drwxr-xr-x",
    owner: "xindan",
    group: "staff",
    size: "160",
    modifiedAt: "Mar 19 11:24",
    href: "/projects/",
    label: "projects/",
    note: site.home.projectsSummary,
  },
  {
    permissions: "drwxr-xr-x",
    owner: "xindan",
    group: "staff",
    size: "128",
    modifiedAt: "Mar 19 11:28",
    href: "/friends/",
    label: "friends/",
    note: site.friendsIntro,
  },
  {
    permissions: "drwxr-xr-x",
    owner: "xindan",
    group: "staff",
    size: "128",
    modifiedAt: "Mar 19 11:31",
    href: "/about/",
    label: "about/",
    note: site.about.body,
  },
  {
    permissions: "-rw-r--r--",
    owner: "xindan",
    group: "staff",
    size: "1.1K",
    modifiedAt: "Mar 19 11:34",
    href: "/about/",
    label: "README.md",
    note: "Identity, working style, current threads, and where to reach me.",
  },
] as const;

export default function HomePage() {
  const featuredProject = getProjectsByStatus("featured")[0];
  const highlightedPosts = getFeaturedPosts();
  const nextminiSeries = getAllSeries().find((series) => series.slug === "nextmini");

  return (
    <SiteLayout active="home">
      <div className="terminal-dashboard">
        <div className="shell-columns">
          <div className="shell-column is-identity">
            <PromptSection
              caret
              className="shell-section is-identity"
              command="whoami"
              cwd="~"
              typeDelayMs={140}
              typeDurationMs={360}
              typed
            >
              <p className="terminal-readout">uid=1000(xindan) gid=1000(research) shell=/bin/zsh location=toronto</p>
              <h1 className="shell-heading">{site.home.heroTitle}</h1>
              <p className="shell-copy">{site.home.heroBody}</p>
              <p className="shell-copy">{site.home.body}</p>
              <p className="shell-copy shell-quote">{site.home.quote}</p>
            </PromptSection>

            <PromptSection
              className="shell-section is-status"
              command="cat /status/now.txt"
              cwd="~/workspace"
              typeDelayMs={1120}
              typeDurationMs={620}
              typed
            >
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

            {featuredProject || nextminiSeries ? (
              <PromptSection
                className="shell-section is-manifest"
                command="sed -n '1,4p' /workspace/projects/manifest.txt"
                cwd="~/workspace/projects"
                typeDelayMs={1480}
                typeDurationMs={720}
                typed
              >
                <div className="terminal-manifest">
                  {featuredProject ? (
                    <div className="terminal-manifest-row">
                      <p className="terminal-manifest-key">featured_project</p>
                      <p className="shell-copy">
                        <Link className="terminal-inline-link" href={featuredProject.href}>
                          {featuredProject.name}
                        </Link>{" "}
                        {featuredProject.description}
                      </p>
                    </div>
                  ) : null}
                  {nextminiSeries ? (
                    <div className="terminal-manifest-row">
                      <p className="terminal-manifest-key">active_series</p>
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
          </div>

          <div className="shell-column is-log">
            <PromptSection
              className="shell-section is-workspace"
              command="ls /workspace"
              cwd="~/workspace"
              typeDelayMs={420}
              typeDurationMs={520}
              typed
            >
              <div className="workspace-table">
                {workspaceEntries.map((entry) => (
                  <Link key={`${entry.permissions}-${entry.label}`} className="workspace-row" href={entry.href}>
                    <div className="workspace-meta">
                      <span className="workspace-permissions">{entry.permissions}</span>
                      <span className="workspace-size">{entry.size}</span>
                      <span className="workspace-date">{entry.modifiedAt}</span>
                    </div>
                    <div className="workspace-file">
                      <span className="workspace-name">{entry.label}</span>
                      <span className="workspace-note">{entry.note}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </PromptSection>

            <PromptSection
              className="shell-section is-feed"
              command="tail -n 5 /journal/index.log"
              cwd="~/journal"
              typeDelayMs={760}
              typeDurationMs={760}
              typed
            >
              <PostTable posts={highlightedPosts} />
            </PromptSection>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
