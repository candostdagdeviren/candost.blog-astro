import rss from "@astrojs/rss";
import { getCollectionByName } from "../../utils/getCollectionByName";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";

export async function GET() {
  const collection = await getCollectionByName("books");
  const books = sortPostsByDate(collection);

  return rss({
    title: "Candost's Book Notes",
    description:
      "I share either a full book review or a single-chapter note from the books I read.",
    site: feedBaseUrl() + "/books/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(books),
  });
}
