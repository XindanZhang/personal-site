import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [{ title: "Not found | Xindan Zhang" }] }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <section className="error-screen" aria-labelledby="not-found-title">
      <p className="section-kicker">Error · 404</p>
      <h1 id="not-found-title">There is nothing here.</h1>
      <p>The page may have moved, or the address is no longer part of this site.</p>
      <Link className="action-link is-primary" to="/">Return home</Link>
    </section>
  );
}
