import { PointerGlow } from "../../components/pointer-glow";
import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export default function BookmarksPage() {
  const bookmarkEntries = site.bookmarks.map((bookmark) => ({
    ...bookmark,
    host: new URL(bookmark.href).hostname.replace(/^www\./, ""),
  }));

  return (
    <SiteLayout active="bookmarks">
      <div className="bookmark-terminal">
        <PromptSection command="cat /etc/bookmarks.txt">
          <div className="bookmark-header">
            <p className="bookmark-kicker">refs</p>
            <h1 className="shell-heading">Bookmarks</h1>
            <p className="bookmark-lead">{site.bookmarksIntro}</p>
          </div>
          <div className="bookmark-list">
            {bookmarkEntries.map((bookmark, index) => (
              <PointerGlow
                as="a"
                key={bookmark.name}
                className="bookmark-row pointer-glow is-links"
                href={bookmark.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="bookmark-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="bookmark-main">
                  <span className="bookmark-name">{bookmark.name}</span>
                  <span className="bookmark-host">{bookmark.host}</span>
                </div>
                <div className="bookmark-meta">
                  <span className="bookmark-note">{bookmark.note}</span>
                  <span className="bookmark-open">Open ↗</span>
                </div>
              </PointerGlow>
            ))}
          </div>
          <p className="bookmark-footnote">
            The list stays short on purpose. I keep references here only when they still shape how I write, build, or
            test things on this site.
          </p>
        </PromptSection>
      </div>
    </SiteLayout>
  );
}
