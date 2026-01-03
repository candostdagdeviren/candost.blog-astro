import rss from "@astrojs/rss";
import { site } from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
const parser = new MarkdownIt();

export async function GET() {
  const collection = await getCollectionByName("notes");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const notes = sortPostsByDate(collection);
  return rss({
    title: "Candost's Notes",
    description:
      "These are my short notes I like to keep to myself. Yet, I want to make them publicly available. These notes are part of my Slip-Box. I currently have hundreds of notes on my Zettelkasten and I will continue to open them up to public as much as I can.",
    site: baseUrl + "/notes/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: notes.map((note) => {
      let url =
        note.collection == "posts"
          ? `${baseUrl}/${note.slug}/`
          : `${baseUrl}/${note.collection}/${note.slug}/`;
      let reply = `\n\n---\n[Reply via email](mailto:contact@candostdagdeviren.com?subject=Re:%20${url}) | [Reply via Mastodon](https://hachyderm.io/@candost) | [Comment](${url}#waline) | [Buy me a coffee](https://www.ko-fi.com/candost)`;
      let newContent = note.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });

      return {
        title: note.data.zettelId + ": " + note.data.title,
        pubDate: note.data.date,
        description: note.data.description ? note.data.description : "",
        link: url,
        content: content,
      };
    }),
  });
}
