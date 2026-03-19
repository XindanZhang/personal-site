import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface SiteLayoutProps {
  active: "home" | "blog" | "projects" | "friends" | "about";
  children: ReactNode;
}

export function SiteLayout({ active, children }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <SiteHeader active={active} />
      <main className="page-frame">{children}</main>
      <SiteFooter />
    </div>
  );
}
