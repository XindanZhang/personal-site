import Link from "next/link";
import { site } from "../lib/site";

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
          <p className="masthead-note">Toronto · systems notebook · 2026</p>
          <Link className="brand-mark" href="/">
            {site.name}
          </Link>
        </div>

        <a className="masthead-link" href={site.email}>
          Say hello
        </a>
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
