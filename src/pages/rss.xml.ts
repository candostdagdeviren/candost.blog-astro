import rss from '@astrojs/rss';
import {site} from "../consts";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import {getAllContent} from "../utils/getAllContent";
import {sortPostsByDate} from "../utils/sortPostsByDate";
const parser = new MarkdownIt();

export async function GET() {
  const blog = await getAllContent();

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const sortedBlog = sortPostsByDate(blog);

  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    stylesheet: '/rss/pretty-feed.xsl',
    items: sortedBlog.map((post) => {
      let url= post.collection == 'posts' ? `${baseUrl}/${post.slug}/` : `${baseUrl}/${post.collection}/${post.slug}/`;
      let reply = `\n\n---\n[Reply via email](mailto:contact@candostdagdeviren.com?subject=Re:%20${url})`;
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
}
