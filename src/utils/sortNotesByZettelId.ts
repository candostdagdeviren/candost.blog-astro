import type { CollectionEntry } from "astro:content";

export const sortNotesByZettelId = (posts: CollectionEntry<"notes">[]) =>
  // `zettelId` typechecks as `unknown` here under moduleResolution "bundler"
  // (likely a zod v4 dual-resolution quirk in Astro's generated content
  // types, see PR #76) even though it's a plain string at runtime.
  [...posts].sort((a, b) => {
    return a.data.zettelId.localeCompare(b.data.zettelId, "en-US", {
      numeric: true,
    });
  });
