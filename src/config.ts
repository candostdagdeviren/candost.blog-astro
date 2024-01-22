// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Candost's Blog";
export const SITE_DESCRIPTION =
  "Candost is a software engineering leader with diverse interest and writes about tech industry and multiple aspects and constraints of the complicated life.";
export const TWITTER_HANDLE = "@candosten";
export const MY_NAME = "Candost Dagdeviren";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
