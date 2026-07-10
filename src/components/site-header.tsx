import { ArrowUpRight, Github, House, Menu, Moon, Sun, X } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRoutePath, isRouteActive, navigation } from "~/lib/navigation";
import { site } from "~/lib/site";

type Theme = "dark" | "light";

export function SiteHeader() {
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);
  const isInterests = isRouteActive(routePath, "/interests/");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  }

  return (
    <>
      <header className={`site-header ${isInterests ? "is-game-header" : ""}`}>
        <div className="header-inner">
          <Link className="site-brand" to="/" aria-label="Home" title="Home"><span className="brand-mark" aria-hidden="true"><House size={17} /></span></Link>

          {isInterests ? (
            <span className="interest-context">Interests / Delta Force</span>
          ) : (
            <nav className="desktop-nav" aria-label="Primary navigation">
              {navigation.map((item) => {
                const active = isRouteActive(routePath, item.to);
                return <Link key={item.to} className={active ? "is-active" : ""} to={item.to} aria-current={active ? "page" : undefined}>{item.label}</Link>;
              })}
            </nav>
          )}

          <div className="header-tools">
            {!isInterests ? <a className="icon-button github-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" title="GitHub"><Github aria-hidden="true" size={18} /></a> : null}
            {!isInterests ? <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Use ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}</button> : null}
            {!isInterests ? <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}</button> : null}
          </div>
        </div>
      </header>

      {menuOpen && !isInterests ? (
        <div id="mobile-navigation" className="mobile-nav-panel">
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => {
              const active = isRouteActive(routePath, item.to);
              return <Link key={item.to} className={active ? "is-active" : ""} to={item.to} aria-current={active ? "page" : undefined}><span>{item.command}</span>{item.label}<ArrowUpRight aria-hidden="true" size={22} /></Link>;
            })}
          </nav>
          <div className="mobile-nav-meta"><a href={site.email}>xindan.zhang@mail.utoronto.ca</a><span>Toronto, Canada</span></div>
        </div>
      ) : null}
    </>
  );
}
