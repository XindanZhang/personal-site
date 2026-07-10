import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
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
      "fonts/paper-mono.woff2",
      "fonts/PAPER-MONO-LICENSE.txt",
      "images/delta-force-yard-v2.webp",
      "images/vyron-cutout-v2.webp",
      "about/index.html",
      "projects/index.html",
      "games/index.html",
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
    assert.ok(statSync(resolve(outDir, "images", "delta-force-yard-v2.webp")).size < 150_000, "game background is too large for mobile");
    assert.ok(statSync(resolve(outDir, "images", "vyron-cutout-v2.webp")).size < 250_000, "Vyron cutout is too large for mobile");
    assert.equal(existsSync(resolve(outDir, "_next")), false, "Next.js assets remain in export");

    const homeHtml = readExport(outDir, "index.html");
    const notFoundHtml = readExport(outDir, "404.html");
    const projectsHtml = readExport(outDir, "projects", "index.html");
    const aboutHtml = readExport(outDir, "about", "index.html");
    const gamesHtml = readExport(outDir, "games", "index.html");
    const linksHtml = readExport(outDir, "bookmarks", "index.html");

    assert.match(homeHtml, /<h1[^>]*id="home-title"[^>]*>Xindan Zhang/);
    assert.match(homeHtml, /xindan@toronto:~\$/);
    assert.match(homeHtml, /profile --brief/);
    assert.match(homeHtml, /\[ OK \].*profile mounted/);
    assert.match(homeHtml, /network_systems :: tooling :: field_notes/);
    assert.match(homeHtml, /OPEN_TO_COLLABORATE/);
    assert.match(homeHtml, /\[01\].*\.\/work/);
    assert.match(homeHtml, /tail -n 3 ~\/writing\.log/i);
    assert.match(homeHtml, /tree ~\/research\/nextmini/i);
    assert.match(homeHtml, /inspect --practice/i);
    assert.match(homeHtml, /aria-label="Terminal ready"/);
    assert.match(homeHtml, /aria-current="page"/);
    assert.match(homeHtml, /id="main-content"/);
    assert.match(homeHtml, /Skip to content/);
    assert.match(homeHtml, /\/personal-site\/assets\//);
    assert.doesNotMatch(homeHtml, /network-field|abstract optical-glass/i);
    assert.match(notFoundHtml, /ERR 404 \/ NO ENTRY/);
    assert.doesNotMatch(notFoundHtml, /<script/);

    assert.match(projectsHtml, /Small systems, inspected closely/);
    assert.match(projectsHtml, /NEXTMINI \/ TOPOLOGY\.VIEW/);
    assert.match(projectsHtml, /\/personal-site\/figures\/nextmini-topology\.svg/);
    assert.match(projectsHtml, /TanStack Start notebook/);

    assert.match(aboutHtml, /I make technical behavior easier to see and revisit/);
    assert.match(aboutHtml, /IDENTITY\.REC/);
    assert.match(aboutHtml, /A practical systems stack/);
    assert.match(aboutHtml, /Copy email/);

    assert.match(gamesHtml, /<title>Vyron \| Game Zone<\/title>/);
    assert.match(gamesHtml, /<h1[^>]*id="game-zone-title"[^>]*><span>OPERATOR 07<\/span>VYRON<\/h1>/);
    assert.match(gamesHtml, /delta-force-yard-v2\.webp/);
    assert.match(gamesHtml, /vyron-cutout-v2\.webp/);
    assert.match(gamesHtml, /game-scene-fallback/);
    assert.match(gamesHtml, /vyron@gti/);
    assert.match(gamesHtml, /gti:\/\/operator/);
    assert.match(gamesHtml, /ASSAULT \/ ACTIVE/);
    assert.match(gamesHtml, /DASH/);
    assert.match(gamesHtml, /QLL32/);
    assert.match(gamesHtml, /MAG/);
    assert.doesNotMatch(gamesHtml, /XINDAN|xindan@toronto|A personal field terminal|Combined-arms scale|Extract with intent|Campaign pressure/);
    assert.match(gamesHtml, /href="\/personal-site\/games\/"[^>]*aria-current="page"/);

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
    const notFoundHtml = readExport(outDir, "404.html");
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

    assert.match(css, /@font-face/);
    assert.match(css, /Paper Mono/);
    assert.match(css, /\/personal-site\/fonts\/paper-mono\.woff2/);
    assert.doesNotMatch(css, /IBM Plex/);
    assert.match(css, /backdrop-filter:blur\(10px\)/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)/);
    assert.match(css, /scroll-behavior:auto!important/);
    assert.match(css, /\.game-scene/);
    assert.match(css, /touch-action:none/);
    assert.match(css, /\.vyron-kit/);
    assert.match(css, /:focus-visible/);
    assert.match(css, /--phosphor:#73f59f/);
    assert.match(notFoundHtml, /Paper Mono/);
    assert.match(notFoundHtml, /\/personal-site\/fonts\/paper-mono\.woff2/);
    assert.match(notFoundHtml, /xindan@toronto/);

    const htmlFiles = [];
    const walk = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = resolve(directory, entry.name);
        if (entry.isDirectory()) walk(entryPath);
        if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(entryPath);
      }
    };
    walk(outDir);
    assert.equal(htmlFiles.filter((file) => file.endsWith("index.html")).length, 47);

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
