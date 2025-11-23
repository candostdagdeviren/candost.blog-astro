import rss from "@astrojs/rss";
import {site} from "../../consts";
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import { sortPostsByDate } from '../../utils/sortPostsByDate';
import getPostsByTag from "../../utils/getPostsByTag";
import { getAllContent } from "src/utils/getAllContent";
const parser = new MarkdownIt();

export async function GET() {
  const allPosts = await getAllContent();
  const newsletters = getPostsByTag(allPosts, "mediations");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssNewsletters = sortPostsByDate(newsletters)

  return rss({
    title: "Mediations",
    description: "Timeless insights into humans, software, and leadership.",
    site: baseUrl + "/newsletter/",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((letter) => {
      let url= letter.collection == 'posts' ? `${baseUrl}/${letter.slug}/` : `${baseUrl}/${letter.collection}/${letter.slug}/`;
      let reply = `\n\n---\n[Reply via email](mailto:contact@candostdagdeviren.com?subject=Re:%20${url}) | [Reply via Mastodon](https://hachyderm.io/@candost) | [Comment](${url}#waline) | [Buy me a coffee](https://www.ko-fi.com/candost)`;
      let newContent = letter.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      })

      return {
        title: `${letter.data.newsletterName} #${letter.data.issueNumber}: ${letter.data.title}`,
        pubDate: letter.data.date,
        description: letter.data.description ? letter.data.description : "",
        link: url,
        content: content,
      }
    }),
  });
};
