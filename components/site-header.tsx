import Link from "next/link";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const links = [
    { key: "home", target: "./", note: "home", href: "/" },
    { key: "blog", target: "./journal/", note: "logs", href: "/blog/" },
    { key: "projects", target: "./projects/", note: "builds", href: "/projects/" },
    { key: "friends", target: "./links/", note: "ring", href: "/friends/" },
    { key: "about", target: "./README.md", note: "profile", href: "/about/" },
  ] as const;
  const currentLink = links.find((link) => link.key === active) ?? links[0];

  return (
    <header className="shell-header">
      <div className="shell-titlebar">
        <div className="shell-titlebar-left">
          <div aria-hidden="true" className="shell-window-controls">
            <span className="shell-window-dot is-close" />
            <span className="shell-window-dot is-min" />
            <span className="shell-window-dot is-max" />
          </div>

          <div>
            <p className="shell-window-title">xindan@toronto-node: ~/personal-site</p>
            <Link className="brand-mark" href="/">
              {site.name}
            </Link>
          </div>
        </div>

        <div className="masthead-actions">
          <ThemeToggle />
          <a className="masthead-link" href={site.email}>
            Email
          </a>
        </div>
      </div>

      <div className="shell-statusline">
        <span>user=xindan</span>
        <span>host=toronto-node</span>
        <span>shell=zsh</span>
        <span>tty=pts/0</span>
      </div>

      <nav className="terminal-nav" aria-label="Primary">
        <div className="terminal-nav-meta">
          <span className="terminal-nav-label">fd . ~/personal-site -d 1</span>
          <span className="terminal-nav-state">pwd: ~/personal-site</span>
          <span className="terminal-nav-current">open: {currentLink.target}</span>
        </div>

        <ol className="terminal-nav-list">
          {links.map((link, index) => {
          const isActive = active === link.key;

          return (
            <li key={link.key} className={`terminal-nav-item ${isActive ? "is-active" : ""}`}>
              <span className="terminal-nav-index">{String(index + 1).padStart(2, "0")}</span>
              <Link className={`terminal-nav-link ${isActive ? "is-active" : ""}`} href={link.href}>
                <span className="terminal-nav-target">{link.target}</span>
                <span className="terminal-nav-note">{link.note}</span>
              </Link>
            </li>
          );
          })}
        </ol>
      </nav>
    </header>
  );
}
