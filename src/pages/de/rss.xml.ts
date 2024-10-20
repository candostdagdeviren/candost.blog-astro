import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const notes = await getCollectionByName("de");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(notes);

  return rss({
    title: "Candosts deutscher Blogeinträge",
    description: "Ich lerne Deutch und möchte üben. Deshalb habe ich mich entschlossen, in meinem Blog eine Abteilung zum Thema Deutch einzurichten.",
    site: baseUrl + "/de",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ? entry.data.description : "",
      link:`${baseUrl}/de/${entry.slug}/`,
      content: sanitizeHtml(parser.render(entry.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
