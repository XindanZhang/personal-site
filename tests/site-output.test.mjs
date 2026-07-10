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

  execFileSync("npm", args, options);
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

test("production export contains the redesigned portfolio and all routes", () => {
  const outDir = buildSite();

  try {
    const requiredFiles = [
      ".nojekyll",
      "index.html",
      "network-field.webp",
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

    const homeHtml = readExport(outDir, "index.html");
    const projectsHtml = readExport(outDir, "projects", "index.html");
    const aboutHtml = readExport(outDir, "about", "index.html");
    const linksHtml = readExport(outDir, "bookmarks", "index.html");

    assert.match(homeHtml, /<h1[^>]*>\s*Xindan Zhang[\s\S]*\(Cindy\)/);
    assert.match(homeHtml, /Networking \/ systems \/ tooling/);
    assert.match(homeHtml, /network-field\.webp/);
    assert.match(homeHtml, /alt="An abstract optical-glass network/);
    assert.match(homeHtml, /aria-current="page"[^>]*>Home</);
    assert.match(homeHtml, /Explore my work/);
    assert.match(homeHtml, /Inside Nextmini/);
    assert.match(homeHtml, /Field notes/);
    assert.match(homeHtml, /Available for thoughtful collaboration/);
    assert.match(homeHtml, /id="main-content"/);
    assert.match(homeHtml, /Skip to content/);
    assert.match(homeHtml, /\/personal-site\/_next\/static\//);
    assert.match(homeHtml, /\/personal-site\/network-field\.webp/);

    assert.match(projectsHtml, /Small systems, inspected closely/);
    assert.match(projectsHtml, /Nextmini Research Notes/);
    assert.match(projectsHtml, /View source/);
    assert.match(projectsHtml, /aria-current="page"[^>]*>Work</);

    assert.match(aboutHtml, /I make technical behavior easier to see and revisit/);
    assert.match(aboutHtml, /Xindan Zhang, and I also go by Cindy/);
    assert.match(aboutHtml, /A practical systems stack/);
    assert.match(aboutHtml, /Copy email/);

    assert.match(linksHtml, /A small index, kept deliberately useful/);
    assert.match(linksHtml, /Nextmini/);
    assert.match(linksHtml, /nextmini\.org/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("writing UI, article metadata, and motion accessibility survive static export", () => {
  const outDir = buildSite();

  try {
    const blogHtml = readExport(outDir, "blog", "index.html");
    const articleHtml = readExport(outDir, "blog", "nextmini", "controller-interface", "index.html");
    const cssFile = readdirSync(resolve(outDir, "_next", "static", "chunks")).find((file) => file.endsWith(".css"));
    assert.ok(cssFile, "missing CSS bundle");
    const css = readExport(outDir, "_next", "static", "chunks", cssFile);

    assert.match(blogHtml, /Field notes from inside the system/);
    assert.match(blogHtml, /type="search"/);
    assert.match(blogHtml, /Search titles, topics, or tags/);
    assert.match(blogHtml, /Browse tags/);
    assert.match(blogHtml, /aria-current="page"[^>]*>Writing</);
    assert.match(blogHtml, /Ethernet 1500B and Jumbo 9000/);

    assert.match(articleHtml, /<title>Controller interface \| Xindan Zhang<\/title>/);
    assert.match(articleHtml, /name="description" content=/);
    assert.match(articleHtml, /property="og:type" content="article"/);
    assert.match(articleHtml, /class="reading-progress"/);
    assert.match(articleHtml, /On this page/);
    assert.match(articleHtml, /Copy link/);
    assert.match(articleHtml, /Controller interface/);
    assert.match(articleHtml, /nextmini\.org/);

    assert.match(css, /backdrop-filter:blur\(22px\)/);
    assert.match(css, /@media\s*\(prefers-reduced-motion:reduce\)/);
    assert.match(css, /scroll-behavior:auto/);
    assert.match(css, /@keyframes hero-drift/);
    assert.match(css, /@keyframes liquid-sweep/);
    assert.match(css, /focus-visible/);
    assert.match(css, /--font-mono:var\(--font-ibm-plex-mono\)/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
