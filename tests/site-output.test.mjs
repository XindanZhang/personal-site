import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function runNpm(args, options) {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath && existsSync(npmExecPath)) {
    execFileSync(process.execPath, [npmExecPath, ...args], options);
    return;
  }
  execFileSync("corepack", ["npm", ...args], options);
}

function buildSite() {
  const outDir = mkdtempSync(resolve(rootDir, ".tmp-personal-site-test-"));
  runNpm(["run", "build"], {
    cwd: rootDir,
    stdio: "pipe",
    env: { ...process.env, DOCS_OUT_DIR: relative(rootDir, outDir) },
  });
  return outDir;
}

function readExport(outDir, ...segments) {
  return readFileSync(resolve(outDir, ...segments), "utf8");
}

test("the personal hero keeps mouse-driven video seeking bounded and queued", () => {
  const source = readFileSync(resolve(rootDir, "src", "routes", "index.tsx"), "utf8");

  assert.match(source, /const SENSITIVITY = 0\.8/);
  assert.match(source, /window\.addEventListener\("mousemove"/);
  assert.match(source, /addEventListener\("touchmove"/);
  assert.match(source, /delta \/ window\.innerWidth/);
  assert.match(source, /queuedSeekRef/);
  assert.match(source, /computer-poster/);
  assert.match(source, /vintage-computer-only\.mp4/);
  assert.match(source, /videoRef\.current\?\.load\(\)/);
  assert.match(source, /onSeeked=\{handleSeeked\}/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /muted/);
  assert.match(source, /playsInline/);
  assert.match(source, /preload="auto"/);
  assert.doesNotMatch(source, /autoPlay/);
});

test("TanStack Start prerenders the editorial portfolio and every route", () => {
  const outDir = buildSite();

  try {
    const requiredFiles = [
      ".nojekyll",
      "404.html",
      "index.html",
      "fonts/paper-mono.woff2",
      "fonts/PAPER-MONO-LICENSE.txt",
      "assets/vintage-computer-only.mp4",
      "assets/vintage-computer-only-poster.webp",
      "about/index.html",
      "projects/index.html",
      "bookmarks/index.html",
      "blog/index.html",
      "blog/series/nextmini/index.html",
      "blog/nextmini/controller-interface/index.html",
      "blog/category/nextmini-series/index.html",
      "blog/tag/nextmini/index.html",
    ];

    for (const file of requiredFiles) {
      assert.equal(existsSync(resolve(outDir, file)), true, `missing export: ${file}`);
    }

    assert.equal(existsSync(resolve(outDir, "network-field.webp")), false, "removed generated background was exported");
    assert.equal(existsSync(resolve(outDir, "images", "game-zone-operator.webp")), false, "old operator composite was exported");
    assert.equal(existsSync(resolve(outDir, "figures", "nextmini-topology.svg")), false, "removed topology figure was exported");
    assert.equal(existsSync(resolve(outDir, "images", "delta-force-yard-v2.webp")), false, "old game background was exported");
    assert.equal(existsSync(resolve(outDir, "images", "vyron-cutout-v2.webp")), false, "old operator cutout was exported");
    assert.equal(existsSync(resolve(outDir, "_next")), false, "Next.js assets remain in export");
    assert.equal(existsSync(resolve(outDir, "games", "index.html")), false, "removed games route was exported");
    assert.equal(existsSync(resolve(outDir, "interests", "index.html")), false, "removed interests route was exported");

    const homeHtml = readExport(outDir, "index.html");
    const notFoundHtml = readExport(outDir, "404.html");
    const projectsHtml = readExport(outDir, "projects", "index.html");
    const aboutHtml = readExport(outDir, "about", "index.html");
    const linksHtml = readExport(outDir, "bookmarks", "index.html");

    assert.match(homeHtml, /<title>Xindan Zhang — Systems, networks, and field notes<\/title>/);
    assert.match(homeHtml, /Xindan Zhang\./);
    assert.match(homeHtml, /Tracing systems\./);
    assert.match(homeHtml, /Keeping the useful parts\./);
    assert.match(homeHtml, /Selected work/);
    assert.match(homeHtml, /xindan\.zhang@mail\.utoronto\.ca/);
    assert.match(homeHtml, /vintage-computer-only\.mp4/);
    assert.match(homeHtml, /vintage-computer-only-poster\.webp/);
    assert.doesNotMatch(homeHtml, /hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08\.mp4/);
    assert.match(homeHtml, /class="typewriter-cursor/);
    assert.doesNotMatch(homeHtml, /Start a conversation|Have a systems problem worth making legible/);
    assert.doesNotMatch(homeHtml, /Mainframe®|Pitch us an idea|hello@mainframe\.co/);
    assert.match(homeHtml, /aria-label="Primary navigation"/);
    assert.match(homeHtml, />Work<\/a>/);
    assert.match(homeHtml, />Writing<\/a>/);
    assert.match(homeHtml, />About<\/a>/);
    assert.match(homeHtml, />Links<\/a>/);
    assert.match(homeHtml, /aria-controls="mobile-navigation"/);
    assert.doesNotMatch(homeHtml, /aria-label="Footer navigation"/);
    assert.match(homeHtml, /id="main-content"/);
    assert.match(homeHtml, /Skip to content/);
    assert.match(homeHtml, /\/personal-site\/assets\//);
    assert.doesNotMatch(homeHtml, /xindan@toronto|profile --brief|Terminal ready/);
    assert.match(notFoundHtml, /There is nothing here\./);
    assert.match(notFoundHtml, /href="\/personal-site\/">Return home<\/a>/);
    assert.doesNotMatch(notFoundHtml, /<script/);

    assert.match(projectsHtml, /Systems made legible\./);
    assert.match(projectsHtml, /Featured notes/);
    assert.match(projectsHtml, /Four-part code-reading series/);
    assert.match(projectsHtml, /More work/);
    assert.match(projectsHtml, /TanStack Start notebook/);
    assert.doesNotMatch(projectsHtml, /Vyron|nextmini-topology|Independent researcher|technical writer/);

    assert.match(aboutHtml, /PhD student in ECE at the University of Toronto\./);
    assert.match(aboutHtml, /From a trace to a reusable result\./);
    assert.match(aboutHtml, /A practical systems stack/);
    assert.match(aboutHtml, /Have a thoughtful systems problem\?/);
    assert.match(aboutHtml, /Copy email/);
    assert.doesNotMatch(aboutHtml, />XZ<|Independent researcher|technical writer|Available/);

    assert.match(linksHtml, /References worth reopening\./);
    assert.match(linksHtml, /aria-label="Bookmarked references"/);
    assert.match(linksHtml, /nextmini\.org/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("writing, SEO, editorial styles, and accessibility survive static export", () => {
  const outDir = buildSite();

  try {
    const blogHtml = readExport(outDir, "blog", "index.html");
    const articleHtml = readExport(outDir, "blog", "nextmini", "controller-interface", "index.html");
    const notFoundHtml = readExport(outDir, "404.html");
    const cssFile = readdirSync(resolve(outDir, "assets")).find((file) => file.endsWith(".css"));
    assert.ok(cssFile, "missing Vite CSS bundle");
    const css = readExport(outDir, "assets", cssFile);

    assert.match(blogHtml, /<h1>Writing\.<\/h1>/);
    assert.match(blogHtml, /type="search"/);
    assert.match(blogHtml, /Search title, topic, or tag/);
    assert.match(blogHtml, /aria-label="Writing filters"/);
    assert.match(blogHtml, /aria-label="Categories"/);
    assert.match(blogHtml, /<summary>Tags <span>/);
    assert.match(blogHtml, /Ethernet 1500B and Jumbo 9000/);

    assert.match(articleHtml, /<title>Controller interface \| Xindan Zhang<\/title>/);
    assert.match(articleHtml, /name="description" content=/);
    assert.match(articleHtml, /property="og:type" content="article"/);
    assert.match(articleHtml, /article:published_time/);
    assert.match(articleHtml, /rel="canonical" href="https:\/\/xindanzhang\.github\.io\/personal-site\/blog\/nextmini\/controller-interface\/"/);
    assert.match(articleHtml, /class="reading-progress"/);
    assert.match(articleHtml, /class="article-outline-mobile"/);
    assert.match(articleHtml, /On this page/);
    assert.match(articleHtml, /aria-label="Table of contents"/);
    assert.match(articleHtml, /Copy link/);
    assert.match(articleHtml, /Controller interface/);

    assert.match(css, /@font-face/);
    assert.match(css, /Paper Mono/);
    assert.match(css, /\/personal-site\/fonts\/paper-mono\.woff2/);
    assert.doesNotMatch(css, /IBM Plex/);
    assert.match(css, /--font-heading:[^;]*HelveticaNowDisplay-Medium/);
    assert.match(css, /--font-body:[^;]*HelveticaNowDisplayW01-Rg/);
    assert.match(css, /--paper:#efede8/);
    assert.match(css, /--blue:#b6644d/);
    assert.match(css, /\[data-theme=dark\]/);
    assert.match(css, /backdrop-filter:blur\(/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)/);
    assert.match(css, /scroll-behavior:auto!important/);
    assert.match(css, /animation:none!important/);
    assert.match(css, /overflow-wrap:anywhere/);
    assert.doesNotMatch(css, /\.site-main\{[^}]*overflow:clip/);
    assert.match(css, /@media\s*\(prefers-reduced-transparency:reduce\)/);
    assert.match(css, /animation:content-enter/);
    assert.match(css, /\.typewriter-cursor/);
    assert.match(css, /@keyframes blink/);
    assert.match(css, /\.personal-hero-grid/);
    assert.match(css, /\.computer-stage/);
    assert.doesNotMatch(css, /\.game-scene|\.vyron-kit|\.game-zone/);
    assert.match(css, /overflow-y:auto/);
    assert.doesNotMatch(css, /#b9f34b|#73f59f|#65e99a|#75f59f|#72f59d|#78f5a2|#9dd8cc|#1a5e3a/);
    assert.match(css, /:focus-visible/);
    assert.match(notFoundHtml, /Paper Mono/);
    assert.match(notFoundHtml, /\/personal-site\/fonts\/paper-mono\.woff2/);
    assert.match(notFoundHtml, /There is nothing here\./);
    assert.match(notFoundHtml, /:focus-visible/);

    const htmlFiles = [];
    const walk = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = resolve(directory, entry.name);
        if (entry.isDirectory()) walk(entryPath);
        if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(entryPath);
      }
    };
    walk(outDir);
    assert.equal(htmlFiles.filter((file) => file.endsWith("index.html")).length, 46);

    for (const file of htmlFiles) {
      const html = readFileSync(file, "utf8");
      assert.doesNotMatch(html, /(?:href|src)="\/assets\//, `root asset path leaked in ${file}`);
      assert.doesNotMatch(html, /_next\//, `Next.js asset leaked in ${file}`);
      assert.doesNotMatch(html, /xindan@portfolio/, `old terminal host leaked in ${file}`);
    }
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
