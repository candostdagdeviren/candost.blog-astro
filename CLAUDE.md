# CLAUDE.md

Personal blog (candost.blog): Astro 7 on the [Astro Yi](https://github.com/cirry/astro-yi) theme, deployed to Netlify from `main`. Most work is either adding/editing markdown in `src/content/` or maintaining the theme code around it.

`AGENTS.md` is a symlink to this file, so tools looking for either name get the same instructions. Edit this file; there is nothing to keep in sync.

## Commands

pnpm only — `preinstall` enforces it, and npm/yarn lockfiles are gitignored. Node is pinned by `.nvmrc` (22.18.0).

- `pnpm install --frozen-lockfile` — run this first if `node_modules` looks stale; a missing devDependency shows up as a confusing test crash, not a clear error
- `pnpm dev` — dev server at http://localhost:4321
- `pnpm build` — production build; also validates every content file's frontmatter against the collection schemas
- `pnpm test` — Node's built-in test runner over `tests/**/*.test.mjs`
- `pnpm test:build` — `build` then `test`, which is the combination that actually proves a change
- `pnpm preview` — serve the production build

### Verifying a change

**`pnpm test:build` is the gate.** The microformats tests parse the built HTML in `dist/`, so `pnpm test` on its own passes or fails against whatever the last build left behind — always build first. CI (`.github/workflows/test.yml`) runs exactly this pair.

**`pnpm check` is currently broken and is not a gate.** `astro check` needs TypeScript's programmatic API, which the native TypeScript 7 compiler does not ship yet; it fails with a compatibility error rather than reporting real diagnostics. Don't treat its failure as a problem with your change, and don't add it to CI until the toolchain catches up. There is no working type gate right now, so lean on `pnpm test:build`.

## Architecture

- `src/content.config.ts` — zod schemas for all seven collections, built from a shared `baseFields` plus per-collection extras. A new frontmatter field must be added here before content can use it: unknown keys are silently stripped, never an error, so a typo'd field just vanishes.
- `src/content/<collection>/` — the markdown itself: `posts`, `journal`, `newsletter`, `notes` (Zettelkasten), `books`, `podcast`, `de` (German-language posts).
- `src/pages/` — file-based routes, roughly one index per collection, plus per-collection `rss.xml.ts` feeds.
- `src/utils/` — small pure helpers. `getAllContent.ts` aggregates every collection for listings and feeds; `getPostUrl.ts` owns the canonical URL shape (posts live at the site root, every other collection is prefixed by its name). Both need updating when a collection is added.
- `src/utils/getWebmentions.ts` + `webmentionFetch.ts` + `webmentionFormat.ts` — received webmentions, fetched once per build. Deliberately cannot fail a build; mentions are an enhancement, not content.
- `src/remarkPlugin/` — custom remark plugins (asides, collapse, reset), wired up in `astro.config.mjs`.
- `src/consts.ts` — site-wide config: nav, footer, `rel="me"` identity links, feature toggles.
- `src/i18n/` — UI strings, keyed like `post.dateFormat`.
- `astro.config.mjs` — also holds a long `redirects` map preserving old permalinks. Leave those entries alone; each one is a URL someone may still be linking to.
- UI is Astro components with Solid.js islands in `src/components`, styled with Tailwind 4 plus SCSS/CSS in `src/styles`.

## Content

The content folder is the point of the site — treat it as the user's writing, not as code. Don't reword, restructure, or "improve" prose in `src/content/` unless asked; adding or correcting frontmatter is usually the whole job.

Every collection requires `title` and `date`; `draft: true` hides an entry in production builds only. Dates are ISO 8601 and parsed by zod as dates — both `2026-08-21T06:05:00.000Z` and `2026-08-11T08:48:00` appear in the corpus. Collection-specific fields:

- `notes`: `zettelId` (required, a string like `"84"`)
- `posts` and `newsletter`: optional `newsletterName`, `issueNumber`; `posts` also has `favorite`
- `journal`: optional `externalUrl` and `externalTitle`, for entries responding to something published elsewhere
- `podcast`: optional `externalUrl`

Filenames become slugs, so renaming a content file changes a live URL — add a redirect in `astro.config.mjs` if you do.

In markdown, indent nested code snippets by 2 spaces (not 0 or 4).

## Conventions

- Imports are relative throughout. The `$`/`$components` tsconfig aliases are configured but unused — don't start using them.
- Annotate function signatures with TypeScript types. Several older `src/utils/` helpers predate this and are still untyped.
- Comments explain *why*, not *what*. The webmention and microformats modules are the model. Don't add narration to self-evident code, and never delete existing comments or docstrings.
- Prefer the smallest change that fits existing theme patterns. Ask before adding a dependency or introducing a new technology.
- `.astro/` and `dist/` are generated and gitignored; don't commit or hand-edit them.

## Environment

`.env` is gitignored; `.env.example` lists what's needed. Only `WEBMENTION_IO_TOKEN` (optional, for webmention.io) is read today. Builds work without it — webmentions just come back empty.
