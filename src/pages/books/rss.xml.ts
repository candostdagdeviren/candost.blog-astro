import rss from "@astrojs/rss";
import { books } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../config";

export const get = async () => {
  const bookNotes = await readAll({
    directory: "books",
    frontmatterSchema: books,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssBookNotes = bookNotes
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
    const link = `${baseUrl}/books/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
    };
  });

  const rssItems = rssBookNotes
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: "Books | " + SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl + "/books",
    items: rssItems,
  });
};
