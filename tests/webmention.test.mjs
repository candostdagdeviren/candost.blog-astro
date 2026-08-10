/**
 * Unit tests for the webmention helpers.
 *
 * These operate on data supplied by whoever sent the mention, so the URL
 * handling is a security boundary rather than a formatting detail. Imported
 * directly from source (not from built output) because the module is pure and
 * has no dependencies -- see tests/microformats.test.mjs for the markup checks.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  safeExternalUrl,
  normalizeTarget,
  displayName,
  mentionsFor,
  REACTION_PROPERTIES,
  RESPONSE_PROPERTIES,
} from "../src/utils/webmentionFormat.ts";

describe("safeExternalUrl — refuses anything that is not http(s)", () => {
  for (const hostile of [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "not a url at all",
    "",
  ]) {
    test(`rejects ${JSON.stringify(hostile)}`, () => {
      assert.equal(safeExternalUrl(hostile), undefined);
    });
  }

  test("rejects undefined", () => {
    assert.equal(safeExternalUrl(undefined), undefined);
  });

  for (const allowed of ["https://example.com/post", "http://example.com/post"]) {
    test(`allows ${allowed}`, () => {
      assert.equal(safeExternalUrl(allowed), allowed);
    });
  }
});

describe("normalizeTarget — matches URLs that differ only cosmetically", () => {
  const canonical = "https://candost.blog/journal/entry";

  for (const variant of [
    "https://candost.blog/journal/entry",
    "https://candost.blog/journal/entry/",
    "https://candost.blog/journal/entry//",
    "https://CANDOST.blog/journal/entry/",
    "https://candost.blog/journal/entry/#section",
    "https://candost.blog/journal/entry/?utm_source=rss",
  ]) {
    test(`${variant} normalises to the same target`, () => {
      assert.equal(normalizeTarget(variant), normalizeTarget(canonical));
    });
  }

  test("keeps genuinely different paths apart", () => {
    assert.notEqual(
      normalizeTarget("https://candost.blog/journal/one"),
      normalizeTarget("https://candost.blog/journal/two"),
    );
  });
});

describe("mentionsFor — looks up by normalised target", () => {
  const mention = { "wm-target": "https://candost.blog/a/", "wm-property": "in-reply-to" };
  const all = new Map([[normalizeTarget("https://candost.blog/a/"), [mention]]]);

  test("finds mentions when the trailing slash differs", () => {
    assert.deepEqual(mentionsFor(all, "https://candost.blog/a"), [mention]);
  });

  test("returns an empty list for a page with none", () => {
    assert.deepEqual(mentionsFor(all, "https://candost.blog/b/"), []);
  });
});

describe("displayName — falls back sensibly", () => {
  test("prefers the author name", () => {
    assert.equal(displayName({ author: { name: "Molly White" } }), "Molly White");
  });

  test("ignores a blank author name", () => {
    assert.equal(
      displayName({ author: { name: "   " }, "wm-source": "https://tantek.com/notes/2" }),
      "tantek.com",
    );
  });

  test("falls back to the source host without www.", () => {
    assert.equal(displayName({ "wm-source": "https://www.example.com/x" }), "example.com");
  });

  test("does not leak a hostile source into the name", () => {
    assert.equal(displayName({ "wm-source": "javascript:alert(1)" }), "Someone");
  });

  test("handles a mention with nothing usable", () => {
    assert.equal(displayName({}), "Someone");
  });
});

describe("property groupings are disjoint", () => {
  test("no property is both a reaction and a response", () => {
    const overlap = REACTION_PROPERTIES.filter((p) => RESPONSE_PROPERTIES.includes(p));
    assert.deepEqual(overlap, []);
  });
});
