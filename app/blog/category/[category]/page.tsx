import { notFound } from "next/navigation";
import { BlogArchive } from "../../../../components/blog-archive";
import { SiteLayout } from "../../../../components/site-layout";
import { getAllCategories, getAllTags, getPostsByCategory } from "../../../../lib/blog";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: category.slug,
  }));
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getAllCategories().find((entry) => entry.slug === categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <SiteLayout active="blog">
      <BlogArchive
        activeCategorySlug={categorySlug}
        categories={getAllCategories()}
        description={`filter=category:${category.label}`}
        pathCommand={`pwd: /journal/category/${categorySlug}`}
        posts={getPostsByCategory(categorySlug)}
        tags={getAllTags()}
      />
    </SiteLayout>
  );
}
