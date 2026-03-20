import Link from "next/link";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const links = [
    { key: "home", label: "~", href: "/" },
    { key: "blog", label: "/journal", href: "/blog/" },
    { key: "projects", label: "/projects", href: "/projects/" },
    { key: "friends", label: "/bookmarks", href: "/friends/" },
    { key: "about", label: "/README", href: "/about/" },
  ] as const;

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

      <nav className="shell-nav" aria-label="Primary">
        {links.map((link) => {
          const isActive = active === link.key;

          return (
            <Link
              key={link.key}
              className={`shell-nav-link ${isActive ? "is-active" : ""}`}
              href={link.href}
            >
              <span className="shell-nav-command">cd</span>
              <span className="shell-nav-path">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
