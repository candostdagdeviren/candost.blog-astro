import rss from "@astrojs/rss";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
import getPostsByTag from "../../utils/getPostsByTag";
import { getAllContent } from "../../utils/getAllContent";
import { buildFeedItems, feedBaseUrl } from "../../utils/buildFeedItems";

export async function GET() {
  const allPosts = await getAllContent();
  const newsletters = getPostsByTag(allPosts, "mediations");
  const rssNewsletters = sortPostsByDate(newsletters);

  return rss({
    title: "Mediations",
    description: "Timeless insights into humans, software, and leadership.",
    site: feedBaseUrl() + "/newsletter/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(rssNewsletters, {
      titleFor: (letter) =>
        `${letter.data.newsletterName} #${letter.data.issueNumber}: ${letter.data.title}`,
    }),
  });
}
