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

test("TanStack Start prerenders the terminal portfolio and every route", () => {
  const outDir = buildSite();

  try {
    const requiredFiles = [
      ".nojekyll",
      "404.html",
      "index.html",
      "figures/nextmini-topology.svg",
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
    assert.equal(existsSync(resolve(outDir, "_next")), false, "Next.js assets remain in export");

    const homeHtml = readExport(outDir, "index.html");
    const projectsHtml = readExport(outDir, "projects", "index.html");
    const aboutHtml = readExport(outDir, "about", "index.html");
    const linksHtml = readExport(outDir, "bookmarks", "index.html");

    assert.match(homeHtml, /<h1[^>]*id="home-title"[^>]*>Xindan Zhang/);
    assert.match(homeHtml, /xindan@toronto:~\$/);
    assert.match(homeHtml, /WHOAMI\.OUT/);
    assert.match(homeHtml, /NETWORK_SYSTEMS/);
    assert.match(homeHtml, /aria-current="page"[^>]*class="nav-link is-active/);
    assert.match(homeHtml, /Open work index/);
    assert.match(homeHtml, /Current thread/);
    assert.match(homeHtml, /Recent logs/);
    assert.match(homeHtml, /id="main-content"/);
    assert.match(homeHtml, /Skip to content/);
    assert.match(homeHtml, /\/personal-site\/assets\//);
    assert.doesNotMatch(homeHtml, /network-field|abstract optical-glass/i);

    assert.match(projectsHtml, /Small systems, inspected closely/);
    assert.match(projectsHtml, /NEXTMINI \/ TOPOLOGY\.VIEW/);
    assert.match(projectsHtml, /\/personal-site\/figures\/nextmini-topology\.svg/);
    assert.match(projectsHtml, /TanStack Start notebook/);

    assert.match(aboutHtml, /I make technical behavior easier to see and revisit/);
    assert.match(aboutHtml, /IDENTITY\.REC/);
    assert.match(aboutHtml, /A practical systems stack/);
    assert.match(aboutHtml, /Copy email/);

    assert.match(linksHtml, /One reference I keep reopening/);
    assert.match(linksHtml, /BOOKMARK\.TABLE/);
    assert.match(linksHtml, /nextmini\.org/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("writing, SEO, assets, and motion accessibility survive static export", () => {
  const outDir = buildSite();

  try {
    const blogHtml = readExport(outDir, "blog", "index.html");
    const articleHtml = readExport(outDir, "blog", "nextmini", "controller-interface", "index.html");
    const cssFile = readdirSync(resolve(outDir, "assets")).find((file) => file.endsWith(".css"));
    assert.ok(cssFile, "missing Vite CSS bundle");
    const css = readExport(outDir, "assets", cssFile);

    assert.match(blogHtml, /<h1>Field notes<\/h1>/);
    assert.match(blogHtml, /type="search"/);
    assert.match(blogHtml, /Search title, topic, or tag/);
    assert.match(blogHtml, /tags\.list/);
    assert.match(blogHtml, /Ethernet 1500B and Jumbo 9000/);

    assert.match(articleHtml, /<title>Controller interface \| Xindan Zhang<\/title>/);
    assert.match(articleHtml, /name="description" content=/);
    assert.match(articleHtml, /property="og:type" content="article"/);
    assert.match(articleHtml, /article:published_time/);
    assert.match(articleHtml, /rel="canonical" href="https:\/\/xindanzhang\.github\.io\/personal-site\/blog\/nextmini\/controller-interface\/"/);
    assert.match(articleHtml, /class="reading-progress"/);
    assert.match(articleHtml, /CONTENTS/);
    assert.match(articleHtml, /Copy link/);
    assert.match(articleHtml, /Controller interface/);

    assert.match(css, /IBM Plex Mono/);
    assert.match(css, /backdrop-filter:blur\(16px\)/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)/);
    assert.match(css, /scroll-behavior:auto!important/);
    assert.match(css, /@keyframes terminal-type/);
    assert.match(css, /@keyframes signal-travel/);
    assert.match(css, /:focus-visible/);
    assert.match(css, /--phosphor:#72f59d/);

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
    }
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
