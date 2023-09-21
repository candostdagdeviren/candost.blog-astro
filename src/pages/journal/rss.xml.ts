import rss from "@astrojs/rss";
import { blog } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../config";
import Markdoc from "@markdoc/markdoc";

export const get = async () => {
  const journalEntries = await readAll({
    directory: "journal",
    frontmatterSchema: blog,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssNewsletters = journalEntries
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
    const link = `${baseUrl}/journal/${slug}`;

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
    title: "Journal | " + SITE_TITLE,
    description: "These are entries to my journal such as link to a post, a short comment, life update, etc. that I want to save",
    site: baseUrl + "/journal",
    items: rssItems.map( (post) => {
      return {
        ...post,
        content: Markdoc.renderers.html(post.content)
      }
    }),
  });
};
