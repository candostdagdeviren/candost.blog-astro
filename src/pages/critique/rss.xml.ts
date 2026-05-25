import rss from "@astrojs/rss";
import { site } from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
const parser = new MarkdownIt();

export async function GET() {
  const entries = await getCollectionByName("critique");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const critiqueEntries = sortPostsByDate(entries);
  return rss({
    title: "Candost's Critique",
    description:
      "Short critical responses to posts, talks, books, and other things worth engaging with.",
    site: baseUrl + "/critique/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: critiqueEntries.map((entry) => {
      let url =
        entry.collection == "posts"
          ? `${baseUrl}/${entry.id}/`
          : `${baseUrl}/${entry.collection}/${entry.id}/`;
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
