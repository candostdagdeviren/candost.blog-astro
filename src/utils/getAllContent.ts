import { getCollectionByName } from "./getCollectionByName";

// Keep in sync with content.config.ts when a collection is added.
const COLLECTIONS = ["posts", "journal", "newsletter", "notes", "books", "de", "podcast"] as const;

export const getAllContent = async () =>
  (await Promise.all(COLLECTIONS.map((name) => getCollectionByName(name)))).flat();
