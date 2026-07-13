import blogData from "../generated/blog-data.json";

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

export interface BlogPost {
  slug: string;
  segments: string[];
  title: string;
  summary: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  featured: boolean;
  categoryLabel: string;
  categorySlug: string;
  seriesSlug?: string;
  html: string;
  headings: Heading[];
  readingMinutes: number;
}

export interface BlogSeries {
  name: string;
  slug: string;
  posts: BlogPost[];
}

export interface BlogTaxonomyEntry {
  label: string;
  slug: string;
  count: number;
}

const posts = blogData.posts as BlogPost[];

export function getAllPosts() {
  return posts;
}

export function getFeaturedPosts() {
  return posts.filter((post) => post.featured).slice(0, 3);
}

export function getPostBySlug(slug: string | string[]) {
  const value = Array.isArray(slug) ? slug.join("/") : slug;
  return posts.find((post) => post.slug === value);
}

export function getAllSeries() {
  const seriesMap = new Map<string, BlogSeries>();

  for (const post of posts) {
    if (!post.series || !post.seriesSlug) continue;
    const existing = seriesMap.get(post.seriesSlug);
    if (existing) {
      existing.posts.push(post);
    } else {
      seriesMap.set(post.seriesSlug, { name: post.series, slug: post.seriesSlug, posts: [post] });
    }
  }

  return [...seriesMap.values()]
    .map((series) => ({
      ...series,
      posts: series.posts.slice().sort((left, right) => {
        const leftOrder = left.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        return leftOrder - rightOrder || left.publishedAt.localeCompare(right.publishedAt);
      }),
    }))
    .sort((left, right) => right.posts[0].publishedAt.localeCompare(left.posts[0].publishedAt));
}

export function getSeriesBySlug(seriesSlug: string) {
  return getAllSeries().find((series) => series.slug === seriesSlug);
}

export function getAllCategories() {
  const categoryMap = new Map<string, BlogTaxonomyEntry>();

  for (const post of posts) {
    const existing = categoryMap.get(post.categorySlug);
    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(post.categorySlug, {
        label: post.categoryLabel,
        slug: post.categorySlug,
        count: 1,
      });
    }
  }

  return [...categoryMap.values()].sort((left, right) => left.label.localeCompare(right.label));
}

export function formatMediumDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function formatIsoDate(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}
