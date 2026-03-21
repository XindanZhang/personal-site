import { notFound } from "next/navigation";
import { BlogArchive } from "../../../../components/blog-archive";
import { SiteLayout } from "../../../../components/site-layout";
import { getAllCategories, getAllTags, getPostsByTag } from "../../../../lib/blog";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tag.slug,
  }));
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: tagSlug } = await params;
  const tag = getAllTags().find((entry) => entry.slug === tagSlug);

  if (!tag) {
    notFound();
  }

  return (
    <SiteLayout active="blog">
      <BlogArchive
        activeTagSlug={tagSlug}
        categories={getAllCategories()}
        description={`filter=tag:#${tag.label}`}
        pathCommand={`pwd: /blog/tag/${tagSlug}`}
        posts={getPostsByTag(tagSlug)}
        tags={getAllTags()}
      />
    </SiteLayout>
  );
}
