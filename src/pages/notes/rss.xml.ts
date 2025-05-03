import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const notes = await getCollectionByName("notes");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(notes)
  return rss({
    title: "Candost's Zettelkasten Notes",
    description: "These are my short notes I like to keep to myself. Yet, I want to make them publicly available. These notes are part of my Slip-Box. I currently have hundreds of notes on my Zettelkasten and I will continue to open them up to public as much as I can.",
    site: baseUrl + "/notes",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((note) => ({
      title: note.data.zettelId + ": " + note.data.title,
      pubDate: note.data.date,
      description: note.data.description ? note.data.description : "",
      link:`${baseUrl}/notes/${note.slug}/`,
      content: sanitizeHtml(parser.render(note.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
