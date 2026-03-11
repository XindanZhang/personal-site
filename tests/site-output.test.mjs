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

  const nextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini", "index.md");
  const oldNextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini.md");
  const blogIndexPath = resolve(rootDir, "docs", "blog", "index.html");
  const nextminiSeriesPath = resolve(rootDir, "docs", "blog", "series", "nextmini", "index.html");
  const nextminiPostPath = resolve(rootDir, "docs", "blog", "nextmini", "index.html");
  const blogPostPath = resolve(
    rootDir,
    "docs",
    "blog",
    "create-blog-website-using-jekyll",
    "index.html",
  );

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
  assert.match(blogIndexHtml, /Create blog website using Jekyll/);
  assert.match(blogIndexHtml, /The day of the Jackal/);
  assert.match(blogIndexHtml, /Nextmini series/);
  assert.match(nextminiSeriesHtml, /Nextmini series/);
  assert.match(nextminiSeriesHtml, /Official site/);
  assert.match(nextminiSeriesHtml, /https:\/\/nextmini\.org\//);
  assert.match(nextminiSeriesHtml, /Nextmini Website/);
  assert.match(nextminiPostHtml, /Nextmini Website/);
  assert.match(nextminiPostHtml, /Part of the Nextmini series/);
  assert.match(nextminiPostHtml, /Official site/);
  assert.match(nextminiPostHtml, /https:\/\/nextmini\.org\//);
  assert.match(blogPostHtml, /Published September 27, 2024/);
  assert.doesNotMatch(blogIndexHtml, />XZ</);
  assert.doesNotMatch(blogPostHtml, />XZ</);
});

test("home page highlights writing and no longer ships placeholder content", () => {
  buildSite();

  const homePagePath = resolve(rootDir, "docs", "index.html");
  const homePageHtml = readFileSync(homePagePath, "utf8");

  assert.match(homePageHtml, /Selected writing/);
  assert.match(homePageHtml, /Nextmini Website/);
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
