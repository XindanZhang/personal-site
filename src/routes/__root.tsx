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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.name },
      { name: "description", content: site.description },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.name },
      { property: "og:description", content: site.description },
    ],
    links: [
      { rel: "icon", href: `${site.basePath}/favicon.ico` },
      { rel: "icon", href: `${site.basePath}/favicon.svg`, type: "image/svg+xml" },
      { rel: "preload", href: `${site.basePath}/fonts/paper-mono.woff2`, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://db.onlinewebfonts.com/c/5ac3fe7c6abd2f62067f266d89671492?family=HelveticaNowDisplay-Medium" },
      { rel: "stylesheet", href: "https://db.onlinewebfonts.com/c/1aa3377e489837a26d019bba501e779d?family=HelveticaNowDisplayW01-Rg" },
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
      <p className="section-kicker">Error · 404</p>
      <h1 id="not-found-title">There is nothing here.</h1>
      <p>The page may have moved, or the address is no longer part of this site.</p>
      <Link className="action-link is-primary" to="/">Return home</Link>
    </section>
  );
}
