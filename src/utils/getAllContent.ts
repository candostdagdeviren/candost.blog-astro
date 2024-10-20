import { getCollectionByName } from "./getCollectionByName";

export const getAllContent = async () => {
  let posts = await getCollectionByName('posts');
  let journal = await getCollectionByName('journal');
  let newsletter = await getCollectionByName('newsletter');
  let notes = await getCollectionByName('notes');
  let books = await getCollectionByName('books');
  const all = [...posts, ...journal, ...newsletter, ...notes, ...books];
  if (all && all.length > 0 ) {
    return all.filter(({data}) => {
      return import.meta.env.PROD ? !data.draft : true
    });
  } else {
    return []
  }
}
