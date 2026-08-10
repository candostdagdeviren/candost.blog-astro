import { webmention } from "../consts";
import { fetchWebmentions } from "./webmentionFetch";
import { normalizeTarget, type Webmention } from "./webmentionFormat";

/**
 * Received webmentions, fetched once per build and grouped by target URL.
 *
 * The network half lives in ./webmentionFetch and the pure formatting and
 * URL-safety helpers in ./webmentionFormat; both are re-exported here so
 * components have a single import. Neither can throw, so this never fails a
 * build -- mentions are an enhancement, not the content.
 */
export * from "./webmentionFormat";

const DEFAULT_API = "https://webmention.io/api/mentions.jf2";

// import.meta.env covers .env files loaded by Vite; process.env covers CI and
// Netlify build environment variables.
const readEnv = (name: keyof ImportMetaEnv): string | undefined => {
  const fromVite = import.meta.env?.[name];
  const fromNode = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return fromVite || fromNode || undefined;
};

const load = async (): Promise<Map<string, Webmention[]>> => {
  const grouped = new Map<string, Webmention[]>();
  if (!webmention.enable) return grouped;

  const mentions = await fetchWebmentions({
    api: readEnv("WEBMENTION_IO_API") || DEFAULT_API,
    domain: webmention.domain,
    token: readEnv("WEBMENTION_IO_TOKEN"),
  });

  for (const mention of mentions) {
    const target = mention["wm-target"];
    if (!target) continue;
    const key = normalizeTarget(target);
    const list = grouped.get(key);
    if (list) list.push(mention);
    else grouped.set(key, [mention]);
  }

  if (mentions.length > 0) {
    console.info(`[webmention] ${mentions.length} mention(s) across ${grouped.size} page(s).`);
  }
  return grouped;
};

/**
 * Memoised on the *promise*, not the result.
 *
 * Caching the map itself would publish an empty container to any caller that
 * arrives while the first fetch is still in flight, and that page would render
 * "no mentions" even though it has some. Holding the promise makes every
 * caller await the same completed result, regardless of how Astro schedules
 * page rendering.
 */
let pending: Promise<Map<string, Webmention[]>> | null = null;

export const getWebmentions = (): Promise<Map<string, Webmention[]>> => {
  // load() is not expected to reject, but a memoised rejection would poison
  // every remaining page of the build, so the guarantee is made explicit here
  // rather than relied on.
  pending ??= load().catch((error) => {
    console.warn(`[webmention] unexpected failure (${error?.message ?? error}) - skipping.`);
    return new Map<string, Webmention[]>();
  });
  return pending;
};
