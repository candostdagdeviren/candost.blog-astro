import { getCollectionByName } from "./getCollectionByName";

export const getAllContent = async () => {
  let posts = await getCollectionByName("posts");
  let journal = await getCollectionByName("journal");
  let newsletter = await getCollectionByName("newsletter");
  let notes = await getCollectionByName("notes");
  let books = await getCollectionByName("books");
  let de = await getCollectionByName("de");
  let podcast = await getCollectionByName("podcast");
  let critique = await getCollectionByName("critique");
  return [
    ...posts,
    ...journal,
    ...newsletter,
    ...notes,
    ...books,
    ...de,
    ...podcast,
    ...critique,
  ];
};
