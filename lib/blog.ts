import { readFileSync, readdirSync } from "node:fs";
import { relative, resolve } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { cache } from "react";
import { toString } from "mdast-util-to-string";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const blogContentDir = resolve(process.cwd(), "src/content/blog");
const badgePalette = [
  { background: "#e6f2ff", text: "#0b63ce" },
  { background: "#eef2ff", text: "#5e3ac7" },
  { background: "#ffe7ef", text: "#c43b6f" },
  { background: "#e7f7ec", text: "#1f8a43" },
  { background: "#fff1db", text: "#a16100" },
  { background: "#e7f8ff", text: "#007c91" },
  { background: "#f3ebff", text: "#7747c9" },
] as const;

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Frontmatter {
  title: string;
  summary: string;
  slug?: string;
  sourceUrl?: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  featured: boolean;
}

export interface BlogPost {
  slug: string;
  segments: string[];
  title: string;
  summary: string;
  sourceUrl?: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  featured: boolean;
  categoryLabel: string;
  categorySlug: string;
  seriesSlug?: string;
  html: string;
  headings: Heading[];
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

function walkMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        return walkMarkdownFiles(entryPath);
      }

      return entry.name.endsWith(".md") ? [entryPath] : [];
    })
    .sort();
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toTitleCase(value: string) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeFrontmatter(data: Record<string, unknown>, filePath: string): Frontmatter {
  if (typeof data.title !== "string") {
    throw new Error(`Missing title in ${filePath}`);
  }

  if (typeof data.summary !== "string") {
    throw new Error(`Missing summary in ${filePath}`);
  }

  const publishedAt = new Date(String(data.publishedAt));
  if (Number.isNaN(publishedAt.valueOf())) {
    throw new Error(`Invalid publishedAt in ${filePath}`);
  }

  const updatedAt =
    data.updatedAt === undefined ? undefined : new Date(String(data.updatedAt));

  return {
    title: data.title,
    summary: data.summary,
    slug: typeof data.slug === "string" ? data.slug : undefined,
    sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
    publishedAt,
    updatedAt:
      updatedAt && !Number.isNaN(updatedAt.valueOf()) ? updatedAt : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((tag): tag is string => typeof tag === "string") : [],
    series: typeof data.series === "string" ? data.series : undefined,
    seriesOrder: typeof data.seriesOrder === "number" ? data.seriesOrder : undefined,
    featured: data.featured === true,
  };
}

function buildSlug(relativeFilePath: string, frontmatterSlug?: string) {
  const normalizedPath = relativeFilePath.replace(/\\/g, "/");
  const stem = normalizedPath.replace(/\.md$/, "");
  const withoutIndex = stem.endsWith("/index") ? stem.slice(0, -6) : stem;

  if (!frontmatterSlug) {
    return withoutIndex;
  }

  if (!withoutIndex.includes("/")) {
    return frontmatterSlug;
  }

  const parent = withoutIndex.slice(0, withoutIndex.lastIndexOf("/"));
  return parent ? `${parent}/${frontmatterSlug}` : frontmatterSlug;
}

function getCategoryLabel(frontmatter: Frontmatter) {
  if (frontmatter.series) {
    return `${frontmatter.series} series`;
  }

  if (frontmatter.tags[0]) {
    return toTitleCase(frontmatter.tags[0]);
  }

  return "Note";
}

function renderMarkdown(markdown: string) {
  const headingTree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  visit(headingTree, "heading", (node) => {
    if (node.depth < 2 || node.depth > 3) {
      return;
    }

    const text = toString(node).trim();
    if (!text) {
      return;
    }

    headings.push({
      depth: node.depth,
      slug: slugger.slug(text),
      text,
    });
  });

  const html = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(markdown)
    .toString();

  return { html, headings };
}

function sortPosts(posts: BlogPost[]) {
  return posts
    .slice()
    .sort((left, right) => right.publishedAt.valueOf() - left.publishedAt.valueOf());
}

export const getAllPosts = cache(() => {
  const files = walkMarkdownFiles(blogContentDir);

  const posts = files.map((filePath) => {
    const rawFile = readFileSync(filePath, "utf8");
    const { data, content } = matter(rawFile);
    const frontmatter = normalizeFrontmatter(data, filePath);
    const relativeFilePath = relative(blogContentDir, filePath);
    const slug = buildSlug(relativeFilePath, frontmatter.slug);
    const categoryLabel = getCategoryLabel(frontmatter);
    const { html, headings } = renderMarkdown(content);

    return {
      slug,
      segments: slug.split("/").filter(Boolean),
      title: frontmatter.title,
      summary: frontmatter.summary,
      sourceUrl: frontmatter.sourceUrl,
      publishedAt: frontmatter.publishedAt,
      updatedAt: frontmatter.updatedAt,
      tags: frontmatter.tags,
      series: frontmatter.series,
      seriesOrder: frontmatter.seriesOrder,
      featured: frontmatter.featured,
      categoryLabel,
      categorySlug: slugify(categoryLabel),
      seriesSlug: frontmatter.series ? slugify(frontmatter.series) : undefined,
      html,
      headings,
    } satisfies BlogPost;
  });

  return sortPosts(posts);
});

export const getFeaturedPosts = cache(() =>
  getAllPosts()
    .filter((post) => post.featured)
    .slice(0, 3),
);

export const getPostBySlug = cache((segments: string[]) => {
  const slug = segments.join("/");
  return getAllPosts().find((post) => post.slug === slug);
});

export const getAllSeries = cache(() => {
  const seriesMap = new Map<string, BlogSeries>();

  for (const post of getAllPosts()) {
    if (!post.series || !post.seriesSlug) {
      continue;
    }

    const existing = seriesMap.get(post.seriesSlug);
    if (existing) {
      existing.posts.push(post);
      continue;
    }

    seriesMap.set(post.seriesSlug, {
      name: post.series,
      slug: post.seriesSlug,
      posts: [post],
    });
  }

  return [...seriesMap.values()]
    .map((series) => ({
      ...series,
      posts: series.posts.slice().sort((left, right) => {
        const leftOrder = left.seriesOrder ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.seriesOrder ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return left.publishedAt.valueOf() - right.publishedAt.valueOf();
      }),
    }))
    .sort(
      (left, right) =>
        right.posts[0].publishedAt.valueOf() - left.posts[0].publishedAt.valueOf(),
    );
});

export const getSeriesBySlug = cache((seriesSlug: string) =>
  getAllSeries().find((series) => series.slug === seriesSlug),
);

export const getAllCategories = cache(() => {
  const categoryMap = new Map<string, BlogTaxonomyEntry>();

  for (const post of getAllPosts()) {
    const existing = categoryMap.get(post.categorySlug);

    if (existing) {
      existing.count += 1;
      continue;
    }

    categoryMap.set(post.categorySlug, {
      label: post.categoryLabel,
      slug: post.categorySlug,
      count: 1,
    });
  }

  return [...categoryMap.values()].sort((left, right) => left.label.localeCompare(right.label));
});

export const getPostsByCategory = cache((categorySlug: string) =>
  getAllPosts().filter((post) => post.categorySlug === categorySlug),
);

export const getAllTags = cache(() => {
  const tagMap = new Map<string, BlogTaxonomyEntry>();

  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      const slug = slugify(tag);
      const existing = tagMap.get(slug);

      if (existing) {
        existing.count += 1;
        continue;
      }

      tagMap.set(slug, {
        label: tag,
        slug,
        count: 1,
      });
    }
  }

  return [...tagMap.values()].sort((left, right) => left.label.localeCompare(right.label));
});

export const getPostsByTag = cache((tagSlug: string) =>
  getAllPosts().filter((post) => post.tags.some((tag) => slugify(tag) === tagSlug)),
);

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export function formatMediumDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getBadgeTheme(seed: string) {
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return badgePalette[Math.abs(hash) % badgePalette.length];
}
