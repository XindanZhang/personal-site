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
    const ethernetPostPath = resolve(outDir, "blog", "ethernet-1500b-and-jumbo-9000", "index.html");
    const blogPostPath = resolve(outDir, "blog", "create-blog-website-using-jekyll", "index.html");
    const projectsPath = resolve(outDir, "projects", "index.html");
    const bookmarksPath = resolve(outDir, "bookmarks", "index.html");
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
    assert.equal(existsSync(ethernetPostPath), true);
    assert.equal(existsSync(blogPostPath), true);
    assert.equal(existsSync(projectsPath), true);
    assert.equal(existsSync(bookmarksPath), true);
    assert.equal(existsSync(resolve(outDir, "friends", "index.html")), false);
    assert.equal(existsSync(aboutPath), true);

    const blogIndexHtml = readFileSync(blogIndexPath, "utf8");
    const categoryHtml = readFileSync(categoryPath, "utf8");
    const tagHtml = readFileSync(tagPath, "utf8");
    const nextminiSeriesHtml = readFileSync(nextminiSeriesPath, "utf8");
    const nextminiPostHtml = readFileSync(nextminiPostPath, "utf8");
    const ethernetPostHtml = readFileSync(ethernetPostPath, "utf8");
    const blogPostHtml = readFileSync(blogPostPath, "utf8");
    const projectsHtml = readFileSync(projectsPath, "utf8");
    const bookmarksHtml = readFileSync(bookmarksPath, "utf8");
    const aboutHtml = readFileSync(aboutPath, "utf8");
    const cssBundle = readFileSync(cssBundlePath, "utf8");
    assert.match(cssBundle, /IBM Plex Mono/);
    assert.doesNotMatch(cssBundle, /Berkeley Mono/);
    assert.doesNotMatch(cssBundle, /Space Grotesk/);
    assert.doesNotMatch(cssBundle, /Newsreader/);
    assert.match(cssBundle, /#111216/i);
    assert.match(cssBundle, /#f5f5f7/i);
    assert.match(cssBundle, /#0a84ff/i);
    assert.match(cssBundle, /#64d2ff/i);
    assert.match(cssBundle, /#bf5af2/i);
    assert.match(cssBundle, /#0071e3/i);
    assert.match(cssBundle, /#0065cc/i);
    assert.match(cssBundle, /--block-journal:#64d2ff/i);
    assert.match(cssBundle, /--block-projects:#ff6482/i);
    assert.match(cssBundle, /--block-readme:#bf5af2/i);
    assert.match(cssBundle, /--section-color:var\(--block-journal\)/i);
    assert.match(cssBundle, /--section-color:var\(--block-projects\)/i);
    assert.match(cssBundle, /border-left:2px solid var\(--block-workspace\)/i);
    assert.match(cssBundle, /--sheen-a:/i);
    assert.match(cssBundle, /--sheen-b:/i);
    assert.match(cssBundle, /shell-footer\{[^}]*position:fixed/i);
    assert.doesNotMatch(cssBundle, /shell-footer\{[^}]*pointer-events:none/i);
    assert.match(cssBundle, /shell-main\{[^}]*padding:.9rem 1rem 7rem/i);
    assert.match(cssBundle, /font-variant-numeric:tabular-nums/i);
    assert.match(cssBundle, /focus-visible/i);
    assert.match(cssBundle, /counter-reset:prompt-line/i);
    assert.match(cssBundle, /counter\(prompt-line/i);
    assert.match(cssBundle, /@keyframes terminal-type/i);
    assert.match(cssBundle, /@keyframes terminal-reveal/i);
    assert.match(cssBundle, /@keyframes terminal-ambient/i);
    assert.match(cssBundle, /@keyframes terminal-sheen/i);
    assert.doesNotMatch(cssBundle, /#8fb996/i);
    assert.doesNotMatch(cssBundle, /#c5a46d/i);
    assert.doesNotMatch(cssBundle, /#f5f2e9/i);
    assert.doesNotMatch(cssBundle, /#c8f6ff/i);
    assert.doesNotMatch(cssBundle, /#d8d0ff/i);
    assert.doesNotMatch(cssBundle, /#ffd1ec/i);
    assert.doesNotMatch(cssBundle, /#0d1117/i);
    assert.doesNotMatch(cssBundle, /#e6edf3/i);
    assert.doesNotMatch(cssBundle, /#58a6ff/i);
    assert.doesNotMatch(cssBundle, /#79c0ff/i);
    assert.doesNotMatch(cssBundle, /#a371f7/i);
    assert.doesNotMatch(cssBundle, /#f6f8fa/i);
    assert.doesNotMatch(cssBundle, /#218bff/i);
    assert.match(blogIndexHtml, /\/personal-site\/_next\/static\//);
    assert.doesNotMatch(blogIndexHtml, /\/personal-site\/_astro\//);
    assert.match(blogIndexHtml, /mode-terminal/);
    assert.match(blogIndexHtml, /class="site-shell/);
    assert.match(blogIndexHtml, /class="shell-window/);
    assert.match(blogIndexHtml, /class="shell-statusbar"/);
    assert.doesNotMatch(blogIndexHtml, /class="terminal-nav"/);
    assert.doesNotMatch(blogIndexHtml, /class="terminal-nav-list"/);
    assert.match(blogIndexHtml, /class="journal-layout"/);
    assert.match(blogIndexHtml, /class="journal-sidebar"/);
    assert.match(blogIndexHtml, /class="journal-main"/);
    assert.match(blogIndexHtml, /ctx=blog/);
    assert.match(blogIndexHtml, /shell-statusbar-link is-f1/);
    assert.match(blogIndexHtml, /shell-statusbar-link is-f2/);
    assert.match(blogIndexHtml, /shell-statusbar-link is-f3/);
    assert.match(blogIndexHtml, /shell-statusbar-link is-f4/);
    assert.match(blogIndexHtml, /data-shell-shortcut="F1"/);
    assert.match(blogIndexHtml, /data-shell-shortcut="F2"/);
    assert.match(blogIndexHtml, /data-shell-shortcut="F3"/);
    assert.match(blogIndexHtml, /data-shell-shortcut="F4"/);
    assert.match(blogIndexHtml, /aria-keyshortcuts="F1"/);
    assert.match(blogIndexHtml, /shell-statusbar-key">F1</);
    assert.match(blogIndexHtml, /shell-statusbar-key">F2</);
    assert.match(blogIndexHtml, /cwd=~\/personal-site/);
    assert.match(blogIndexHtml, /page=.*\.\/blog\//);
    assert.match(blogIndexHtml, /class="prompt-section/);
    assert.match(blogIndexHtml, /class="archive-ledger/);
    assert.match(blogIndexHtml, /archive-category" style="background-color:#/i);
    assert.doesNotMatch(blogIndexHtml, /archive-category" style="background-color:transparent/i);
    assert.match(blogIndexHtml, /Theme/);
    assert.match(blogIndexHtml, /Dark/);
    assert.match(blogIndexHtml, /Light/);
    assert.match(blogIndexHtml, /class="masthead-link is-home"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/">Home</);
    assert.match(blogIndexHtml, /Cindy/);
    assert.doesNotMatch(blogIndexHtml, /Cindy Zhang/);
    assert.match(blogIndexHtml, /ls \/blog\/categories/);
    assert.match(blogIndexHtml, /ls \/blog\/tags/);
    assert.match(blogIndexHtml, /ls -ltr \/blog/);
    assert.match(blogIndexHtml, /La Terminal/);
    assert.match(blogIndexHtml, /Ethernet 1500B and Jumbo 9000/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/category\/nextmini-series\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/blog\/tag\/nextmini\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/projects\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/bookmarks\/"/);
    assert.match(blogIndexHtml, /href="\/personal-site\/about\/"/);
    assert.doesNotMatch(blogIndexHtml, /class="shell-nav-link/);
    assert.doesNotMatch(blogIndexHtml, />cd<\/span>/);
    assert.match(categoryHtml, /pwd: \/blog\/category\/nextmini-series/);
    assert.match(categoryHtml, /Part 4/);
    assert.match(tagHtml, /pwd: \/blog\/tag\/nextmini/);
    assert.match(nextminiSeriesHtml, /cat \/blog\/series\/nextmini\.txt/);
    assert.match(nextminiSeriesHtml, /source_url/);
    assert.match(nextminiSeriesHtml, /https:\/\/nextmini\.org\//);
    assert.match(nextminiSeriesHtml, /Part 4/);
    assert.match(nextminiPostHtml, /cat \/blog\/nextmini\/controller-interface\.md/);
    assert.match(nextminiPostHtml, /Copy Link/);
    assert.match(nextminiPostHtml, /grep '\^##' .\/controller-interface\.md/);
    assert.match(nextminiPostHtml, /Controller interface/);
    assert.match(nextminiPostHtml, /source_url/);
    assert.match(nextminiPostHtml, /https:\/\/nextmini\.org\//);
    assert.match(ethernetPostHtml, /cat \/blog\/ethernet-1500b-and-jumbo-9000\.md/);
    assert.match(ethernetPostHtml, /RFC 894/);
    assert.match(ethernetPostHtml, /1500 bytes/);
    assert.match(ethernetPostHtml, /9000 bytes/);
    assert.match(ethernetPostHtml, /jumbo frames are non-standardized/i);
    assert.match(blogPostHtml, /cat \/blog\/create-blog-website-using-jekyll\.md/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/featured/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/active/);
    assert.match(projectsHtml, /ls \/workspace\/projects\/archive/);
    assert.match(projectsHtml, /class="project-terminal"/);
    assert.match(projectsHtml, /class="project-terminal-summary"/);
    assert.match(projectsHtml, /class="project-terminal-groups"/);
    assert.match(projectsHtml, /class="project-ledger"/);
    assert.match(projectsHtml, /class="project-ledger-row"/);
    assert.match(projectsHtml, /class="project-ledger-name"/);
    assert.match(projectsHtml, /class="project-ledger-action"/);
    assert.match(projectsHtml, /project-ledger-column-meta/);
    assert.doesNotMatch(projectsHtml, /class="project-card"/);
    assert.match(bookmarksHtml, /cat \/etc\/bookmarks\.txt/);
    assert.match(bookmarksHtml, /A short list of bookmarks I still reopen/);
    assert.match(bookmarksHtml, /Nextmini/);
    assert.match(bookmarksHtml, /class="bookmark-terminal"/);
    assert.match(bookmarksHtml, /class="bookmark-list"/);
    assert.match(bookmarksHtml, /class="bookmark-row"/);
    assert.doesNotMatch(bookmarksHtml, /La Terminal/);
    assert.doesNotMatch(bookmarksHtml, /ArchWiki/);
    assert.doesNotMatch(bookmarksHtml, /GitHub Pages/);
    assert.match(aboutHtml, /sed -n '1,160p' README\.md/);
    assert.match(aboutHtml, /ls \/personal-site\//);
    assert.match(aboutHtml, /tail -n 6 ~\/\.local\/share\/site\.history/);
    assert.match(aboutHtml, /cat ~\/\.contacts/);
    assert.match(aboutHtml, /I am Cindy\./);
    assert.match(aboutHtml, /class="manpage-layout"/);
    assert.match(aboutHtml, /class="manpage-main"/);
    assert.match(aboutHtml, /class="manpage-sidebar"/);
    assert.match(aboutHtml, /class="readme-sheet"/);
    assert.match(aboutHtml, /class="readme-section"/);
    assert.match(aboutHtml, /class="readme-detail-list"/);
    assert.match(aboutHtml, /class="readme-detail-card"/);
    assert.match(aboutHtml, /class="readme-detail-label"/);
    assert.match(aboutHtml, /class="readme-detail-value"/);
    assert.match(aboutHtml, /class="readme-group-list"/);
    assert.match(aboutHtml, /class="readme-group"/);
    assert.match(aboutHtml, /class="readme-group-title"/);
    assert.match(aboutHtml, /class="readme-tag-list"/);
    assert.match(aboutHtml, /class="readme-tag"/);
    assert.match(aboutHtml, /class="readme-shortcuts"/);
    assert.match(aboutHtml, /readme-shortcut-row/);
    assert.match(aboutHtml, /readme-shortcut-link/);
    assert.match(aboutHtml, /site code \+ repos/);
    assert.match(aboutHtml, /class="readme-link-list"/);
    assert.match(aboutHtml, /readme-link-stack/);
    assert.match(aboutHtml, /readme-link-target/);
    assert.match(aboutHtml, /readme-link-meta/);
    assert.match(aboutHtml, />XindanZhang</);
    assert.match(aboutHtml, />mail\.utoronto\.ca</);
    assert.match(aboutHtml, /href="\/personal-site\/projects\/"/);
    assert.doesNotMatch(aboutHtml, /Rust \/ TypeScript \/ Python \/ Shell \/ C/);
    assert.doesNotMatch(aboutHtml, /class="readme-grid"/);
    assert.doesNotMatch(aboutHtml, /class="readme-outline"/);
    assert.doesNotMatch(aboutHtml, /grep -n '\^##' README\.md/);
    assert.doesNotMatch(aboutHtml, /class="practice-card"/);
    assert.doesNotMatch(aboutHtml, /class="practice-grid"/);
    assert.doesNotMatch(aboutHtml, /class="button-link is-secondary"/);
    assert.doesNotMatch(aboutHtml, /class="shell-nav-link"/);
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
    assert.match(homePageHtml, /class="shell-statusbar"/);
    assert.doesNotMatch(homePageHtml, /class="terminal-nav"/);
    assert.doesNotMatch(homePageHtml, /class="terminal-nav-list"/);
    assert.match(homePageHtml, /class="terminal-dashboard"/);
    assert.match(homePageHtml, /class="shell-columns"/);
    assert.match(homePageHtml, /class="shell-column is-identity"/);
    assert.match(homePageHtml, /class="shell-column is-log"/);
    assert.match(homePageHtml, /class="identity-grid"/);
    assert.match(homePageHtml, /class="workspace-tree"/);
    assert.match(homePageHtml, /class="workspace-tree-row"/);
    assert.match(homePageHtml, /class="workspace-tree-target"/);
    assert.match(homePageHtml, /class="workspace-tree-tag"/);
    assert.match(homePageHtml, /class="journal-headlines"/);
    assert.match(homePageHtml, /class="journal-headline-row"/);
    assert.match(homePageHtml, /ctx=home/);
    assert.match(homePageHtml, /class="masthead-link is-home"/);
    assert.match(homePageHtml, /href="\/personal-site\/">Home</);
    assert.match(homePageHtml, /shell-statusbar-link is-f1/);
    assert.match(homePageHtml, /shell-statusbar-link is-f2/);
    assert.match(homePageHtml, /shell-statusbar-link is-f3/);
    assert.match(homePageHtml, /shell-statusbar-link is-f4/);
    assert.match(homePageHtml, /data-shell-shortcut="F1"/);
    assert.match(homePageHtml, /data-shell-shortcut="F2"/);
    assert.match(homePageHtml, /data-shell-shortcut="F3"/);
    assert.match(homePageHtml, /data-shell-shortcut="F4"/);
    assert.match(homePageHtml, /class="prompt-section/);
    assert.match(homePageHtml, /class="prompt-line/);
    assert.match(homePageHtml, /class="terminal-output/);
    assert.match(homePageHtml, /class="terminal-caret/);
    assert.match(homePageHtml, /class="prompt-userhost"/);
    assert.match(homePageHtml, /class="prompt-path"/);
    assert.doesNotMatch(homePageHtml, /class="terminal-listing"/);
    assert.match(homePageHtml, /prompt-line is-typed/);
    assert.match(homePageHtml, /prompt-command-typing/);
    assert.match(homePageHtml, /--type-delay:140ms/);
    assert.match(homePageHtml, /--type-delay:420ms/);
    assert.match(homePageHtml, /--type-delay:760ms/);
    assert.match(homePageHtml, /whoami/);
    assert.match(homePageHtml, /tree -L 1 \/workspace/);
    assert.match(homePageHtml, /tail -n 4 \/blog\/head\.log/);
    assert.match(homePageHtml, /cat ~\/\.plan/);
    assert.match(homePageHtml, /xindan@toronto-node/);
    assert.match(homePageHtml, /:~\$/);
    assert.match(homePageHtml, /:~\/workspace\$/);
    assert.match(homePageHtml, /blog\//);
    assert.match(homePageHtml, /projects\//);
    assert.match(homePageHtml, /bookmarks\//);
    assert.match(homePageHtml, /about\//);
    assert.match(homePageHtml, /Cindy/);
    assert.match(homePageHtml, /networking \/ systems \/ tooling/);
    assert.match(homePageHtml, /write it down after it works/);
    assert.match(homePageHtml, /Theme/);
    assert.match(homePageHtml, /Dark/);
    assert.match(homePageHtml, /Light/);
    assert.match(homePageHtml, /cwd=~\/personal-site/);
    assert.match(homePageHtml, /page=.*\.\//);
    assert.doesNotMatch(homePageHtml, /Cindy Zhang/);
    assert.match(homePageHtml, /href="\/personal-site\/blog\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/projects\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/bookmarks\/"/);
    assert.match(homePageHtml, /href="\/personal-site\/about\/"/);
    assert.doesNotMatch(homePageHtml, /class="workspace-tree-branch"/);
    assert.doesNotMatch(homePageHtml, /class="terminal-pane/);
    assert.doesNotMatch(homePageHtml, /class="shell-nav-link"/);
    assert.doesNotMatch(homePageHtml, />cd<\/span>/);
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
    assert.doesNotMatch(homePageHtml, /This site is where I keep the parts of systems work that are easy to lose/);
    assert.doesNotMatch(homePageHtml, /Most entries begin in the middle of debugging or building/);
    assert.doesNotMatch(homePageHtml, /Recent logs and writeups on networking, debugging, and reproducible setup/);
  } finally {
    rmSync(outDir, { recursive: true, force: true });
  }
});
