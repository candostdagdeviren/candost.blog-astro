import rss from "@astrojs/rss";
import { site } from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
const parser = new MarkdownIt();

export async function GET() {
  const entries = await getCollectionByName("journal");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const journalEntries = sortPostsByDate(entries);
  return rss({
    title: "Candost's Journal",
    description:
      "These are entries to my journal such as link to a post, a short comment, life update, etc. that I want to save",
    site: baseUrl + "/journal/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: journalEntries.map((entry) => {
      let url =
        entry.collection == "posts"
          ? `${baseUrl}/${entry.slug}/`
          : `${baseUrl}/${entry.collection}/${entry.slug}/`;
      let reply = `\n\n---\n[Reply via email](mailto:contact@candostdagdeviren.com?subject=Re:%20${url}) | [Reply via Mastodon](https://hachyderm.io/@candost) | [Comment](${url}#waline)`;
      let newContent = entry.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });

      return {
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.data.description ? entry.data.description : "",
        link: url,
        content: content,
      };
    }),
  });
}
