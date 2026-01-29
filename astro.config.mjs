// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://xindanzhang.github.io/personal-site",
  base: "/personal-site",
  outDir: "./docs",
  trailingSlash: "always",
});
