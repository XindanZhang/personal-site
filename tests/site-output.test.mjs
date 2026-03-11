import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function buildSite() {
  execFileSync("npm", ["run", "build"], {
    cwd: rootDir,
    stdio: "pipe",
  });
}

test("build creates blog index and individual blog post pages", () => {
  buildSite();

  const blogIndexPath = resolve(rootDir, "docs", "blog", "index.html");
  const blogPostPath = resolve(
    rootDir,
    "docs",
    "blog",
    "create-blog-website-using-jekyll",
    "index.html",
  );

  assert.equal(existsSync(blogIndexPath), true);
  assert.equal(existsSync(blogPostPath), true);

  const blogIndexHtml = readFileSync(blogIndexPath, "utf8");
  const blogPostHtml = readFileSync(blogPostPath, "utf8");
  assert.match(blogIndexHtml, /Create blog website using Jekyll/);
  assert.match(blogIndexHtml, /The day of the Jackal/);
  assert.match(blogPostHtml, /Published September 27, 2024/);
  assert.doesNotMatch(blogIndexHtml, />XZ</);
  assert.doesNotMatch(blogPostHtml, />XZ</);
});

test("home page highlights writing and no longer ships placeholder content", () => {
  buildSite();

  const homePagePath = resolve(rootDir, "docs", "index.html");
  const homePageHtml = readFileSync(homePagePath, "utf8");

  assert.match(homePageHtml, /Selected writing/);
  assert.match(homePageHtml, /Mininet notes/);
  assert.match(homePageHtml, /Writing · Notes · Links/);
  assert.match(homePageHtml, /href="\/personal-site\/blog\/"/);
  assert.match(homePageHtml, /cabinet-grotesk/);
  assert.match(homePageHtml, /switzer/);
  assert.doesNotMatch(homePageHtml, />XZ</);
  assert.doesNotMatch(homePageHtml, /clash-display/);
  assert.doesNotMatch(homePageHtml, /satoshi/);
  assert.doesNotMatch(homePageHtml, /Placeholder bio/);
  assert.doesNotMatch(homePageHtml, /Project Placeholder/);
  assert.doesNotMatch(homePageHtml, /Personal website/);
  assert.doesNotMatch(homePageHtml, /PhD student in networking and distributed systems/);
  assert.doesNotMatch(homePageHtml, /Agent Memory Observatory/);
  assert.doesNotMatch(homePageHtml, /Oracle/);
  assert.doesNotMatch(homePageHtml, /kvcache/);
});
