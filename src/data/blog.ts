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

export function getSeriesSlug(series: string) {
  return series.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function getBlogSeries() {
  const posts = await getBlogPosts();
  const seriesMap = new Map<
    string,
    {
      name: string;
      slug: string;
      posts: typeof posts;
    }
  >();

  for (const post of posts) {
    const seriesName = post.data.series;
    if (!seriesName) continue;

    const slug = getSeriesSlug(seriesName);
    const existing = seriesMap.get(slug);

    if (existing) {
      existing.posts.push(post);
      continue;
    }

    seriesMap.set(slug, {
      name: seriesName,
      slug,
      posts: [post],
    });
  }

  return [...seriesMap.values()]
    .map((series) => ({
      ...series,
      posts: series.posts
        .slice()
        .sort((left, right) => {
          const leftOrder = left.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
          const rightOrder = right.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;

          if (leftOrder !== rightOrder) {
            return leftOrder - rightOrder;
          }

          return right.data.publishedAt.valueOf() - left.data.publishedAt.valueOf();
        }),
    }))
    .sort(
      (left, right) =>
        right.posts[0].data.publishedAt.valueOf() - left.posts[0].data.publishedAt.valueOf(),
    );
}
