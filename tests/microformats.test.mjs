/**
 * Structural checks for the IndieWeb microformats2 markup.
 *
 * These run against the *built* output in dist/, not the source templates,
 * because microformats are a property of the emitted HTML — a refactor can
 * keep every .astro file looking fine while quietly dropping a class.
 *
 * Run `pnpm build` first, then `pnpm test`.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mf2 } from "microformats-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://candost.blog";

if (!existsSync(DIST)) {
  throw new Error(`No dist/ found at ${DIST}. Run \`pnpm build\` before \`pnpm test\`.`);
}

const trim = (p) => p.replace(/^\/+|\/+$/g, "");
const urlFor = (relPath) => (trim(relPath) ? `${SITE}/${trim(relPath)}/` : `${SITE}/`);

/** Parse a built page. `relPath` is dist-relative, e.g. "" or "posts". */
const parsePage = (relPath) => {
  const file = join(DIST, trim(relPath), "index.html");
  assert.ok(existsSync(file), `expected a built page at /${trim(relPath)}/`);
  return mf2(readFileSync(file, "utf-8"), { baseUrl: urlFor(relPath) });
};

const rootsOfType = (parsed, type) => parsed.items.filter((i) => (i.type ?? []).includes(type));
const prop = (item, name) => item.properties?.[name] ?? [];
/** rel values are space-separated token lists, so match tokens not strings. */
const hasRelToken = (parsed, url, token) =>
  (parsed["rel-urls"]?.[url]?.rels ?? []).includes(token);

/** Map an absolute in-site URL back to a dist-relative path. */
const pathFromUrl = (url) => trim(new URL(url).pathname);

/** Every built page directly under a directory. */
const allPagesUnder = (relDir) => {
  const dir = join(DIST, trim(relDir));
  assert.ok(existsSync(dir), `expected a built directory at /${trim(relDir)}/`);
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dir, d.name, "index.html")))
    .map((d) => `${trim(relDir)}/${d.name}`);
  assert.ok(names.length > 0, `no built pages under /${trim(relDir)}/`);
  return names;
};

/** Entries listed by an h-feed, as dist-relative paths. */
const entriesInFeed = (relPath) => {
  const feed = rootsOfType(parsePage(relPath), "h-feed")[0];
  assert.ok(feed, `expected an h-feed on /${trim(relPath)}/`);
  return (feed.children ?? [])
    .filter((c) => (c.type ?? []).includes("h-entry"))
    .map((c) => prop(c, "url")[0])
    .filter(Boolean)
    .map(pathFromUrl);
};

const LISTING_PAGES = ["posts", "notes", "journal", "books"];

// -------------------------------------------------------------------------

describe("h-card — homepage identity", () => {
  const home = parsePage("");

  test("exactly one h-card is published", () => {
    assert.equal(rootsOfType(home, "h-card").length, 1);
  });

  test("carries a name and a url", () => {
    const card = rootsOfType(home, "h-card")[0];
    assert.equal(prop(card, "name")[0], "Candost");
    assert.equal(prop(card, "url")[0], `${SITE}/`);
  });
});

describe("rel=me / rel=author — identity links", () => {
  const EXPECTED_ME = [
    "https://hachyderm.io/@candost",
    "https://github.com/candostdagdeviren",
    "https://linkedin.com/in/candost",
    "mailto:contact@candostdagdeviren.com",
  ];

  // The homepage uses BlogPost.astro and listing pages use IndexPage.astro.
  // Checking both guards against the two layouts drifting apart.
  for (const [label, page] of [
    ["homepage (BlogPost layout)", ""],
    ["/posts/ (IndexPage layout)", "posts"],
  ]) {
    test(`${label} publishes every rel=me identity link`, () => {
      const parsed = parsePage(page);
      for (const url of EXPECTED_ME) {
        assert.ok(
          (parsed.rels.me ?? []).includes(url),
          `${url} missing from rel=me on ${label}`,
        );
        assert.ok(hasRelToken(parsed, url, "me"), `${url} lost its "me" rel token`);
      }
    });
  }

  test("rel=author points at the homepage h-card", () => {
    // Entries carry no visible byline, so parsers rely on this to find the author.
    assert.ok((parsePage("").rels.author ?? []).includes(`${SITE}/`));
  });
});

describe("h-entry — content pages", () => {
  // Every entry page is checked, not a sample. Templates are shared, so one
  // page per collection would catch a template regression — but not a page
  // whose own content breaks the markup, and not a template that only some
  // entries use. Parsing the whole site costs a few seconds.
  //
  // Paths come from the feeds (which list every post, note, journal entry and
  // book note) so renaming or adding content never needs a test edit.
  const collections = {
    "essays + newsletter": entriesInFeed("posts"),
    notes: entriesInFeed("notes"),
    journal: entriesInFeed("journal"),
    books: entriesInFeed("books"),
    german: allPagesUnder("de"),
  };

  for (const [kind, paths] of Object.entries(collections)) {
    describe(`${kind} (${paths.length} pages)`, () => {
      test("pages were discovered", () => {
        assert.ok(paths.length > 0, `no ${kind} pages found to check`);
      });

      test("every page publishes exactly one h-entry", () => {
        const bad = paths.filter((p) => rootsOfType(parsePage(p), "h-entry").length !== 1);
        assert.deepEqual(bad, [], `pages without exactly one h-entry: ${bad.join(", ")}`);
      });

      test("every h-entry has a non-empty p-name", () => {
        const bad = paths.filter((p) => {
          const entry = rootsOfType(parsePage(p), "h-entry")[0];
          return !entry || !prop(entry, "name")[0]?.trim();
        });
        assert.deepEqual(bad, [], `pages missing p-name: ${bad.join(", ")}`);
      });

      test("every h-entry has non-empty e-content", () => {
        const bad = paths.filter((p) => {
          const entry = rootsOfType(parsePage(p), "h-entry")[0];
          return !entry || !prop(entry, "content")[0]?.value?.trim();
        });
        assert.deepEqual(bad, [], `pages missing e-content: ${bad.join(", ")}`);
      });
    });
  }
});

describe("h-feed — listing pages", () => {
  for (const page of LISTING_PAGES) {
    describe(`/${page}/`, () => {
      test("publishes exactly one h-feed", () => {
        assert.equal(rootsOfType(parsePage(page), "h-feed").length, 1);
      });

      test("h-feed contains h-entry children", () => {
        const feed = rootsOfType(parsePage(page), "h-feed")[0];
        const children = (feed.children ?? []).filter((c) => (c.type ?? []).includes("h-entry"));
        assert.ok(children.length > 0, `no h-entry children in /${page}/`);
      });

      test("every child h-entry has a p-name and u-url", () => {
        const feed = rootsOfType(parsePage(page), "h-feed")[0];
        for (const child of feed.children ?? []) {
          if (!(child.type ?? []).includes("h-entry")) continue;
          assert.ok(prop(child, "name")[0]?.trim(), `entry without p-name in /${page}/`);
          assert.ok(prop(child, "url")[0], `entry without u-url in /${page}/`);
        }
      });
    });
  }
});

describe("h-feed — deliberate exclusions", () => {
  // The homepage renders its cards twice (Recent + Most popular) and /blog/
  // renders them again. Marking those up would emit duplicate h-entry items
  // for the same posts, which is why h-feed is scoped to the pages above.
  for (const [label, page] of [
    ["homepage", ""],
    ["/blog/", "blog"],
  ]) {
    test(`${label} deliberately publishes no h-feed`, () => {
      assert.equal(
        rootsOfType(parsePage(page), "h-feed").length,
        0,
        `${label} gained an h-feed — cards render more than once there, so this ` +
          `would emit duplicate entries for the same posts.`,
      );
    });
  }
});
