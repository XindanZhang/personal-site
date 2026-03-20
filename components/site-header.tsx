import Link from "next/link";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const links = [
    { key: "home", label: "~/", href: "/" },
    { key: "blog", label: "/journal", href: "/blog/" },
    { key: "projects", label: "/projects", href: "/projects/" },
    { key: "friends", label: "/bookmarks", href: "/friends/" },
    { key: "about", label: "/README", href: "/about/" },
  ] as const;

  return (
    <header className="shell-header">
      <div className="shell-titlebar">
        <div>
          <p className="masthead-note">toronto-node :: /home/xindan/personal-site</p>
          <Link className="brand-mark" href="/">
            {site.name}
          </Link>
        </div>

        <div className="masthead-actions">
          <ThemeToggle />
          <a className="masthead-link" href={site.email}>
            Email
          </a>
        </div>
      </div>

      <div className="shell-statusline">
        <span>user=xz</span>
        <span>host=toronto-node</span>
        <span>shell=zsh</span>
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
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
