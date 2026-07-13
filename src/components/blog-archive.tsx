import type { BlogPost, BlogTaxonomyEntry } from "~/lib/blog";
import { BlogSearch } from "./blog-search";

interface BlogArchiveProps {
  description: string;
  posts: BlogPost[];
  categories: BlogTaxonomyEntry[];
}

export function BlogArchive({ description, posts, categories }: BlogArchiveProps) {
  const searchablePosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    categoryLabel: post.categoryLabel,
    categorySlug: post.categorySlug,
    tags: post.tags,
    dateTime: post.publishedAt,
  }));

  return (
    <div className="writing-page">
      <section className="page-intro writing-intro">
        <p className="section-kicker">Blogs · {posts.length.toString().padStart(2, "0")} {posts.length === 1 ? "post" : "posts"}</p>
        <div className="page-intro-grid"><h1>Blogs.</h1><p>{description}</p></div>
      </section>

      <BlogSearch posts={searchablePosts} categories={categories.filter((category) => category.count > 1)} />
    </div>
  );
}
