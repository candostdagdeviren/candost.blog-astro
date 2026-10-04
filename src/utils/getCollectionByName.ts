import { getCollection, type DataEntryMap } from "astro:content";
import { filterDrafts } from "./filterDrafts";

export const getCollectionByName = async <C extends keyof DataEntryMap>(name: C) =>
  filterDrafts(await getCollection(name));
