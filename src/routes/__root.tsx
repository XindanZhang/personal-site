import type { ReactNode } from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { site } from "~/lib/site";
import "../styles/site.css";

const themeScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("theme");
    document.documentElement.dataset.theme = stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.name },
      { name: "description", content: site.description },
      { name: "theme-color", content: "#090b0a" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.name },
      { property: "og:description", content: site.description },
    ],
    links: [
      { rel: "icon", href: `${site.basePath}/favicon.ico` },
      { rel: "icon", href: `${site.basePath}/favicon.svg`, type: "image/svg+xml" },
      { rel: "preload", href: `${site.basePath}/fonts/paper-mono.woff2`, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "canonical", href: "https://xindanzhang.github.io/personal-site/" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="site-frame">
        <SiteHeader />
        <main id="main-content" className="site-main">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <section className="error-screen" aria-labelledby="not-found-title">
      <p className="command-line"><span>xindan@toronto:~$</span> resolve --path current</p>
      <p className="error-code">ERR 404 / NO ENTRY</p>
      <h1 id="not-found-title">This path is not in the index.</h1>
      <p>The page may have moved, or the command was typed from an old note.</p>
      <Link className="command-button" to="/">
        Return to ~/home
      </Link>
    </section>
  );
}
