import {defineCollection, z} from 'astro:content';

const books = defineCollection({
  type: 'content',
  schema: z.object({
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
  }),
});

const journal = defineCollection({
  type: 'content',
  schema: z.object({
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
  }),
});

const newsletter = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    newsletterName: z.string().optional().nullable(),
    issueNumber: z.string().optional().nullable(),
    date: z.date(),
    updateDate: z.date().optional(),
    tags: z.array(z.string()).or(z.string()).optional().nullable(),
    category: z.array(z.string()).or(z.string()).optional().nullable(),
    sticky: z.number().default(0).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    draft: z.boolean().default(false).nullable(),
    comment: z.boolean().default(true).nullable(),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    zettelId: z.string(),
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
  }),
});

const podcast = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    externalUrl: z.string().optional().nullable(),
    date: z.date(),
    updateDate: z.date().optional(),
    tags: z.array(z.string()).or(z.string()).optional().nullable(),
    category: z.array(z.string()).or(z.string()).optional().nullable(),
    sticky: z.number().default(0).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    draft: z.boolean().default(false).nullable(),
    comment: z.boolean().default(true).nullable(),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional().nullable(),
    date: z.date(),
    updateDate: z.date().optional(),
    tags: z.array(z.string()).or(z.string()).optional().nullable(),
    category: z.array(z.string()).or(z.string()).optional().nullable(),
    newsletterName: z.string().optional().nullable(),
    issueNumber: z.string().optional().nullable(),
    sticky: z.number().default(0).nullable(),
    mathjax: z.boolean().default(false).nullable(),
    mermaid: z.boolean().default(false).nullable(),
    draft: z.boolean().default(false).nullable(),
    favorite: z.boolean().default(false).nullable(),
    comment: z.boolean().default(true).nullable(),
  }),
});

const de = defineCollection({
  type: 'content',
  schema: z.object({
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
  }),
});

export const collections = {books, journal, newsletter, notes, podcast, posts, de};
