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

test("the Vyron scene waits for shaders and survives WebGL recovery", () => {
  const source = readFileSync(resolve(rootDir, "src", "lib", "game-scene.ts"), "utf8");
  const compileCalls = source.match(/await renderer\.compileAsync\(scene, camera\)/g) ?? [];

  assert.equal(compileCalls.length, 2, "initial render and context restore must both await shaders");
  assert.match(source, /webglcontextlost/);
  assert.match(source, /webglcontextrestored/);
  assert.match(source, /GLTFLoader/);
  assert.match(source, /OrbitControls/);
  assert.match(source, /modelUrl/);
  assert.match(source, /THREE\.TOUCH\.DOLLY_ROTATE/);
  assert.match(source, /setReducedMotion/);
  assert.doesNotMatch(source, /TextureLoader|backgroundUrl|operatorUrl/);
  assert.doesNotMatch(source, /preserveDrawingBuffer|forceContextLoss|THREE\.Clock/);
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
      "models/cosmic-operator.glb",
      "models/COSMIC-OPERATOR-LICENSE.txt",
      "about/index.html",
      "projects/index.html",
      "games/index.html",
      "interests/index.html",
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
    assert.ok(statSync(resolve(outDir, "models", "cosmic-operator.glb")).size < 2_500_000, "3D operator asset is too large");
    assert.equal(existsSync(resolve(outDir, "_next")), false, "Next.js assets remain in export");

    const homeHtml = readExport(outDir, "index.html");
    const notFoundHtml = readExport(outDir, "404.html");
    const projectsHtml = readExport(outDir, "projects", "index.html");
    const aboutHtml = readExport(outDir, "about", "index.html");
    const interestsHtml = readExport(outDir, "interests", "index.html");
    const legacyGamesHtml = readExport(outDir, "games", "index.html");
    const linksHtml = readExport(outDir, "bookmarks", "index.html");

    assert.match(homeHtml, /<h1[^>]*id="home-title"[^>]*><span>Xindan<\/span><span>Zhang\.<\/span><\/h1>/);
    assert.match(homeHtml, /Systems · Networks · Tools/);
    assert.match(homeHtml, /PhD student in Electrical &amp; Computer Engineering at U of T\./);
    assert.match(homeHtml, /U of T ECE/);
    assert.match(homeHtml, /View selected work/);
    assert.match(homeHtml, /Built to make behavior visible\./);
    assert.match(homeHtml, /Nextmini Code-Reading Notes/);
    assert.doesNotMatch(homeHtml, /Vyron|nextmini-topology|Available for collaboration|technical writer/);
    assert.match(homeHtml, /aria-label="Primary navigation"/);
    assert.match(homeHtml, /aria-label="Switch to dark theme"/);
    assert.match(homeHtml, /aria-controls="mobile-navigation"/);
    assert.match(homeHtml, /aria-label="Footer navigation"/);
    assert.match(homeHtml, /aria-current="page"/);
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

    assert.match(interestsHtml, /<title>Interests \| Xindan Zhang<\/title>/);
    assert.match(interestsHtml, /<h1[^>]*id="game-zone-title"[^>]*>VYRON<\/h1>/);
    assert.match(interestsHtml, /COSMIC GUARDIAN/);
    assert.match(interestsHtml, /QLL32/);
    assert.match(interestsHtml, /DYNAMIC AUXILIARY/);
    assert.match(interestsHtml, /game-scene-fallback/);
    assert.match(interestsHtml, /class="site-header is-game-header"/);
    assert.match(interestsHtml, /aria-label="Home"/);
    assert.match(interestsHtml, /models\/cosmic-operator\.glb/);
    assert.match(interestsHtml, /rel="canonical" href="https:\/\/xindanzhang\.github\.io\/personal-site\/interests\/"/);
    assert.doesNotMatch(interestsHtml, /gti:\/\/operator|OPERATOR 07|ASSAULT \/ ACTIVE|DASH|MAG|delta-force-yard|vyron-cutout|Have a systems problem worth making legible/);
    assert.match(legacyGamesHtml, /http-equiv="refresh" content="0; url=\/personal-site\/interests\/"/);
    assert.match(legacyGamesHtml, /name="robots" content="noindex"/);

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
    assert.match(css, /--font-sans:Arial/);
    assert.match(css, /--paper:#f7f7f8/);
    assert.match(css, /--blue:#1646ff/);
    assert.match(css, /\[data-theme=dark\]/);
    assert.match(css, /backdrop-filter:blur\(/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)/);
    assert.match(css, /scroll-behavior:auto!important/);
    assert.match(css, /animation:none!important/);
    assert.match(css, /overflow-wrap:anywhere/);
    assert.doesNotMatch(css, /\.site-main\{[^}]*overflow:clip/);
    assert.match(css, /@media\s*\(prefers-reduced-transparency:reduce\)/);
    assert.match(css, /animation:content-enter/);
    assert.match(css, /\.game-scene/);
    assert.match(css, /touch-action:none/);
    assert.match(css, /\.vyron-kit/);
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
    assert.equal(htmlFiles.filter((file) => file.endsWith("index.html")).length, 48);

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
