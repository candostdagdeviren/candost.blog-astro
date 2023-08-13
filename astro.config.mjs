/* eslint-disable turbo/no-undeclared-env-vars */
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

/*
  We are doing some URL mumbo jumbo here to tell Astro what the URL of your website will be.
  In local development, your SEO meta tags will have localhost URL.
  In built production websites, your SEO meta tags should have your website URL.
  So we give our website URL here and the template will know what URL to use
  for meta tags during build.
  If you don't know your website URL yet, don't worry about this
  and leave it empty or use localhost URL. It won't break anything.
*/
import netlify from "@astrojs/netlify/functions";
const SERVER_PORT = 3000;
// the url to access your blog during local development
const LOCALHOST_URL = `http://localhost:${SERVER_PORT}`;
// the url to access your blog after deploying it somewhere (Eg. Netlify)
const LIVE_URL = "https://candost.blog";
// this is the astro command your npm script runs
const SCRIPT = process.env.npm_lifecycle_script || "";
const isBuild = SCRIPT.includes("astro build");
let BASE_URL = LOCALHOST_URL;
// When you're building your site in local or in CI, you could just set your URL manually
if (isBuild) {
  BASE_URL = LIVE_URL;
}

// https://astro.build/config
export default defineConfig({
  server: {
    port: SERVER_PORT
  },
  site: BASE_URL,
  integrations: [sitemap(), tailwind({
    config: {
      applyBaseStyles: false
    }
  })],
  output: "hybrid",
  adapter: netlify(),
  redirects: {
    "/rss": "/rss.xml",
    "/podcast/rss": "https://api.substack.com/feed/podcast/470204/s/59110.rss",
    "/newsletter/rss": "/newsletter/rss.xml",
    "/books/rss": "/books/rss.xml",
    "/notes/rss": "/notes/rss.xml",
    "/mektup": "/newsletter/",
    "/microservices-and-their-benefits": "/books/microservices-and-their-benefits",
    "/why-should-you-deploy-your-code-in-smaller-chunks-and-release-software-often": "/newsletter/mektup-6/",
    "/mektup/mektup-1": "/newsletter/mektup-1/",
    "/mektup/mektup-2": "/newsletter/mektup-2/",
    "/mektup/mektup-3": "/newsletter/mektup-3/",
    "/mektup/mektup-4": "/newsletter/mektup-4/",
    "/mektup/mektup-5": "/newsletter/mektup-5/",
    "/mektup/mektup-6": "/newsletter/mektup-6/",
    "/mektup/mektup-7": "/newsletter/mektup-7/",
    "/mektup/mektup-8": "/newsletter/mektup-8/",
    "/mektup/mektup-9": "/newsletter/mektup-9/",
    "/mektup/mektup-10": "/newsletter/mektup-10/",
    "/mektup/mektup-11": "/newsletter/mektup-11/",
    "/mektup/mektup-12": "/newsletter/mektup-12/",
    "/mektup/mektup-13": "/newsletter/mektup-13/",
    "/mektup/mektup-14": "/newsletter/mektup-14/",
    "/mektup/mektup-15": "/newsletter/mektup-15/",
    "/mektup/mektup-16": "/newsletter/mektup-16/",
    "/mektup/mektup-17": "/newsletter/mektup-17/",
    "/mektup/mektup-18": "/newsletter/mektup-18/",
    "/mektup/mektup-19": "/newsletter/mektup-19/",
    "/mektup/mektup-20": "/newsletter/mektup-20/",
    "/mektup/mektup-21": "/newsletter/mektup-21/",
    "/mektup/mektup-22": "/newsletter/mektup-22/",
    "/mektup/mektup-23": "/newsletter/mektup-23/",
    "/mektup/mektup-24": "/newsletter/mektup-24/",
    "/mektup/mektup-25": "/newsletter/mektup-25/",
    "/mektup/mektup-26": "/newsletter/mektup-26/",
    "/mektup/mektup-27": "/newsletter/mektup-27/",
    "/mektup/mektup-28": "/newsletter/mektup-28/",
    "/mektup/mektup-29": "/newsletter/mektup-29/",
    "/mektup/mektup-30": "/newsletter/mektup-30/",
    "/mektup/mektup-31": "/newsletter/mektup-31/",
    "/mektup/mektup-32": "/newsletter/mektup-32/",
    "/mektup/mektup-33": "/newsletter/mektup-33/",
    "/mektup/mektup-34": "/newsletter/mektup-34/",
    "/mektup/mektup-35": "/newsletter/mektup-35/",
    "/mektup/mektup-36": "/newsletter/mektup-36/",
    "/mektup/mektup-37": "/newsletter/mektup-37/",
    "/mektup/mektup-38": "/newsletter/mektup-38/",
    "/mektup/mektup-39": "/newsletter/mektup-39/",
    "/mektup/mektup-40": "/newsletter/mektup-40/",
    "/mektup/mektup-41": "/newsletter/mektup-41/",
    "/mektup/mektup-42": "/newsletter/mektup-42/",
    "/mektup/mektup-43": "/newsletter/mektup-43/",
    "/mektup/mektup-44": "/newsletter/mektup-44/",
    "/mektup/mektup-45": "/newsletter/mektup-45/",
    "/mektup/mektup-46": "/newsletter/mektup-46/",
    "/mektup/mektup-47": "/newsletter/mektup-47/",
    "/mektup/mektup-48": "/newsletter/mektup-48/",
    "/mektup/mektup-49": "/newsletter/mektup-49/",
    "/mektup/mektup-50": "/newsletter/mektup-50/",
    "/mektup/mektup-51": "/newsletter/mektup-51/",
    "/mektup/mektup-52": "/newsletter/mektup-52/",
  }
});