import rss from "@astrojs/rss";
import { site } from "../../consts";
import { getCollectionByName } from "../../utils/getCollectionByName";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";

export async function GET() {
  const collection = await getCollectionByName("posts");
  const posts = sortPostsByDate(collection);

  return rss({
    title: "Posts, Essays, and Articles on " + site.title,
    description:
      "Posts, Essays, Articles that I write in a longer form combining my notes, journal entries, book notes, and my comments, thoughts, etc.",
    site: feedBaseUrl() + "/posts/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(posts),
  });
}
