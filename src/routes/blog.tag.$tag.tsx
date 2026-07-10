import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArchive } from "~/components/blog-archive";
import { getAllCategories, getAllTags, getPostsByTag } from "~/lib/blog";

export const Route = createFileRoute("/blog/tag/$tag")({
  loader: ({ params }) => {
    const tag = getAllTags().find((entry) => entry.slug === params.tag);
    if (!tag) throw notFound();
    return tag;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `#${loaderData?.label ?? "tag"} | Xindan Zhang` },
      { name: "description", content: `Systems field notes tagged ${loaderData?.label ?? "with this topic"}.` },
    ],
  }),
  component: BlogTagPage,
});

function BlogTagPage() {
  const tag = Route.useLoaderData();
  return <BlogArchive activeTagSlug={tag.slug} categories={getAllCategories()} description={`Notes connected by #${tag.label}.`} routeLabel={`~/writing/tag/${tag.slug}`} posts={getPostsByTag(tag.slug)} tags={getAllTags()} />;
}
