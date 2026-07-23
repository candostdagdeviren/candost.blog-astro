# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static Astro blog** (candost.blog): SSG only (`output: 'static'`),
no backend, database, or auth. It builds to `dist/` and deploys to Netlify.

### Services / commands

Standard scripts live in `package.json`. There is a single "service" (the Astro dev server):

- `pnpm dev` — dev server at `http://localhost:4321` (port set in `astro.config.mjs`). Hot-reloads on content/source changes.
- `pnpm build` — production build to `dist/` (also emits `sitemap-*.xml` and `robots.txt`).
- `pnpm preview` — serve the built `dist/` output.
- `pnpm astro check` — Astro/TypeScript content + type check (see caveat below).

### Non-obvious caveats

- **pnpm only.** A `preinstall` hook (`only-allow pnpm`) and `engines.pnpm >=10` reject npm/yarn; `package-lock.json`/`yarn.lock` are gitignored to enforce this. Use `pnpm`.
- **`pnpm astro check` currently reports ~73 pre-existing TypeScript errors** (mostly implicit `any` in `src/utils`, `src/components`). These exist on `main`, are unrelated to build, and `astro check` is not wired as a package.json script. Do not treat them as regressions — only worry about new errors you introduce.
- **Ignored build-scripts warning is harmless.** `pnpm install` prints "Ignored build scripts: sharp, esbuild, @parcel/watcher". These ship prebuilt binaries, so `pnpm build`/`pnpm dev` work without approving them. Do NOT run the interactive `pnpm approve-builds`.
- **Content** lives in `src/content/*` collections (schemas in `src/content.config.ts`). Adding a markdown file (e.g. under `src/content/posts/`) is picked up live by the dev server; a build produces one static page per entry.
