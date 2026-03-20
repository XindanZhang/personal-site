import { BlogArchive } from "../../components/blog-archive";
import { SiteLayout } from "../../components/site-layout";
import { getAllCategories, getAllPosts, getAllTags } from "../../lib/blog";
import { site } from "../../lib/site";

export const metadata = {
  title: "Journal",
  description: site.blog.description,
};

export default function BlogPage() {
  return (
    <SiteLayout active="blog">
      <BlogArchive
        pathCommand="pwd: /journal"
        categories={getAllCategories()}
        description={site.blog.description}
        posts={getAllPosts()}
        tags={getAllTags()}
      />
    </SiteLayout>
  );
}
