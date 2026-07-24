import { getCollection, type DataEntryMap } from "astro:content";
import { filterDrafts } from "./filterDrafts";

export const getCollectionByName = async (name: keyof DataEntryMap) => {
  const posts = await getCollection(name);
  if (posts && posts.length > 0) {
    return filterDrafts(posts);
  } else {
    return [];
  }
};
