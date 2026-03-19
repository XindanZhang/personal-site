import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function buildSite() {
  const outDir = mkdtempSync(resolve(rootDir, ".tmp-personal-site-test-"));

  execFileSync("npm", ["run", "build"], {
    cwd: rootDir,
    stdio: "pipe",
    env: { ...process.env, DOCS_OUT_DIR: relative(rootDir, outDir) },
  });

  return outDir;
}

test("build exports a Next.js app with the full primary site structure", () => {
  const outDir = buildSite();

  const nextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini", "index.md");
  const oldNextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini.md");
  try {
    const noJekyllPath = resolve(outDir, ".nojekyll");
    const nextStaticDir = resolve(outDir, "_next", "static");
    const blogIndexPath = resolve(outDir, "blog", "index.html");
    const categoryPath = resolve(outDir, "blog", "category", "nextmini-series", "index.html");
    const tagPath = resolve(outDir, "blog", "tag", "nextmini", "index.html");
    const nextminiSeriesPath = resolve(outDir, "blog", "series", "nextmini", "index.html");
    const nextminiPostPath = resolve(
      outDir,
      "blog",
      "nextmini",
      "controller-interface",
      "index.html",
    );
    const blogPostPath = resolve(outDir, "blog", "create-blog-website-using-jekyll", "index.html");
    const projectsPath = resolve(outDir, "projects", "index.html");
    const friendsPath = resolve(outDir, "friends", "index.html");
    const aboutPath = resolve(outDir, "about", "index.html");

    assert.equal(existsSync(nextminiSourcePath), true);
    assert.equal(existsSync(oldNextminiSourcePath), false);
    assert.equal(existsSync(noJekyllPath), true);
    assert.equal(existsSync(nextStaticDir), true);
    assert.equal(existsSync(blogIndexPath), true);
    assert.equal(existsSync(categoryPath), true);
    assert.equal(existsSync(tagPath), true);
    assert.equal(existsSync(nextminiSeriesPath), true);
    assert.equal(existsSync(nextminiPostPath), true);
    assert.equal(existsSync(blogPostPath), true);
    assert.equal(existsSync(projectsPath), true);
    assert.equal(existsSync(friendsPath), true);
    assert.equal(existsSync(aboutPath), true);

    const blogIndexHtml = readFileSync(blogIndexPath, "utf8");
    const categoryHtml = readFileSync(categoryPath, "utf8");
    const tagHtml = readFileSync(tagPath, "utf8");
    const nextminiSeriesHtml = readFileSync(nextminiSeriesPath, "utf8");
    const nextminiPostHtml = readFileSync(nextminiPostPath, "utf8");
    const blogPostHtml = readFileSync(blogPostPath, "utf8");
    const projectsHtml = readFileSync(projectsPath, "utf8");
    const friendsHtml = readFileSync(friendsPath, "utf8");
    const aboutHtml = readFileSync(aboutPath, "utf8");
    assert.match(blogIndexHtml, /\/personal-site\/_next\/static\//);
    assert.doesNotMatch(blogIndexHtml, /\/personal-site\/_astro\//);
    assert.match(blogIndexHtml, /mode-cosmos/);
    assert.match(blogIndexHtml, /class="site-shell/);
    assert.match(blogIndexHtml, /class="archive-ledger/);
    assert.match(blogIndexHtml, /class="archive-filter/);
    assert.match(blogIndexHtml, /Theme/);
    assert.match(blogIndexHtml, /Dark/);
    assert.match(blogIndexHtml, /Light/);
    assert.match(blogIndexHtml, /Filter threads/);
    assert.match(blogIndexHtml, /Signal tags/);
    assert.match(blogIndexHtml, /Archive stream/);
    assert.match(blogIndexHtml, /La Terminal/);
    assert.match(blogIndexHtml, /Nextmini Website/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/category\/nextmini-series\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/tag\/nextmini\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/projects\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/friends\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/about\/"/);
    assert.match(categoryHtml, /Thread: Nextmini series/);
    assert.match(categoryHtml, /Part 4/);
    assert.match(tagHtml, /Keyword: #nextmini/);
    assert.match(nextminiSeriesHtml, /Series overview/);
    assert.match(nextminiSeriesHtml, /Official site/);
    assert.match(nextminiSeriesHtml, /https:\/\/nextmini\.org\//);
    assert.match(nextminiSeriesHtml, /Part 4/);
    assert.match(nextminiPostHtml, /Journal/);
    assert.match(nextminiPostHtml, /Copy Link/);
    assert.match(nextminiPostHtml, /On this page/);
    assert.match(nextminiPostHtml, /Controller interface/);
    assert.match(nextminiPostHtml, /Official site/);
    assert.match(nextminiPostHtml, /https:\/\/nextmini\.org\//);
    assert.match(blogPostHtml, /Journal/);
    assert.match(projectsHtml, /Selected work/);
    assert.match(projectsHtml, /In progress/);
    assert.match(projectsHtml, /Past shelves/);
    assert.match(friendsHtml, /Reading list/);
    assert.match(friendsHtml, /A small ring of sites and tools I revisit/);
    assert.match(aboutHtml, /Practice/);
    assert.match(aboutHtml, /Timeline/);
    assert.match(aboutHtml, /Elsewhere/);
    assert.doesNotMatch(blogIndexHtml, /Browse by thread/);
    assert.doesNotMatch(blogIndexHtml, /Archive ledger/);
    assert.doesNotMatch(blogIndexHtml, />XZ</);
    assert.doesNotMatch(blogPostHtml, />XZ</);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("home page uses the cosmic cyber shell", () => {
  const outDir = buildSite();

  try {
    const homePagePath = resolve(outDir, "index.html");
    const homePageHtml = readFileSync(homePagePath, "utf8");

    assert.match(homePageHtml, /\/personal-site\/_next\/static\//);
    assert.match(homePageHtml, /mode-cosmos/);
    assert.match(homePageHtml, /class="site-shell/);
    assert.match(homePageHtml, /class="orbital-hero/);
    assert.match(homePageHtml, /class="terminal-panel/);
    assert.match(homePageHtml, /class="signal-panel/);
    assert.match(homePageHtml, /class="terminal-prompt/);
    assert.match(homePageHtml, /class="terminal-caret/);
    assert.match(homePageHtml, /A working notebook for systems, experiments, and careful notes/);
    assert.match(homePageHtml, /Signal map/);
    assert.match(homePageHtml, /Current threads/);
    assert.match(homePageHtml, /Dock/);
    assert.match(homePageHtml, /Open journal/);
    assert.match(homePageHtml, /Browse projects/);
    assert.match(homePageHtml, /Theme/);
    assert.match(homePageHtml, /Dark/);
    assert.match(homePageHtml, /Light/);
    assert.match(homePageHtml, /href="\/personal-site\/blog\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/projects\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/friends\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/about\/"/);
    assert.match(homePageHtml, /Available for thoughtful collaboration/);
    assert.match(homePageHtml, /mailto:xindan\.zhang@mail\.utoronto\.ca/);
    assert.doesNotMatch(homePageHtml, /Selected writing/);
    assert.doesNotMatch(homePageHtml, /Open the archive/);
    assert.doesNotMatch(homePageHtml, /See projects/);
    assert.doesNotMatch(homePageHtml, />XZ</);
    assert.doesNotMatch(homePageHtml, /\/personal-site\/_astro\//);
    assert.doesNotMatch(homePageHtml, /cabinet-grotesk/);
    assert.doesNotMatch(homePageHtml, /switzer/);
    assert.doesNotMatch(homePageHtml, /Placeholder bio/);
    assert.doesNotMatch(homePageHtml, /Project Placeholder/);
    assert.doesNotMatch(homePageHtml, /Personal website/);
    assert.doesNotMatch(homePageHtml, /PhD student in networking and distributed systems/);
    assert.doesNotMatch(homePageHtml, /Agent Memory Observatory/);
    assert.doesNotMatch(homePageHtml, /Oracle/);
    assert.doesNotMatch(homePageHtml, /kvcache/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
