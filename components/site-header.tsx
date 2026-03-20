import Link from "next/link";
import { site } from "../lib/site";
import { ThemeToggle } from "./theme-toggle";

type NavKey = "home" | "blog" | "projects" | "friends" | "about";

interface SiteHeaderProps {
  active: NavKey;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  const currentPage: Record<NavKey, string> = {
    home: "./",
    blog: "./journal/",
    projects: "./projects/",
    friends: "./links/",
    about: "./README.md",
  };

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
          <Link className="masthead-link is-home" href="/">
            Home
          </Link>
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

      <div className="shell-statusline shell-contextline">
        <span>cwd=~/personal-site</span>
        <span>page={currentPage[active]}</span>
      </div>
    </header>
  );
}
