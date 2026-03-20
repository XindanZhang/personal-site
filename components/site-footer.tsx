import Link from "next/link";
import { site } from "../lib/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="shell-footer">
      <p className="footer-copy">xindan@toronto-node:~/personal-site$ printf '%s\n' source contact location</p>

      <div className="footer-links">
        <Link href="/blog/">Journal</Link>
        <Link href="/projects/">Projects</Link>
        <Link href="/friends/">Reading</Link>
        <a href={site.github} rel="noopener noreferrer" target="_blank">
          GitHub
        </a>
        <a href={site.email}>Email</a>
      </div>

      <div className="footer-meta">
        <span>cwd=/home/xindan/personal-site</span>
        <span>year={year}</span>
      </div>
    </footer>
  );
}
