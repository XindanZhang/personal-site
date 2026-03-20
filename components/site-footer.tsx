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
          <Link className="shell-statusbar-link" href="/blog/">
            F1 journal
          </Link>
          <Link className="shell-statusbar-link" href="/projects/">
            F2 projects
          </Link>
          <Link className="shell-statusbar-link" href="/friends/">
            F3 links
          </Link>
          <Link className="shell-statusbar-link" href="/about/">
            F4 README
          </Link>
        </div>

        <span className="shell-statusbar-clock">{year} Toronto</span>
      </div>
    </footer>
  );
}
