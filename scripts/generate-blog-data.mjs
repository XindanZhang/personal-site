import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAllPosts } from "./blog-source.ts";

const rootDir = process.cwd();
const outputDir = resolve(rootDir, "src/generated");
const outputFile = resolve(outputDir, "blog-data.json");
const posts = getAllPosts().map((post) => ({
  ...post,
  publishedAt: post.publishedAt.toISOString(),
  updatedAt: post.updatedAt?.toISOString(),
  readingMinutes: Math.max(
    1,
    Math.round(post.html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 220),
  ),
}));

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${JSON.stringify({ posts }, null, 2)}\n`);

console.log(`Generated ${posts.length} blog entries in ${outputFile}`);
