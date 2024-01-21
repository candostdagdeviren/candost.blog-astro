import { z, defineCollection } from 'astro:content';
import { blog, books, newsletters, notes, podcast } from "../lib/markdoc/frontmatter.schema";

const booksCollection = defineCollection({
  type: 'content',
  schema: books,
});

const journalCollection = defineCollection({
  type: 'content',
  schema: blog,
});

const newsletterCollection = defineCollection({
  type: 'content',
  schema: newsletters,
});

const notesCollection = defineCollection({
  type: 'content',
  schema: notes,
});

const podcastCollection = defineCollection({
  type: 'content',
  schema: podcast,
});

const postsCollection = defineCollection({
  type: 'content',
  schema: blog,
});

export const collections = {
  'books': booksCollection,
  'journal': journalCollection,
  'newsletters': newsletterCollection,
  'notes': notesCollection,
  'podcast': podcastCollection,
  'posts': postsCollection
};