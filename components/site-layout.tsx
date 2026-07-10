import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface SiteLayoutProps {
  active: "home" | "blog" | "projects" | "bookmarks" | "about";
  children: ReactNode;
}

export function SiteLayout({ active, children }: SiteLayoutProps) {
  return (
    <div className="site-frame">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader active={active} />
      <main id="main-content" className="site-main">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
