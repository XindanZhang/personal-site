import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { ShellShortcuts } from "./shell-shortcuts";

interface SiteLayoutProps {
  active: "home" | "blog" | "projects" | "bookmarks" | "about";
  children: ReactNode;
}

export function SiteLayout({ active, children }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <ShellShortcuts />
      <div className="shell-window">
        <SiteHeader active={active} />
        <main className="shell-main">{children}</main>
      </div>
    </div>
  );
}
