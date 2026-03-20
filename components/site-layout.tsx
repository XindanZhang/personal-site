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
      <div className="shell-window">
        <SiteHeader active={active} />
        <main className="shell-main">{children}</main>
        <SiteFooter active={active} />
      </div>
    </div>
  );
}
