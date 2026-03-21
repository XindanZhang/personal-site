import Link from "next/link";
type FooterKey = "home" | "blog" | "projects" | "bookmarks" | "about";

const footerContext: Record<FooterKey, string> = {
  home: "home",
  blog: "blog",
  projects: "projects",
  bookmarks: "bookmarks",
  about: "readme",
};

interface ShellNavLineProps {
  active: FooterKey;
}

export function ShellNavLine({ active }: ShellNavLineProps) {
  const year = new Date().getUTCFullYear();

  return (
    <div aria-label="Primary navigation" className="shell-statusline shell-navline" role="navigation">
      <div className="shell-nav-meta">
        <span className="shell-nav-segment is-strong">main</span>
        <span className="shell-nav-segment">{`ctx=${footerContext[active]}`}</span>
        <span className="shell-nav-segment">prefix=^b</span>
      </div>

      <div className="shell-nav-actions">
        <Link
          aria-keyshortcuts="F1"
          className="shell-statusbar-link is-f1"
          data-shell-shortcut="F1"
          href="/blog/"
          title="F1 blog"
        >
          <span className="shell-statusbar-key">F1</span>
          <span>blog</span>
        </Link>
        <Link
          aria-keyshortcuts="F2"
          className="shell-statusbar-link is-f2"
          data-shell-shortcut="F2"
          href="/projects/"
          title="F2 projects"
        >
          <span className="shell-statusbar-key">F2</span>
          <span>projects</span>
        </Link>
        <Link
          aria-keyshortcuts="F3"
          className="shell-statusbar-link is-f3"
          data-shell-shortcut="F3"
          href="/bookmarks/"
          title="F3 bookmarks"
        >
          <span className="shell-statusbar-key">F3</span>
          <span>bookmarks</span>
        </Link>
        <Link
          aria-keyshortcuts="F4"
          className="shell-statusbar-link is-f4"
          data-shell-shortcut="F4"
          href="/about/"
          title="F4 README"
        >
          <span className="shell-statusbar-key">F4</span>
          <span>README</span>
        </Link>
      </div>

      <span className="shell-nav-clock">{year} Toronto</span>
    </div>
  );
}
