import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const collection = await getCollectionByName("books");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const books = sortPostsByDate(collection);

  return rss({
    title: "Candost's Book Notes",
    description: "I share either a full book review or a single-chapter note from the books I read.",
    site: baseUrl + "/books/",
    stylesheet: '/rss/pretty-feed.xsl',
    items: books.map((book) => {
      let url= book.collection == 'posts' ? `${baseUrl}/${book.slug}/` : `${baseUrl}/${book.collection}/${book.slug}/`;
      let reply = `\n\n---\nReply via [email](mailto:candost@candostdagdeviren.com?subject=Re:%20${url})`;
      let newContent = book.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })

      return {
        title: book.data.title,
        pubDate: book.data.date,
        description: book.data.description ? book.data.description : "",
        link: url,
        content: content,
      }
    }),
  });
};
