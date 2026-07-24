import rss from "@astrojs/rss";
import { getCollectionByName } from "../../utils/getCollectionByName";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";

export async function GET() {
  const collection = await getCollectionByName("notes");
  const notes = sortPostsByDate(collection);

  return rss({
    title: "Candost's Notes",
    description:
      "These are my short notes I like to keep to myself. Yet, I want to make them publicly available. These notes are part of my Slip-Box. I currently have hundreds of notes on my Zettelkasten and I will continue to open them up to public as much as I can.",
    site: feedBaseUrl() + "/notes/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(notes, {
      titleFor: (note) => note.data.zettelId + ": " + note.data.title,
    }),
  });
}
