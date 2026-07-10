import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { site } from "../lib/site";

export function SiteFooter() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-identity">
        <span className="status-dot" aria-hidden="true" />
        <p>{site.availability}</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link href="/bookmarks/">Links</Link>
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRight aria-hidden="true" size={13} />
        </a>
        <a href={site.email}>Email</a>
      </nav>
      <p className="footer-meta">Toronto / {year}</p>
    </footer>
  );
}
