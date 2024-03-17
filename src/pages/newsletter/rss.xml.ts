import rss from "@astrojs/rss";
import { newsletters } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_URL } from "../../config";
import Markdoc from "@markdoc/markdoc";

export async function GET() {
  const mektups = await readAll({
    directory: "newsletter/mektup",
    frontmatterSchema: newsletters,
  });

  const mediations = await readAll({
    directory: "newsletter/mediations",
    frontmatterSchema: newsletters,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssNewsletters = mediations
  .concat(mektups)
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.externalUrl;
      const description = "";

      return {
        title,
        pubDate,
        description,
        content,
        link,
      };
    }

    const title = frontmatter.title;
    const pubDate = frontmatter.date;
    const description = frontmatter.description;
    const link = `${baseUrl}/newsletter/${slug}`;

    return {
      title,
      pubDate,
      description,
      content,
      link,
    };
  });

  const rssItems = rssNewsletters
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: "Mediations of Candost",
    description: "I always feel like I'm mediating (or maybe negotiating) between multiple aspects and constraints of the complicated life and searching for the balance between leadership, software engineering, personal life, and the world. This is the feed of emails I send.",
    site: baseUrl + "/newsletter",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssItems.map((item) => {
      return {
        ...item,
        content: Markdoc.renderers.html(item.content)
      }
    }),
  });
};
