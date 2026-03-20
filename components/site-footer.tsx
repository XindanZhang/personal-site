import Link from "next/link";
type FooterKey = "home" | "blog" | "projects" | "friends" | "about";

const footerContext: Record<FooterKey, string> = {
  home: "home",
  blog: "journal",
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
          <Link className="shell-statusbar-link is-f1" href="/blog/">
            <span className="shell-statusbar-key">F1</span>
            <span>journal</span>
          </Link>
          <Link className="shell-statusbar-link is-f2" href="/projects/">
            <span className="shell-statusbar-key">F2</span>
            <span>projects</span>
          </Link>
          <Link className="shell-statusbar-link is-f3" href="/friends/">
            <span className="shell-statusbar-key">F3</span>
            <span>links</span>
          </Link>
          <Link className="shell-statusbar-link is-f4" href="/about/">
            <span className="shell-statusbar-key">F4</span>
            <span>README</span>
          </Link>
        </div>

        <span className="shell-statusbar-clock">{year} Toronto</span>
      </div>
    </footer>
  );
}
