import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
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

test("build exports a terminal-native Next.js site structure", () => {
  const outDir = buildSite();

  const nextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini", "index.md");
  const oldNextminiSourcePath = resolve(rootDir, "src", "content", "blog", "nextmini.md");
  try {
    const noJekyllPath = resolve(outDir, ".nojekyll");
    const nextStaticDir = resolve(outDir, "_next", "static");
    const cssBundlePath = resolve(
      outDir,
      "_next",
      "static",
      "chunks",
      readdirSync(resolve(outDir, "_next", "static", "chunks")).find((file) => file.endsWith(".css")) ?? "",
    );
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
    assert.equal(existsSync(cssBundlePath), true);
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
    const cssBundle = readFileSync(cssBundlePath, "utf8");
    assert.match(cssBundle, /Berkeley Mono/);
    assert.doesNotMatch(cssBundle, /Space Grotesk/);
    assert.doesNotMatch(cssBundle, /Newsreader/);
    assert.match(cssBundle, /#282828/i);
    assert.match(cssBundle, /#ebdbb2/i);
    assert.match(cssBundle, /#98971a/i);
    assert.match(cssBundle, /#d79921/i);
    assert.match(cssBundle, /#458588/i);
    assert.match(cssBundle, /#fbf1c7/i);
    assert.match(cssBundle, /font-variant-numeric:tabular-nums/i);
    assert.match(cssBundle, /focus-visible/i);
    assert.match(cssBundle, /@keyframes terminal-type/i);
    assert.match(cssBundle, /@keyframes terminal-reveal/i);
    assert.doesNotMatch(cssBundle, /#8fb996/i);
    assert.doesNotMatch(cssBundle, /#c5a46d/i);
    assert.doesNotMatch(cssBundle, /#f5f2e9/i);
    assert.doesNotMatch(cssBundle, /#c8f6ff/i);
    assert.doesNotMatch(cssBundle, /#d8d0ff/i);
    assert.doesNotMatch(cssBundle, /#ffd1ec/i);
    assert.match(blogIndexHtml, /\/personal-site\/_next\/static\//);
    assert.doesNotMatch(blogIndexHtml, /\/personal-site\/_astro\//);
    assert.match(blogIndexHtml, /mode-terminal/);
    assert.match(blogIndexHtml, /class="site-shell/);
    assert.match(blogIndexHtml, /class="shell-window/);
    assert.match(blogIndexHtml, /class="prompt-section/);
    assert.match(blogIndexHtml, /class="archive-ledger/);
    assert.match(blogIndexHtml, /Theme/);
    assert.match(blogIndexHtml, /Dark/);
    assert.match(blogIndexHtml, /Light/);
    assert.match(blogIndexHtml, /Cindy/);
    assert.doesNotMatch(blogIndexHtml, /Cindy Zhang/);
    assert.match(blogIndexHtml, /ls \/journal\/categories/);
    assert.match(blogIndexHtml, /ls \/journal\/tags/);
    assert.match(blogIndexHtml, /ls -ltr \/journal/);
    assert.match(blogIndexHtml, /La Terminal/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/category\/nextmini-series\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/tag\/nextmini\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/projects\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/friends\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/about\/"/);
    assert.match(categoryHtml, /pwd: \/journal\/category\/nextmini-series/);
    assert.match(categoryHtml, /Part 4/);
    assert.match(tagHtml, /pwd: \/journal\/tag\/nextmini/);
    assert.match(nextminiSeriesHtml, /cat \/journal\/series\/nextmini\.txt/);
    assert.match(nextminiSeriesHtml, /source_url/);
    assert.match(nextminiSeriesHtml, /https:\/\/nextmini\.org\//);
    assert.match(nextminiSeriesHtml, /Part 4/);
    assert.match(nextminiPostHtml, /cat \/journal\/nextmini\/controller-interface\.md/);
    assert.match(nextminiPostHtml, /Copy Link/);
    assert.match(nextminiPostHtml, /grep '\^##' .\/controller-interface\.md/);
    assert.match(nextminiPostHtml, /Controller interface/);
    assert.match(nextminiPostHtml, /source_url/);
    assert.match(nextminiPostHtml, /https:\/\/nextmini\.org\//);
    assert.match(blogPostHtml, /cat \/journal\/create-blog-website-using-jekyll\.md/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/featured/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/active/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/archive/);
    assert.match(projectsHtml, /class="project-ledger"/);
    assert.match(projectsHtml, /class="project-ledger-row"/);
    assert.match(projectsHtml, /class="project-ledger-name"/);
    assert.match(projectsHtml, /class="project-ledger-action"/);
    assert.doesNotMatch(projectsHtml, /class="project-card"/);
    assert.match(friendsHtml, /cat \/etc\/bookmarks\.txt/);
    assert.match(friendsHtml, /A small ring of sites and tools I revisit/);
    assert.match(aboutHtml, /cat \/home\/xindan\/README/);
    assert.match(aboutHtml, /ls \/home\/xindan\/skills/);
    assert.match(aboutHtml, /history \| tail -n 3/);
    assert.match(aboutHtml, /I am Cindy\./);
    assert.doesNotMatch(blogIndexHtml, /Archive stream/);
    assert.doesNotMatch(blogIndexHtml, />XZ</);
    assert.doesNotMatch(blogPostHtml, />XZ</);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});

test("home page uses a prompt-and-output terminal layout", () => {
  const outDir = buildSite();

  try {
    const homePagePath = resolve(outDir, "index.html");
    const homePageHtml = readFileSync(homePagePath, "utf8");

    assert.match(homePageHtml, /\/personal-site\/_next\/static\//);
    assert.match(homePageHtml, /mode-terminal/);
    assert.match(homePageHtml, /class="site-shell/);
    assert.match(homePageHtml, /class="shell-window/);
    assert.match(homePageHtml, /class="prompt-section/);
    assert.match(homePageHtml, /class="prompt-line/);
    assert.match(homePageHtml, /class="terminal-output/);
    assert.match(homePageHtml, /class="terminal-caret/);
    assert.match(homePageHtml, /class="prompt-userhost"/);
    assert.match(homePageHtml, /class="prompt-path"/);
    assert.match(homePageHtml, /class="terminal-listing"/);
    assert.match(homePageHtml, /prompt-line is-typed/);
    assert.match(homePageHtml, /prompt-command-typing/);
    assert.match(homePageHtml, /--type-delay:140ms/);
    assert.match(homePageHtml, /--type-delay:420ms/);
    assert.match(homePageHtml, /--type-delay:760ms/);
    assert.match(homePageHtml, /whoami/);
    assert.match(homePageHtml, /ls \/workspace/);
    assert.match(homePageHtml, /tail -n 5 \/journal\/index\.log/);
    assert.match(homePageHtml, /cat \/status\/now\.txt/);
    assert.match(homePageHtml, /xindan@toronto-node/);
    assert.match(homePageHtml, /:~\$/);
    assert.match(homePageHtml, /:~\/workspace\$/);
    assert.match(homePageHtml, /drwxr-xr-x/);
    assert.match(homePageHtml, /-rw-r--r--/);
    assert.match(homePageHtml, /journal\//);
    assert.match(homePageHtml, /projects\//);
    assert.match(homePageHtml, /friends\//);
    assert.match(homePageHtml, /about\//);
    assert.match(homePageHtml, /Theme/);
    assert.match(homePageHtml, /Dark/);
    assert.match(homePageHtml, /Light/);
    assert.match(homePageHtml, /Cindy/);
    assert.doesNotMatch(homePageHtml, /Cindy Zhang/);
    assert.match(homePageHtml, /href="\/personal-site\/blog\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/projects\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/friends\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/about\/"/);
    assert.match(homePageHtml, /Available for thoughtful collaboration/);
    assert.match(homePageHtml, /mailto:xindan\.zhang@mail\.utoronto\.ca/);
    assert.doesNotMatch(homePageHtml, /orbital-hero/);
    assert.doesNotMatch(homePageHtml, /desk-card/);
    assert.doesNotMatch(homePageHtml, /directory-entry/);
    assert.doesNotMatch(homePageHtml, /Signal map/);
    assert.doesNotMatch(homePageHtml, /Dock/);
    assert.doesNotMatch(homePageHtml, /launch notebook --mode universe/);
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
