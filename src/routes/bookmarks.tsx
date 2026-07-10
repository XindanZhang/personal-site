import { ArrowUpRight } from "lucide-react";
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
      <section className="page-intro links-intro">
        <p className="section-kicker">Bookmarks · {bookmarks.length.toString().padStart(2, "0")}</p>
        <div className="page-intro-grid"><h1>References worth reopening.</h1><p>{site.bookmarksIntro} A reference stays here only while it continues to shape how I build, test, or write.</p></div>
      </section>
      <section className="bookmark-index" aria-label="Bookmarked references">
        {bookmarks.map((bookmark, index) => <a key={bookmark.name} className="bookmark-row" href={bookmark.href} target="_blank" rel="noopener noreferrer"><span className="row-index">{String(index + 1).padStart(2, "0")}</span><div><p>{bookmark.host}</p><h2>{bookmark.name}</h2></div><p>{bookmark.note}</p><ArrowUpRight aria-hidden="true" size={20} /></a>)}
      </section>
    </>
  );
}
