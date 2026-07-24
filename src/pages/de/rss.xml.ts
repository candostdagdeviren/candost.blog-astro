import rss from "@astrojs/rss";
import { getCollectionByName } from "../../utils/getCollectionByName";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";

export async function GET() {
  const collection = await getCollectionByName("de");
  const germanPosts = sortPostsByDate(collection);

  return rss({
    title: "Candosts deutscher Blogeinträge",
    description:
      "Ich lerne Deutch und möchte üben. Deshalb habe ich mich entschlossen, in meinem Blog eine Abteilung zum Thema Deutch einzurichten.",
    site: feedBaseUrl() + "/de/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(germanPosts, {
      replyFooterFor: (url) =>
        `\n\n---\n[per E-Mail antworten](mailto:candost@candostdagdeviren.com?subject=Re:%20${url})`,
    }),
  });
}
