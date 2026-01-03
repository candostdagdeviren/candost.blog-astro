import { getCollection, type DataEntryMap } from "astro:content";

export const getCollectionByName = async (name: keyof DataEntryMap) => {
  const posts = await getCollection(name);
  if (posts && posts.length > 0) {
    return posts.filter(({ data }) => {
      return import.meta.env.PROD ? !data.draft : true;
    });
  } else {
    return [];
  }
};
