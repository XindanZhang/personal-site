import { ArrowUpRight } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { getRoutePath, isRouteActive, navigation } from "~/lib/navigation";
import { site } from "~/lib/site";

export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);
  if (isRouteActive(routePath, "/games/")) return null;
  const showCallout = !isRouteActive(routePath, "/about/");

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {showCallout ? <div className="footer-callout"><p>Have a systems problem worth making legible?</p><a href={site.email}>Start a conversation <ArrowUpRight aria-hidden="true" size={18} /></a></div> : null}
        <div className="footer-bottom">
          <Link className="footer-brand" to="/">Xindan Zhang</Link>
          <nav aria-label="Footer navigation">{navigation.slice(1, 4).map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}</nav>
          <div className="footer-links"><Link to="/bookmarks/">Bookmarks</Link><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={site.source} target="_blank" rel="noopener noreferrer">Source</a></div>
          <p>Toronto · 2026</p>
        </div>
      </div>
    </footer>
  );
}
