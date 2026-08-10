/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** webmention.io read token; without it the build renders no mentions. */
  readonly WEBMENTION_IO_TOKEN?: string;
  /** Overrides the webmention.io API base, for pointing a build at fixtures. */
  readonly WEBMENTION_IO_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
