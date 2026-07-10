import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "~/lib/site";

const navigation = [
  { to: "/", label: "Home", command: "01" },
  { to: "/projects/", label: "Work", command: "02" },
  { to: "/blog/", label: "Writing", command: "03" },
  { to: "/about/", label: "About", command: "04" },
] as const;

type Theme = "dark" | "light";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = pathname.replace(/^\/personal-site(?=\/|$)/, "") || "/";

  useEffect(() => {
    setMenuOpen(false);
  }, [routePath]);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <header className="site-header">
      <div className="machine-bar" aria-label="Session status">
        <span className="machine-id">XZ/PORTFOLIO</span>
        <span><i className="live-dot" aria-hidden="true" /> NODE ONLINE</span>
        <span className="machine-location">YYZ / UTC-04</span>
        <span className="machine-protocol">HTTPS : 443</span>
      </div>

      <div className="navigation-bar">
        <Link className="site-brand" to="/" aria-label="Xindan Zhang, home">
          <span className="brand-mark" aria-hidden="true">XZ</span>
          <span>
            <strong>Xindan Zhang</strong>
            <small>systems / networks / notes</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const isActive = item.to === "/" ? routePath === "/" : routePath.startsWith(item.to.replace(/\/$/, ""));
            return (
              <Link
                key={item.to}
                className={`nav-link ${isActive ? "is-active" : ""}`}
                to={item.to}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.command}</span>{item.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-tools">
          <a className="icon-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" title="GitHub">
            <Github aria-hidden="true" size={18} />
          </a>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Use ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          </button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-nav">
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className={`mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
        {navigation.map((item) => {
          const isActive = item.to === "/" ? routePath === "/" : routePath.startsWith(item.to.replace(/\/$/, ""));
          return (
            <Link key={item.to} className={isActive ? "is-active" : ""} to={item.to} aria-current={isActive ? "page" : undefined} tabIndex={menuOpen ? 0 : -1}>
              <span>[{item.command}]</span>{item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
