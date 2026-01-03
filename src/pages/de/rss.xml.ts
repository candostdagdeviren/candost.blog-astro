import rss from "@astrojs/rss";
import { site } from "../../consts";
import { getCollectionByName } from "src/utils/getCollectionByName";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { sortPostsByDate } from "../../utils/sortPostsByDate";
const parser = new MarkdownIt();

export async function GET() {
  const collection = await getCollectionByName("de");

  let baseUrl = site.url;
  // removing trailing slash if found
  // https://example.com/ => https://example.com
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const germanPosts = sortPostsByDate(collection);

  return rss({
    title: "Candosts deutscher Blogeinträge",
    description:
      "Ich lerne Deutch und möchte üben. Deshalb habe ich mich entschlossen, in meinem Blog eine Abteilung zum Thema Deutch einzurichten.",
    site: baseUrl + "/de/",
    stylesheet: "/rss/pretty-feed.xsl",
    items: germanPosts.map((artikel) => {
      let url =
        artikel.collection == "posts"
          ? `${baseUrl}/${artikel.slug}/`
          : `${baseUrl}/${artikel.collection}/${artikel.slug}/`;
      let reply = `\n\n---\n[per E-Mail antworten](mailto:candost@candostdagdeviren.com?subject=Re:%20${url})`;
      let newContent = artikel.body + `${reply}`;
      let body = parser.render(newContent);

      let content = sanitizeHtml(body, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });

      return {
        title: artikel.data.title,
        pubDate: artikel.data.date,
        description: artikel.data.description ? artikel.data.description : "",
        link: url,
        content: content,
      };
    }),
  });
}
