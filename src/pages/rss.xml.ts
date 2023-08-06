import rss from "@astrojs/rss";
import { blog, books, newsletters, podcast } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import Markdoc from "@markdoc/markdoc";

export const get = async () => {
  const posts = await readAll({
    directory: "posts",
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

  const podcastEpisodes = await readAll({
    directory: "podcast",
    frontmatterSchema: podcast,
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
      const link = frontmatter.url;
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

  const rssPodcastEpisodes = podcastEpisodes
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.url;
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
    const link = `${baseUrl}/podcast/${slug}`;

    return {
      title,
      pubDate,
      description,
      content,
      link,
    };
  });

  const rssLetters = letters
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.url;
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

  const rssBookNotes = bookNotes
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.url;
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
    const link = `${baseUrl}/books/${slug}`;

    return {
      title,
      pubDate,
      description,
      content,
      link,
    };
  });

  const rssItems = rssPosts
  .concat(rssLetters)
  .concat(rssPodcastEpisodes)
  .concat(rssBookNotes)
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems.map((item) => {
      return {
        ...item,
        content: Markdoc.renderers.html(item.content)
      }
    }),
  });
};
