# AGENTS.md

Personal blog (candost.blog) built with Astro 6 on the Astro Yi theme, deployed to Netlify from `main`. Most work is either adding/editing markdown in `src/content/` or maintaining the Astro theme code.

## Commands

pnpm only — `preinstall` enforces it and npm/yarn lockfiles are gitignored.

- `pnpm dev` — dev server at http://localhost:4321
- `pnpm check` — `astro check` (type + template diagnostics)
- `pnpm build` — production build; also validates all content frontmatter against the collection schemas
- `pnpm preview` — serve the production build

There is no test suite. Verification for any change is `pnpm build` plus `pnpm check` (both are CI gates) — `pnpm check` must report 0 errors.

## Architecture

- `src/content.config.ts` — zod schemas for all seven content collections. A new frontmatter field must be added here before content can use it (unknown fields are silently stripped, not errors).
- `src/content/<collection>/` — markdown content: posts, journal, newsletter, notes (Zettelkasten), books, podcast, de (German-language posts).
- `src/pages/` — file-based routes, roughly one index per collection, plus RSS/JSON feeds.
- `src/utils/getAllContent.ts` — aggregates collections for listings and feeds; update it when adding a collection.
- `src/remarkPlugin/` — custom remark plugins wired up in `astro.config.mjs`.
- `src/consts.ts` — site-wide config (nav, socials, footer, features).
- `src/i18n/` — UI strings.
- UI is Astro components with Solid.js islands in `src/components`, styled with Tailwind 4 and SCSS in `src/styles`.

## Content frontmatter

Every collection requires `title` and `date`; `draft: true` hides an entry. Dates are full ISO timestamps like `2026-05-08T06:05:00.000Z` (UTC). Collection-specific fields:

- notes: `zettelId` is required
- posts: optional `favorite`, `newsletterName`, `issueNumber`
- journal and podcast: optional `externalUrl` for externally published entries; journal also has `externalTitle`

## Conventions

- Imports are relative throughout the codebase. The `$`/`$components` tsconfig aliases exist but are unused — don't mix them in.
- Add TypeScript type annotations to function signatures.
- No explanatory code comments, and never delete existing comments or docstrings.
- Prefer the smallest change that respects the existing theme patterns; ask before adding new dependencies or technologies.
- In markdown content, indent nested code snippets by 2 spaces (not 0 or 4).

## Imported Claude Cowork project instructions

This is my personal blog. Don't be intrusive. The content folder is sacred. However, it lacks a lot of frontend development's best practices. Recommend improvements on the way. I might only add a content or make changes to the codebase. Clarify if you are not sure what I'm trying to achieve in a session.
