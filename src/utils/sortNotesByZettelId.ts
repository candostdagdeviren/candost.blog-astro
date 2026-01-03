import type { CollectionEntry } from "astro:content";

export const sortNotesByZettelId = (posts: CollectionEntry<"notes">[]) =>
  posts
    .filter(({ data }) => {
      return import.meta.env.PROD ? !data.draft : true;
    })
    .sort((a, b) => {
      return a.data.zettelId.localeCompare(b.data.zettelId, "en-US", {
        numeric: true,
      });
    });
