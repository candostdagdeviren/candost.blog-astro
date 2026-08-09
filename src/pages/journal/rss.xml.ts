import rss from "@astrojs/rss";
import { getCollectionByName } from "../../utils/getCollectionByName";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";
export async function GET() {
  const entries = await getCollectionByName("journal");
  const journalEntries = sortPostsByDate(entries);
  return rss({
    title: "Candost's Journal",
    description:
      "These are entries to my journal such as link to a post, a short comment, life update, etc. that I want to save",
    site: feedBaseUrl() + "/journal/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(journalEntries),
  });
}
