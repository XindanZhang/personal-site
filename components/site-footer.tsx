import Link from "next/link";
import { site } from "../lib/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="site-footer">
      <p className="footer-copy">
        Built as a long-range notebook for notes that should survive the session they came from.
      </p>

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
        <span>Toronto</span>
        <span>{year}</span>
      </div>
    </footer>
  );
}
