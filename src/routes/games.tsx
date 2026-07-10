import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Interests | Xindan Zhang" },
      { name: "robots", content: "noindex" },
      { httpEquiv: "refresh", content: "0; url=/personal-site/interests/" },
    ],
    links: [{ rel: "canonical", href: "https://xindanzhang.github.io/personal-site/interests/" }],
  }),
  component: () => <Navigate to="/interests/" replace />,
});
