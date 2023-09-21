import rss from "@astrojs/rss";
import { blog } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../config";
import Markdoc from "@markdoc/markdoc";

export const get = async () => {
  const posts = await readAll({
    directory: "posts",
    frontmatterSchema: blog,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssPosts = posts
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
    const link = `${baseUrl}/${slug}`;

    return {
      title,
      pubDate,
      description,
      content,
      link,
    };
  });

  const rssItems = rssPosts
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: "Posts | " + SITE_TITLE,
    description: "Posts, Essays, Articles that I write in a longer form combining my notes, journal entries, book notes, and my comments, thoughts, etc.",
    site: baseUrl + "/posts",
    items: rssItems.map((item) => {
      return {
        ...item,
        content: Markdoc.renderers.html(item.content)
      }
    }),
  });
};
