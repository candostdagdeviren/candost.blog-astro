import rss from "@astrojs/rss";
import { blog, books, newsletters, podcast } from "../lib/markdoc/frontmatter.schema";
import { readAll } from "../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import Markdoc from "@markdoc/markdoc";

export async function GET(context) {
  const posts = await readAll({
    directory: "posts",
    frontmatterSchema: blog,
  });

  const bookNotes = await readAll({
    directory: "books",
    frontmatterSchema: books,
  });

  const mektups = await readAll({
    directory: "newsletter/mektup",
    frontmatterSchema: newsletters,
  });

  const mediations = await readAll({
    directory: "newsletter/mediations",
    frontmatterSchema: newsletters,
  });

  const podcastEpisodes = await readAll({
    directory: "podcast",
    frontmatterSchema: podcast,
  });

  const journal = await readAll({
    directory: "journal",
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

  const rssPodcastEpisodes = podcastEpisodes
  .filter((p) => p.frontmatter.draft !== true)
  .map(({ frontmatter, slug, content }) => {
    if (frontmatter.external) {
      const title = frontmatter.title;
      const pubDate = frontmatter.date;
      const link = frontmatter.externalUrl;
      const description = "Link to my podcast episodes that are hosted outside of my blog";

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

  const rssMediations = mediations
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

  const rssMektups = mektups
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

  const rssBookNotes = bookNotes
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
    const link = `${baseUrl}/books/${slug}`;

    return {
      title,
      pubDate,
      description,
      content,
      link,
    };
  });

  const rssJournalEntries = journal
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
  .concat(rssMediations)
  .concat(rssMektups)
  .concat(rssPodcastEpisodes)
  .concat(rssBookNotes)
  .concat(rssJournalEntries)
  .sort(
    (a, b) =>
      new Date(b.pubDate).valueOf() -
      new Date(a.pubDate).valueOf()
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssItems.map((item) => {
      return {
        ...item,
        content: Markdoc.renderers.html(item.content)
      }
    }),
  });
};
