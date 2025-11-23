import rss from "@astrojs/rss";
import {site} from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
const parser = new MarkdownIt();

export async function GET() {
  const collection = await getCollectionByName("posts");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const posts = sortPostsByDate(collection);

  return rss({
    title: "Posts, Essays, and Articles on " + site.title,
    description: "Posts, Essays, Articles that I write in a longer form combining my notes, journal entries, book notes, and my comments, thoughts, etc.",
    site: baseUrl + "/posts/",
    stylesheet: '/rss/pretty-feed.xsl',
    items: posts.map((post) => {
      let url= post.collection == 'posts' ? `${baseUrl}/${post.slug}/` : `${baseUrl}/${post.collection}/${post.slug}/`;
      let reply = `\n\n---\nReply via [email](mailto:candost@candostdagdeviren.com?subject=Re:%20${url})`;
      let newContent = post.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ? post.data.description : "",
        link: url,
        content: content,
      }
    }),
  });
};
