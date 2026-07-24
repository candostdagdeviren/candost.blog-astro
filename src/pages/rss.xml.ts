import rss from "@astrojs/rss";
import { site } from "../consts";
import { getAllContent } from "../utils/getAllContent";
import { sortPostsByDate } from "../utils/sortPostsByDate";
import { buildFeedItems } from "../utils/buildFeedItems";

export async function GET() {
  const blog = await getAllContent();
  const sortedBlog = sortPostsByDate(blog);

  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    stylesheet: "/rss/pretty-feed.xsl",
    items: buildFeedItems(sortedBlog),
  });
}
