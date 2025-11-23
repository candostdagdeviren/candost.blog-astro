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
    items: sortedBlog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description? post.data.description : "",
      link: post.collection == 'posts' ? `${baseUrl}/${post.slug}/` : `${baseUrl}/${post.collection}/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
}
