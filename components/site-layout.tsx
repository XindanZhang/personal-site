import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface SiteLayoutProps {
  active: "home" | "blog" | "projects" | "friends" | "about";
  children: ReactNode;
}

export function SiteLayout({ active, children }: SiteLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-2 py-3 tablet:px-6 tablet:py-6">
      <div className="translate-y-0 opacity-100 transition-all duration-300">
        <SiteHeader active={active} />
      </div>

      <main className="mt-3 border border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-300 tablet:mt-6 tablet:p-6">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
