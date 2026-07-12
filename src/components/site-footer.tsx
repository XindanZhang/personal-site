import { Link, useRouterState } from "@tanstack/react-router";
import { getRoutePath, isRouteActive, navigation } from "~/lib/navigation";
import { site } from "~/lib/site";

export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);
  if (isRouteActive(routePath, "/")) return null;

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-bottom">
          <span className="footer-brand">© 2026</span>
          <nav aria-label="Footer navigation">{navigation.slice(1).map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}</nav>
          <div className="footer-links"><Link to="/bookmarks/">Bookmarks</Link><a href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={site.source} target="_blank" rel="noopener noreferrer">Source</a></div>
          <p>Toronto, Canada</p>
        </div>
      </div>
    </footer>
  );
}
