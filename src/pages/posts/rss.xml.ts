import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const notes = await getCollectionByName("posts");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(notes);

  return rss({
    title: "Posts, Essays, and Articles on " + site.title,
    description: "Posts, Essays, Articles that I write in a longer form combining my notes, journal entries, book notes, and my comments, thoughts, etc.",
    site: baseUrl + "/posts",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ? entry.data.description : "",
      link:`${baseUrl}/${entry.slug}/`,
      content: sanitizeHtml(parser.render(entry.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
