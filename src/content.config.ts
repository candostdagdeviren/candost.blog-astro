import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Fields shared by every collection. Collection-specific fields are passed
// as `extraFields` below, so each schema stays identical to what it was
// when the fields were declared inline.
const baseFields = {
  title: z.string(),
  description: z.string().optional().nullable(),
  date: z.date(),
  updateDate: z.date().optional(),
  tags: z.array(z.string()).or(z.string()).optional().nullable(),
  category: z.array(z.string()).or(z.string()).optional().nullable(),
  sticky: z.number().default(0).nullable(),
  mathjax: z.boolean().default(false).nullable(),
  mermaid: z.boolean().default(false).nullable(),
  draft: z.boolean().default(false).nullable(),
  comment: z.boolean().default(true).nullable(),
};

const contentCollection = (
  name: string,
  extraFields: z.ZodRawShape = {},
) =>
  defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./src/content/${name}` }),
    schema: z.object({ ...baseFields, ...extraFields }),
  });

const books = contentCollection("books");

const journal = contentCollection("journal", {
  externalUrl: z.string().optional().nullable(),
  externalTitle: z.string().optional().nullable(),
});

const newsletter = contentCollection("newsletter", {
  newsletterName: z.string().optional().nullable(),
  issueNumber: z.string().optional().nullable(),
});

const notes = contentCollection("notes", {
  zettelId: z.string(),
});

const podcast = contentCollection("podcast", {
  externalUrl: z.string().optional().nullable(),
});

const posts = contentCollection("posts", {
  newsletterName: z.string().optional().nullable(),
  issueNumber: z.string().optional().nullable(),
  favorite: z.boolean().default(false).nullable(),
});

const de = contentCollection("de");

export const collections = {
  books,
  journal,
  newsletter,
  notes,
  podcast,
  posts,
  de,
};
