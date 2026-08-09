import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import type { RSSFeedItem } from "@astrojs/rss";
import { site } from "../consts";
import { getPostUrl } from "./getPostUrl";
const parser = new MarkdownIt();
type FeedEntry = {
  collection: string;
  id: string;
  body: string;
  data: {
    title: string;
    date: Date;
    description?: string | null;
    externalUrl?: string | null;
    externalTitle?: string | null;
  };
};
// Site URL without a trailing slash (https://example.com/ => https://example.com)
export const feedBaseUrl = (): string => site.url.replace(/\/+$/g, "");
const defaultReplyFooter = (url: string): string =>
  `\n\n---\n[Reply via email](mailto:contact@candostdagdeviren.com?subject=Re:%20${url}) | [Reply via Mastodon](https://hachyderm.io/@candost) | [Comment](${url}#waline)`;
type BuildFeedItemsOptions = {
  /** Override the item title (e.g. notes prefix the zettel ID). */
  titleFor?: (entry: any) => string;
  /** Override the reply footer appended to each item (e.g. the German feed). */
  replyFooterFor?: (url: string) => string;
};
// Shared by every rss.xml.ts endpoint: renders each entry's markdown body,
// appends the reply footer, and sanitizes the result.
export const buildFeedItems = (
  entries: FeedEntry[],
  options: BuildFeedItemsOptions = {},
): RSSFeedItem[] => {
  const baseUrl = feedBaseUrl();
  const replyFooterFor = options.replyFooterFor ?? defaultReplyFooter;
  return entries.map((entry) => {
    const url = getPostUrl(entry, baseUrl);
    let markdown = entry.body;
    if (entry.data.externalUrl) {
      const externalTitle = entry.data.externalTitle || entry.data.externalUrl;
      markdown += `\n\nIn response to: [${externalTitle}](${entry.data.externalUrl})`;
    }
    markdown += replyFooterFor(url);
    const body = parser.render(markdown);
    const content = sanitizeHtml(body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    });
    return {
      title: options.titleFor ? options.titleFor(entry) : entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.description ? entry.data.description : "",
      link: url,
      content: content,
    };
  });
};
