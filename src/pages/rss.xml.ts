import rss from "@astrojs/rss";
import { blog, books, newsletters, notes, podcast } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";

export const get = async () => {
  const essays = await readAll({
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

  const podcastEpisodes = await readAll({
    directory: "podcast",
    frontmatterSchema: podcast,
  });

  const shortNotes = await readAll({
    directory: "notes",
    frontmatterSchema: notes,
  })

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssEssays = essays
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

  const rssNotes = shortNotes
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
    const link = `${baseUrl}/notes/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
    };
  });

  const rssPodcastEpisodes = podcastEpisodes
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
    const link = `${baseUrl}/podcast/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
    };
  });

  const rssLetters = letters
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
    const link = `${baseUrl}/newsletter/${slug}`;

    return {
      title,
      pubDate,
      description,
      link,
    };
  });

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

  const rssItems = rssEssays
  .concat(rssLetters)
  .concat(rssPodcastEpisodes)
  .concat(rssBookNotes)
  .concat(rssNotes)
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems,
  });
};
