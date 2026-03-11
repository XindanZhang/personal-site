import { getCollection } from "astro:content";

export async function getBlogPosts() {
  const posts = await getCollection("blog");

  return posts
    .slice()
    .sort((left, right) => right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf());
}

export function getBlogSlug(id: string) {
  return id.replace(/\.md$/, "");
}

export function formatBlogDate(
  date: Date,
  dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "medium",
) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle,
    timeZone: "UTC",
  }).format(date);
}
