import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const notes = await getCollectionByName("books");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(notes);

  return rss({
    title: "Candost's Book Notes",
    description: "I share either a full book review or a single-chapter note from the books I read.",
    site: baseUrl + "/books",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ? entry.data.description : "",
      link:`${baseUrl}/books/${entry.slug}/`,
      content: sanitizeHtml(parser.render(entry.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
