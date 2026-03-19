import Link from "next/link";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const links = [
    { key: "home", label: "Home", href: "/" },
    { key: "blog", label: "Journal", href: "/blog/" },
    { key: "projects", label: "Projects", href: "/projects/" },
    { key: "friends", label: "Reading", href: "/friends/" },
    { key: "about", label: "About", href: "/about/" },
  ] as const;

  return (
    <header className="masthead">
      <div className="masthead-top">
        <div>
          <p className="masthead-note">Toronto · systems orbit · 2026</p>
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

      <nav className="masthead-nav" aria-label="Primary">
        {links.map((link) => {
          const isActive = active === link.key;

          return (
            <Link
              key={link.key}
              className={`nav-link ${isActive ? "is-active" : ""}`}
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
