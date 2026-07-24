import type { CollectionEntry } from "astro:content";
import { filterDrafts } from "./filterDrafts";

export const sortNotesByZettelId = (posts: CollectionEntry<"notes">[]) =>
  filterDrafts(posts).sort((a, b) => {
    return a.data.zettelId.localeCompare(b.data.zettelId, "en-US", {
      numeric: true,
    });
  });
