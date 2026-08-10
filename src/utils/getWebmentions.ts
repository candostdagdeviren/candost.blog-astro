import { webmention } from "../consts";
import { normalizeTarget, type Webmention } from "./webmentionFormat";

/**
 * Fetches received webmentions from webmention.io at build time.
 *
 * Everything here degrades quietly: no token, an unreachable API, or a
 * malformed response all produce zero mentions and a warning rather than a
 * failed build. Publishing must never depend on a third-party service being
 * up -- the mentions are an enhancement, not the content.
 *
 * The pure formatting and URL-safety helpers live in ./webmentionFormat and
 * are re-exported here so components have a single import.
 */
export * from "./webmentionFormat";

const DEFAULT_API = "https://webmention.io/api/mentions.jf2";
const PER_PAGE = 500;
/** Stop paging even if the API keeps returning full pages. */
const MAX_PAGES = 20;

// import.meta.env covers .env files loaded by Vite; process.env covers CI and
// Netlify build environment variables.
const readEnv = (name: string): string | undefined => {
  const fromVite = (import.meta as any)?.env?.[name];
  const fromNode = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromVite || fromNode || undefined;
};

const readToken = () => readEnv("WEBMENTION_IO_TOKEN");
/** Overridable so a build can be pointed at fixture data instead of the live API. */
const readApi = () => readEnv("WEBMENTION_IO_API") || DEFAULT_API;

let cached: Map<string, Webmention[]> | null = null;

/**
 * All received mentions, grouped by normalised target URL. Fetched once per
 * build and memoised, so every page reuses the same result.
 */
export const getWebmentions = async (): Promise<Map<string, Webmention[]>> => {
  if (cached) return cached;

  const grouped = new Map<string, Webmention[]>();
  cached = grouped;

  if (!webmention.enable) return grouped;

  const token = readToken();
  if (!token) {
    console.warn(
      "[webmention] WEBMENTION_IO_TOKEN is not set - building without received mentions.",
    );
    return grouped;
  }

  const api = readApi();
  const collected: Webmention[] = [];
  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const url =
        `${api}?domain=${encodeURIComponent(webmention.domain)}` +
        `&token=${encodeURIComponent(token)}&per-page=${PER_PAGE}&page=${page}`;

      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) {
        console.warn(`[webmention] webmention.io responded ${response.status} - skipping.`);
        break;
      }

      const body = (await response.json()) as { children?: Webmention[] };
      const batch = Array.isArray(body?.children) ? body.children : [];
      collected.push(...batch);

      if (batch.length < PER_PAGE) break;
    }
  } catch (error) {
    console.warn(
      `[webmention] could not reach webmention.io (${(error as Error)?.message ?? error}) - building without received mentions.`,
    );
    return grouped;
  }

  for (const mention of collected) {
    const target = mention["wm-target"];
    if (!target) continue;
    const key = normalizeTarget(target);
    const list = grouped.get(key);
    if (list) list.push(mention);
    else grouped.set(key, [mention]);
  }

  console.info(`[webmention] ${collected.length} mention(s) across ${grouped.size} page(s).`);
  return grouped;
};
