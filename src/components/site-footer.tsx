import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { site } from "~/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-prompt">
        <span aria-hidden="true">$</span>
        <p>End of buffer. Continue the conversation over email.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/bookmarks/">Links</Link>
        <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight aria-hidden="true" size={13} /></a>
        <a href={site.email}>Email</a>
      </nav>
      <p className="footer-meta">TORONTO / {new Date().getUTCFullYear()} / EOF</p>
    </footer>
  );
}
