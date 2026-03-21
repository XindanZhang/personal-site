import Link from "next/link";
import { PromptSection } from "../components/prompt-section";
import { SiteLayout } from "../components/site-layout";
import { formatShortDate, getFeaturedPosts } from "../lib/blog";
import { site } from "../lib/site";

const identityRows = [
  { key: "name", value: "Cindy" },
  { key: "focus", value: "networking / systems / tooling" },
  { key: "shell", value: "zsh + tmux + ssh" },
  { key: "mode", value: "write it down after it works" },
] as const;

const currentThreads = [
  { key: "now", value: "nextmini dataplane" },
  { key: "keep", value: "remote shell notes" },
  { key: "ship", value: "repeatable setup logs" },
] as const;

const workspaceEntries = [
  { href: "/blog/", label: "blog/", note: "logs" },
  { href: "/projects/", label: "projects/", note: "builds" },
  { href: "/friends/", label: "friends/", note: "ring" },
  { href: "/about/", label: "about/", note: "profile" },
  { href: "/about/", label: "README.md", note: "index" },
] as const;

export default function HomePage() {
  const highlightedPosts = getFeaturedPosts().slice(0, 4);

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
              <div className="identity-grid">
                {identityRows.map((row) => (
                  <div key={row.key} className="identity-row">
                    <span className="identity-key">{row.key}</span>
                    <span className="identity-value">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="shell-motd">notes, fixes, and traces I want to find again later.</p>
            </PromptSection>

            <PromptSection
              className="shell-section is-status"
              command="cat ~/.plan"
              cwd="~"
              typeDelayMs={1120}
              typeDurationMs={420}
              typed
            >
              <div className="signal-list">
                {currentThreads.map((thread) => (
                  <div key={thread.key} className="signal-row">
                    <span className="signal-key">{thread.key}</span>
                    <span className="signal-value">{thread.value}</span>
                  </div>
                ))}
              </div>
              <div className="contact-strip">
                <p className="availability-note">{site.availability}</p>
                <p className="contact-line">
                  <span className="contact-key">email</span>
                  <a className="terminal-inline-link" href={site.email}>
                    xindan.zhang@mail.utoronto.ca
                  </a>
                </p>
                <p className="contact-line">
                  <span className="contact-key">github</span>
                  <a className="terminal-inline-link" href={site.github} rel="noopener noreferrer" target="_blank">
                    XindanZhang
                  </a>
                </p>
              </div>
            </PromptSection>
          </div>

          <div className="shell-column is-log">
            <PromptSection
              className="shell-section is-workspace"
              command="tree -L 1 /workspace"
              cwd="~/workspace"
              typeDelayMs={420}
              typeDurationMs={520}
              typed
            >
              <div className="workspace-tree">
                {workspaceEntries.map((entry) => (
                  <Link key={entry.label} className="workspace-tree-row" href={entry.href}>
                    <span className="workspace-tree-target">
                      <span className="workspace-tree-name">{entry.label}</span>
                      <span className="workspace-tree-tag">{entry.note}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </PromptSection>

            <PromptSection
              className="shell-section is-feed"
              command="tail -n 4 /blog/head.log"
              cwd="~/blog"
              typeDelayMs={760}
              typeDurationMs={760}
              typed
            >
              <div className="journal-headlines">
                {highlightedPosts.map((post) => (
                  <Link key={post.slug} className="journal-headline-row" href={`/blog/${post.slug}/`}>
                    <span className="journal-headline-date">{formatShortDate(post.publishedAt)}</span>
                    <span className="journal-headline-title">{post.title}</span>
                    <span className="journal-headline-label">{post.categoryLabel}</span>
                  </Link>
                ))}
              </div>
            </PromptSection>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
