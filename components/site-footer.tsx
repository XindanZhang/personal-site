import Link from "next/link";
type FooterKey = "home" | "blog" | "projects" | "friends" | "about";

const footerContext: Record<FooterKey, string> = {
  home: "home",
  blog: "blog",
  projects: "projects",
  friends: "links",
  about: "readme",
};

interface SiteFooterProps {
  active: FooterKey;
}

export function SiteFooter({ active }: SiteFooterProps) {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="shell-footer">
      <div className="shell-statusbar">
        <span className="shell-statusbar-segment is-strong">main</span>
        <span className="shell-statusbar-segment">{`ctx=${footerContext[active]}`}</span>
        <span className="shell-statusbar-segment">prefix=^b</span>

        <div className="shell-statusbar-links">
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
            href="/friends/"
            title="F3 links"
          >
            <span className="shell-statusbar-key">F3</span>
            <span>links</span>
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

        <span className="shell-statusbar-clock">{year} Toronto</span>
      </div>
    </footer>
  );
}
