import type { Webmention } from "./webmentionFormat";

/**
 * The network half of webmention fetching, kept free of value imports and
 * module state so the failure paths can be unit tested directly.
 *
 * It never throws and never rejects. A missing token, an unreachable host, a
 * non-OK response or malformed JSON all resolve to an empty list plus a
 * warning, because a build must not fail when a third-party service is having
 * a bad day.
 */

export type FetchWebmentionsOptions = {
  api: string;
  domain: string;
  token?: string;
  perPage?: number;
  maxPages?: number;
  /** Injectable so tests can drive the failure paths without a server. */
  fetchImpl?: typeof fetch;
  warn?: (message: string) => void;
  timeoutMs?: number;
};

export const fetchWebmentions = async ({
  api,
  domain,
  token,
  perPage = 500,
  maxPages = 20,
  fetchImpl,
  warn = console.warn,
  timeoutMs = 15000,
}: FetchWebmentionsOptions): Promise<Webmention[]> => {
  if (!token) {
    warn("[webmention] WEBMENTION_IO_TOKEN is not set - building without received mentions.");
    return [];
  }

  const doFetch = fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== "function") {
    warn("[webmention] no fetch implementation available - skipping.");
    return [];
  }

  const collected: Webmention[] = [];

  try {
    for (let page = 0; page < maxPages; page++) {
      const url =
        `${api}?domain=${encodeURIComponent(domain)}` +
        `&token=${encodeURIComponent(token)}&per-page=${perPage}&page=${page}`;

      const response = await doFetch(url, { signal: AbortSignal.timeout(timeoutMs) });

      if (!response?.ok) {
        warn(`[webmention] webmention.io responded ${response?.status} - skipping.`);
        break;
      }

      const body = (await response.json()) as { children?: Webmention[] };
      const batch = Array.isArray(body?.children) ? body.children : [];
      collected.push(...batch);

      // A short page means there is nothing after it.
      if (batch.length < perPage) break;
    }
  } catch (error) {
    // Keep whatever earlier pages returned rather than discarding them: a
    // blip on page 3 should cost that page, not the two that already
    // succeeded. Matches how the non-OK branch above breaks out.
    warn(
      `[webmention] could not reach webmention.io (${(error as Error)?.message ?? error}) - using ${collected.length} mention(s) fetched so far.`,
    );
  }

  return collected;
};
