import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRoutePath, isRouteActive } from "~/lib/navigation";

const mainframeLinks = [
  { label: "Labs", to: "/projects/" },
  { label: "Studio", to: "/blog/" },
  { label: "Openings", to: "/about/" },
  { label: "Shop", to: "/bookmarks/" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routePath = getRoutePath(pathname);
  const isHome = isRouteActive(routePath, "/");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <header className={`mainframe-nav fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 ${isHome ? "is-home" : ""}`}>
        <Link className="mainframe-logo flex items-center gap-3 text-black" to="/" aria-label="Mainframe home">
          <span className="mainframe-logo-text text-[21px] tracking-tight sm:text-[26px]">Mainframe®</span>
          <span className="select-none text-[25px] tracking-[-0.02em] sm:text-[30px]" aria-hidden="true">✳︎</span>
        </Link>

        <nav className="hidden items-center text-[23px] text-black md:flex" aria-label="Primary navigation">
          {mainframeLinks.map((item, index) => (
            <span key={item.to}>
              <Link className="transition-opacity hover:opacity-60" to={item.to}>{item.label}</Link>
              {index < mainframeLinks.length - 1 ? ", " : null}
            </span>
          ))}
        </nav>

        <a className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block" href="mailto:hello@mainframe.co">
          Get in touch
        </a>

        <button
          className="mainframe-menu relative z-20 flex flex-col gap-[5px] p-2 md:hidden"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          <span className={`mainframe-menu-bar h-[2px] w-6 bg-black ${menuOpen ? "is-top-open" : ""}`} />
          <span className={`h-[2px] w-6 bg-black transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`mainframe-menu-bar h-[2px] w-6 bg-black ${menuOpen ? "is-bottom-open" : ""}`} />
        </button>
      </header>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-start gap-8 text-[32px] font-medium text-black" aria-label="Mobile navigation">
          {mainframeLinks.map((item) => (
            <Link key={item.to} to={item.to} tabIndex={menuOpen ? 0 : -1}>{item.label}</Link>
          ))}
          <a className="underline underline-offset-4" href="mailto:hello@mainframe.co" tabIndex={menuOpen ? 0 : -1}>Get in touch</a>
        </nav>
      </div>
    </>
  );
}
