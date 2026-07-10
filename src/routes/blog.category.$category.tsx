import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArchive } from "~/components/blog-archive";
import { getAllCategories, getAllTags, getPostsByCategory } from "~/lib/blog";

export const Route = createFileRoute("/blog/category/$category")({
  loader: ({ params }) => {
    const category = getAllCategories().find((entry) => entry.slug === params.category);
    if (!category) throw notFound();
    return category;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.label ?? "Category"} notes | Xindan Zhang` },
      { name: "description", content: `Systems field notes filed under ${loaderData?.label ?? "this category"}.` },
    ],
  }),
  component: BlogCategoryPage,
});

function BlogCategoryPage() {
  const category = Route.useLoaderData();
  return <BlogArchive activeCategorySlug={category.slug} categories={getAllCategories()} description={`${category.label} notes, collected in one reading path.`} routeLabel={`~/writing/category/${category.slug}`} posts={getPostsByCategory(category.slug)} tags={getAllTags()} />;
}
