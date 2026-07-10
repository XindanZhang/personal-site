import { createFileRoute } from "@tanstack/react-router";
import { BlogArchive } from "~/components/blog-archive";
import { getAllCategories, getAllPosts, getAllTags } from "~/lib/blog";
import { site } from "~/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Writing | Xindan Zhang" },
      { name: "description", content: site.blog.description },
    ],
    links: [{ rel: "canonical", href: "https://xindanzhang.github.io/personal-site/blog/" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return <BlogArchive routeLabel="~/writing" categories={getAllCategories()} description={site.blog.description} posts={getAllPosts()} tags={getAllTags()} />;
}
