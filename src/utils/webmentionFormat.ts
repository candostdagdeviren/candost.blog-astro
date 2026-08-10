/**
 * Pure helpers for handling received webmentions.
 *
 * Deliberately free of imports and side effects: everything here operates on
 * untrusted third-party data, so it is kept separate from the fetching layer
 * and unit tested directly (see tests/webmention.test.mjs).
 */

export type WebmentionAuthor = {
  name?: string;
  url?: string;
  photo?: string;
};

/** A single mention in webmention.io's jf2 shape. */
export type Webmention = {
  author?: WebmentionAuthor;
  url?: string;
  published?: string | null;
  content?: { text?: string; html?: string };
  "wm-id"?: number;
  "wm-source"?: string;
  "wm-target"?: string;
  /** in-reply-to | like-of | repost-of | bookmark-of | mention-of */
  "wm-property"?: string;
  "wm-received"?: string;
};

/** Reactions worth counting rather than quoting. */
export const REACTION_PROPERTIES = ["like-of", "repost-of", "bookmark-of"] as const;
/** Mentions worth showing with their text. */
export const RESPONSE_PROPERTIES = ["in-reply-to", "mention-of"] as const;

/**
 * Targets are compared after normalising, because the URL someone linked to
 * rarely matches ours byte for byte -- trailing slashes, query strings,
 * fragments and host casing all differ in practice.
 */
export const normalizeTarget = (url: string): string => {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.href.replace(/\/+$/, "");
  } catch {
    return url.replace(/\/+$/, "").toLowerCase();
  }
};

/**
 * Only http(s) links may be rendered. Mention data comes from arbitrary
 * external sites, so a javascript:, data: or vbscript: URL must never reach
 * an href attribute.
 */
export const safeExternalUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : undefined;
  } catch {
    return undefined;
  }
};

/** A display name for a mention, falling back to the source host. */
export const displayName = (mention: Webmention): string => {
  const name = mention.author?.name?.trim();
  if (name) return name;
  const source = safeExternalUrl(mention["wm-source"] ?? mention.url);
  if (!source) return "Someone";
  try {
    return new URL(source).hostname.replace(/^www\./, "");
  } catch {
    return "Someone";
  }
};

/** Mentions received by one page, from a map keyed by normalised target. */
export const mentionsFor = (
  all: Map<string, Webmention[]>,
  target: string,
): Webmention[] => all.get(normalizeTarget(target)) ?? [];
