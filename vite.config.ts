import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

interface GeneratedPost {
  slug: string;
  seriesSlug?: string;
}

function getPrerenderPages() {
  const generated = JSON.parse(
    readFileSync(new URL("./src/generated/blog-data.json", import.meta.url), "utf8"),
  ) as { posts: GeneratedPost[] };
  const paths = new Set<string>(["/404"]);

  for (const post of generated.posts) {
    paths.add(`/blog/${post.slug}`);
    if (post.seriesSlug) paths.add(`/blog/series/${post.seriesSlug}`);
  }

  return [...paths].map((path) => path === "/404"
    ? { path, prerender: { enabled: true, outputPath: "/404.html" } }
    : { path });
}

export default defineConfig({
  base: "/personal-site/",
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      pages: getPrerenderPages(),
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        failOnError: true,
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
  },
});
