import rss from "@astrojs/rss";
import { deutsch } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_URL } from "../../config";
import Markdoc from "@markdoc/markdoc";

export async function GET() {
  const deutschEntries = await readAll({
    directory: "deutsch",
    frontmatterSchema: deutsch,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssNewsletters = deutschEntries
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.externalUrl;
      const description = "A link to an external url";
      return {
        title,
        pubDate,
        description,
        link,
        content
      };
    }

    const title = frontmatter.title;
    const pubDate = frontmatter.date;
    const description = frontmatter.description ? frontmatter.description : "";
    const link = `${baseUrl}/de/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
      content
    };
  });

  const rssItems = rssNewsletters
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: "Candost's Journal",
    description: "Diese Blogartikeln sind meine blog in Deutsch.",
    site: baseUrl + "/de",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssItems.map( (post) => {
      return {
        ...post,
        content: Markdoc.renderers.html(post.content)
      }
    }),
  });
};
