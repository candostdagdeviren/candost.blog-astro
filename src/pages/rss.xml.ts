import rss from "@astrojs/rss";
import { blog, books, newsletters, notes, podcasts } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";

export const get = async () => {
  const posts = await readAll({
    directory: "essays",
    frontmatterSchema: blog,
  });

  const bookNotes = await readAll({
    directory: "books",
    frontmatterSchema: books,
  });

  const letters = await readAll({
    directory: "newsletter",
    frontmatterSchema: newsletters,
  });

  const podcast = await readAll({
    directory: "podcasts",
    frontmatterSchema: podcasts,
  });

  const shortNotes = await readAll({
    directory: "notes",
    frontmatterSchema: notes,
  })

  const allPosts = posts.concat(letters).concat(podcast).concat(bookNotes).concat(shortNotes);

  const sortedAllPosts = allPosts
  .filter((p) => p.frontmatter.draft !== true)
  .sort(
    (a, b) =>
      new Date(b.frontmatter.date).valueOf() -
      new Date(a.frontmatter.date).valueOf()
  );

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssItems = sortedAllPosts.map(({ frontmatter, slug }) => {
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
    const link = `${baseUrl}/blog/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
    };
  });

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems,
  });
};
