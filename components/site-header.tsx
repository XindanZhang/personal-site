"use client";

import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "bookmarks" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

const navigation = [
  { key: "home", href: "/", label: "Home" },
  { key: "projects", href: "/projects/", label: "Work" },
  { key: "blog", href: "/blog/", label: "Writing" },
  { key: "about", href: "/about/", label: "About" },
] as const;

export function SiteHeader({ active }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [active]);

  return (
    <header className="site-header">
      <div className="nav-shell glass-surface">
        <Link className="site-brand" href="/" aria-label="Xindan Zhang, home">
          <span className="brand-symbol" aria-hidden="true">
            XZ
          </span>
          <span className="brand-copy">
            <strong>Xindan Zhang</strong>
            <span>Systems field notes</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.key}
              className={`nav-item ${active === item.key ? "is-active" : ""}`}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <a
            className="icon-button"
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile"
            title="GitHub"
          >
            <Github aria-hidden="true" size={18} strokeWidth={1.8} />
          </a>
          <ThemeToggle />
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav glass-surface ${menuOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navigation.map((item, index) => (
          <Link
            key={item.key}
            className={`mobile-nav-item ${active === item.key ? "is-active" : ""}`}
            href={item.href}
            aria-current={active === item.key ? "page" : undefined}
            tabIndex={menuOpen ? 0 : -1}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
