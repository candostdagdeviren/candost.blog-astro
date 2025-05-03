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
    description: "I always feel like I'm mediating (or maybe negotiating) between multiple aspects and constraints of the complicated life and searching for the balance between leadership, software engineering, personal life, and the world. This is the feed of emails I send.",
    site: baseUrl + "/newsletter",
    stylesheet: '/rss/pretty-feed.xsl',
    items: rssNewsletters.map((letter) => ({
      title: letter.data.title,
      pubDate: letter.data.date,
      description: letter.data.description ? letter.data.description : "",
      link: letter.collection == 'posts' ? `${baseUrl}/${letter.slug}` : `${baseUrl}/${letter.collection}/${letter.slug}`,
      content: sanitizeHtml(parser.render(letter.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
    })),
  });
};
