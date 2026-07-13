import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRoutePath, isRouteActive } from "~/lib/navigation";
import { site } from "~/lib/site";

const personalLinks = [
  { label: "Work", to: "/projects/" },
  { label: "Writing", to: "/blog/" },
  { label: "About", to: "/about/" },
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
        <Link className="mainframe-logo flex items-center gap-3 text-black" to="/" aria-label="Xindan Zhang home">
          <span className="mainframe-logo-text text-[20px] tracking-tight sm:text-[22px]">Xindan Zhang.</span>
          <span className="select-none text-[22px] tracking-[-0.02em] sm:text-[24px]" aria-hidden="true">✳︎</span>
        </Link>

        <nav className="mainframe-desktop-nav hidden items-center text-[15px] text-black md:flex" aria-label="Primary navigation">
          {personalLinks.map((item) => {
            const active = isRouteActive(routePath, item.to);
            return <Link key={item.to} className={`mainframe-nav-link ${active ? "is-active" : ""}`} to={item.to} aria-current={active ? "page" : undefined}>{item.label}</Link>;
          })}
        </nav>

        <a className="mainframe-contact-link hidden text-[14px] text-black md:inline-flex" href={site.email}>
          Email me
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

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="mainframe-mobile-overlay fixed inset-0 z-[9] flex flex-col justify-center gap-8 px-8 md:hidden"
        >
          <nav className="flex flex-col items-start gap-8 text-[32px] font-medium text-black" aria-label="Mobile navigation">
            {personalLinks.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}
            <a className="underline underline-offset-4" href={site.email}>Get in touch</a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
