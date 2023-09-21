import rss from "@astrojs/rss";
import { notes } from "../../lib/markdoc/frontmatter.schema";
import { readAll } from "../../lib/markdoc/read";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../../config";
import Markdoc from "@markdoc/markdoc";

export const get = async () => {
  const shortNotes = await readAll({
    directory: "notes",
    frontmatterSchema: notes,
  });

  let baseUrl = SITE_URL;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");


  const rssNewsletters = shortNotes
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
        link,
        content
      };
    }

    const title = frontmatter.title;
    const pubDate = frontmatter.date;
    const description = frontmatter.description ? frontmatter.description : "";
    const link = `${baseUrl}/notes/${slug}`;

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
    title: "Notes | " + SITE_TITLE,
    description: "These are my short notes I like to keep to myself. Yet, I want to make them publicly available. These notes are part of my Slip-Box. I currently have hundreds of notes on my Zettelkasten and I will continue to open them up to public as much as I can.",
    site: baseUrl + "/notes",
    items: rssItems.map( (post) => {
      return {
        ...post,
        content: Markdoc.renderers.html(post.content)
      }
    }),
  });
};
