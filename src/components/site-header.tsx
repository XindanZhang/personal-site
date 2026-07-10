import { Github, Moon, Sun } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRoutePath, isRouteActive, navigation } from "~/lib/navigation";
import { site } from "~/lib/site";

type Theme = "dark" | "light";

export function SiteHeader() {
  const [theme, setTheme] = useState<Theme>("dark");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);
  const displayPath = routePath === "/" ? "~/home" : `~${routePath.replace(/\/$/, "")}`;

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
    <>
      <header className="site-header">
        <Link className="terminal-brand" to="/" aria-label="Xindan Zhang, home">
          <span aria-hidden="true">&gt;_</span>
          <strong>xindan@toronto</strong>
        </Link>
        <span className="header-path">{displayPath}</span>
        <span className="header-runtime"><i className="live-dot" aria-hidden="true" /> xterm-256color</span>
        <div className="header-tools">
          <a className="icon-button" href={site.github} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" title="GitHub">
            <Github aria-hidden="true" size={16} />
          </a>
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Use ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
          </button>
        </div>
      </header>

      <aside className="site-tree">
        <div className="tree-heading"><span>~/</span><span>4 dirs</span></div>
        <nav aria-label="Primary navigation">
          {navigation.map((item, index) => {
            const active = isRouteActive(routePath, item.to);
            const branch = index === navigation.length - 1 ? "└─" : "├─";
            return (
              <Link key={item.to} className={active ? "is-active" : ""} to={item.to} aria-current={active ? "page" : undefined}>
                <span aria-hidden="true">{branch}</span><b>{item.label}/</b>
              </Link>
            );
          })}
        </nav>
        <Link className="tree-file" to="/bookmarks/"><span aria-hidden="true">└─</span>bookmarks.md</Link>
        <dl className="tree-status">
          <div><dt>NODE</dt><dd>TORONTO_CA</dd></div>
          <div><dt>FOCUS</dt><dd>NETWORKS</dd></div>
          <div><dt>ACTIVE</dt><dd>NEXTMINI</dd></div>
          <div><dt>STATE</dt><dd><i className="live-dot" aria-hidden="true" /> ONLINE</dd></div>
        </dl>
      </aside>

      <nav className="mobile-tmux-nav" aria-label="Mobile navigation">
        {navigation.map((item) => {
          const active = isRouteActive(routePath, item.to);
          return (
            <Link key={item.to} className={active ? "is-active" : ""} to={item.to} aria-current={active ? "page" : undefined}>
              <span>{item.command}</span>{item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
