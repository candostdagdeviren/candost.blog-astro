import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const notes = await getCollectionByName("journal");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(notes);

  return rss({
    title: "Candost's Journal",
    description: "These are entries to my journal such as link to a post, a short comment, life update, etc. that I want to save",
    site: baseUrl + "/journal",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description ? entry.data.description : "",
      link:`${baseUrl}/journal/${entry.slug}/`,
      content: sanitizeHtml(parser.render(entry.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
