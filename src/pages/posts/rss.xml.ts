import rss from "@astrojs/rss";
import { blog } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../config";

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
  .map(({ frontmatter, slug }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.url;

      return {
        title,
        pubDate,
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
    description: SITE_DESCRIPTION,
    site: baseUrl + "/posts",
    items: rssItems,
  });
};
