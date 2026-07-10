import { ArrowUpRight, Bookmark } from "lucide-react";
import { PointerGlow } from "../../components/pointer-glow";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export const metadata = {
  title: "Links",
  description: "A concise index of references Xindan Zhang still reopens.",
};

export default function BookmarksPage() {
  const bookmarkEntries = site.bookmarks.map((bookmark) => ({
    ...bookmark,
    host: new URL(bookmark.href).hostname.replace(/^www\./, ""),
  }));

  return (
    <SiteLayout active="bookmarks">
      <section className="page-intro links-intro">
        <p className="section-index">Links / Working references</p>
        <h1>A small index, kept deliberately useful.</h1>
        <p>{site.bookmarksIntro} A reference stays here only while it continues to shape how I build, test, or write.</p>
      </section>

      <section className="bookmark-index" aria-label="Bookmarked references">
        <header className="bookmark-index-header">
          <Bookmark aria-hidden="true" size={18} />
          <span>{bookmarkEntries.length} saved reference</span>
          <span>Reviewed occasionally</span>
        </header>
        <div className="bookmark-list">
          {bookmarkEntries.map((bookmark, index) => (
            <PointerGlow
              as="a"
              key={bookmark.name}
              className="bookmark-row pointer-glow"
              href={bookmark.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="bookmark-index-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{bookmark.name}</h2>
                <span>{bookmark.host}</span>
              </div>
              <p>{bookmark.note}</p>
              <ArrowUpRight className="row-arrow" aria-hidden="true" size={18} />
            </PointerGlow>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
