import { Link, useRouterState } from "@tanstack/react-router";
import { getRoutePath, isRouteActive, navigation } from "~/lib/navigation";

export function SiteFooter() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);

  return (
    <footer className="site-footer">
      <nav aria-label="Session tabs">
        {navigation.map((item) => {
          const active = isRouteActive(routePath, item.to);
          return <Link key={item.to} className={active ? "is-active" : ""} to={item.to}><span>{item.command}:</span>{item.label}{active ? "*" : ""}</Link>;
        })}
      </nav>
      <div className="footer-trace"><span>TTY</span><i /><span>CTRL</span><i /><span>DATA</span><i /><span>TRACE</span></div>
      <p><i className="live-dot" aria-hidden="true" /> ONLINE</p>
    </footer>
  );
}
