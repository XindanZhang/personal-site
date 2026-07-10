import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  head: () => ({ meta: [{ title: "Not found | Xindan Zhang" }] }),
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <section className="error-screen" aria-labelledby="not-found-title">
      <p className="command-line"><span>xindan@toronto:~$</span> resolve --path current</p>
      <p className="error-code">ERR 404 / NO ENTRY</p>
      <h1 id="not-found-title">This path is not in the index.</h1>
      <p>The page may have moved, or the command was typed from an old note.</p>
      <Link className="command-button" to="/">Return to ~/home</Link>
    </section>
  );
}
