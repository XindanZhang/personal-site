import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function buildSite() {
  const outDir = mkdtempSync(resolve(tmpdir(), "personal-site-test-"));

  execFileSync("npm", ["run", "build", "--", "--outDir", outDir], {
    cwd: rootDir,
    stdio: "pipe",
  });

  return outDir;
}

test("build creates blog index and individual blog post pages with mono archive chrome", () => {
  const outDir = buildSite();

  const nextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini", "index.md");
  const oldNextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini.md");
  try {
    const blogIndexPath = resolve(outDir, "blog", "index.html");
    const nextminiSeriesPath = resolve(outDir, "blog", "series", "nextmini", "index.html");
    const nextminiPostPath = resolve(
      outDir,
      "blog",
      "nextmini",
      "controller-interface",
      "index.html",
    );
    const blogPostPath = resolve(outDir, "blog", "create-blog-website-using-jekyll", "index.html");

    assert.equal(existsSync(nextminiSourcePath), true);
    assert.equal(existsSync(oldNextminiSourcePath), false);
    assert.equal(existsSync(blogIndexPath), true);
    assert.equal(existsSync(nextminiSeriesPath), true);
    assert.equal(existsSync(nextminiPostPath), true);
    assert.equal(existsSync(blogPostPath), true);

    const blogIndexHtml = readFileSync(blogIndexPath, "utf8");
    const nextminiSeriesHtml = readFileSync(nextminiSeriesPath, "utf8");
    const nextminiPostHtml = readFileSync(nextminiPostPath, "utf8");
    const blogPostHtml = readFileSync(blogPostPath, "utf8");
    assert.match(blogIndexHtml, /IBM\+Plex\+Mono/);
    assert.match(blogIndexHtml, /class="site-header"/);
    assert.match(blogIndexHtml, /class="color-strip"/);
    assert.match(blogIndexHtml, /Archive overview/);
    assert.match(blogIndexHtml, /class="post-table"/);
    assert.match(blogIndexHtml, /La Terminal/);
    assert.match(blogIndexHtml, /Nextmini series/);
    assert.match(nextminiSeriesHtml, /Series overview/);
    assert.match(nextminiSeriesHtml, /Official site/);
    assert.match(nextminiSeriesHtml, /https:\/\/nextmini\.org\//);
    assert.match(nextminiSeriesHtml, /Part 4/);
    assert.match(nextminiPostHtml, /Back to Blog/);
    assert.match(nextminiPostHtml, /Copy Link/);
    assert.match(nextminiPostHtml, /TABLE OF CONTENTS/);
    assert.match(nextminiPostHtml, /Controller interface/);
    assert.match(nextminiPostHtml, /Official site/);
    assert.match(nextminiPostHtml, /https:\/\/nextmini\.org\//);
    assert.match(blogPostHtml, /Back to Blog/);
    assert.match(blogPostHtml, /TABLE OF CONTENTS/);
    assert.doesNotMatch(blogIndexHtml, />XZ</);
    assert.doesNotMatch(blogPostHtml, />XZ</);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("home page uses the AprilNEA-inspired framed shell", () => {
  const outDir = buildSite();

  try {
    const homePagePath = resolve(outDir, "index.html");
    const homePageHtml = readFileSync(homePagePath, "utf8");

    assert.match(homePageHtml, /IBM\+Plex\+Mono/);
    assert.match(homePageHtml, /class="site-header"/);
    assert.match(homePageHtml, /class="nav-tab is-active"/);
    assert.match(homePageHtml, /Recent writing/);
    assert.match(homePageHtml, /class="home-grid"/);
    assert.match(homePageHtml, /class="note-panel"/);
    assert.match(homePageHtml, /class="post-table"/);
    assert.match(homePageHtml, /href="\/personal-site\/blog\/"/);
    assert.match(homePageHtml, /Browse archive/);
    assert.match(homePageHtml, /mailto:xindan\.zhang@mail\.utoronto\.ca/);
    assert.doesNotMatch(homePageHtml, />XZ</);
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
