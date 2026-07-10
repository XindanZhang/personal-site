import { ArrowUpRight, Bookmark } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { site } from "~/lib/site";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Links | Xindan Zhang" },
      { name: "description", content: "A concise index of references Xindan Zhang still reopens." },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const bookmarks = site.bookmarks.map((bookmark) => ({ ...bookmark, host: new URL(bookmark.href).hostname.replace(/^www\./, "") }));
  return (
    <>
      <section className="page-heading links-heading">
        <p className="command-line"><span>xindan@toronto:~$</span> cat ~/.bookmarks</p>
        <div className="heading-grid"><div><p className="eyebrow">LINKS / WORKING REFERENCES</p><h1>One reference I keep reopening.</h1></div><p>{site.bookmarksIntro} A reference stays here only while it continues to shape how I build, test, or write.</p></div>
      </section>
      <section className="bookmark-index" aria-label="Bookmarked references">
        <header><Bookmark aria-hidden="true" size={17} /><span>BOOKMARK.TABLE</span><span>{bookmarks.length.toString().padStart(2, "0")} RECORD</span></header>
        {bookmarks.map((bookmark, index) => <a key={bookmark.name} className="bookmark-row" href={bookmark.href} target="_blank" rel="noopener noreferrer"><span className="row-index">{String(index + 1).padStart(2, "0")}</span><div><h2>{bookmark.name}</h2><span>{bookmark.host}</span></div><p>{bookmark.note}</p><ArrowUpRight aria-hidden="true" size={18} /></a>)}
      </section>
    </>
  );
}
