import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    sourceUrl: z.string().url().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
