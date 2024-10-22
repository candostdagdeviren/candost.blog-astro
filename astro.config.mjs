import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import solid from '@astrojs/solid-js';
import robotsTxt from "astro-robots-txt";
import {remarkModifiedTime} from "./src/remarkPlugin/remark-modified-time.mjs";
import {resetRemark} from "./src/remarkPlugin/reset-remark.js";
import remarkDirective from "remark-directive";
import {remarkAsides} from  './src/remarkPlugin/remark-asides.js'
import {remarkCollapse} from "./src/remarkPlugin/remark-collapse.js";

import expressiveCode from "astro-expressive-code";
import {pluginLineNumbers} from '@expressive-code/plugin-line-numbers'

import {visit} from 'unist-util-visit'
import {pluginCollapsibleSections} from '@expressive-code/plugin-collapsible-sections'

import netlify from '@astrojs/netlify';

const SERVER_PORT = 4321;
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

function customRehypeLazyLoadImage() {
  return function (tree) {
    visit(tree, function (node) {
      if (node.tagName === 'img') {
        node.properties['data-src'] = node.properties.src
        node.properties.src = '/spinner.gif'
        node.properties['data-alt'] = node.properties.alt
        node.properties.alt = 'default'
      }
    })
  }
}

export default defineConfig({
  site: BASE_URL,
  server: {
    port: SERVER_PORT
  },
  integrations: [
    sitemap(),
    tailwind(),
    solid(),
    expressiveCode({
      plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      themes: ["github-dark", "github-light"],
      styleOverrides: {
        codeFontFamily: "jetbrains-mono",
        uiFontFamily: "jetbrains-mono",
      },
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`
    }),
    mdx(),
    robotsTxt({
      policy: [
        {
          userAgent: 'CCBot',
          disallow: '/',
        },
        {
          userAgent: 'ChatGPT-User',
          disallow: '/',
        },
        {
          userAgent: 'GPTBot',
          disallow: '/',
        },
        {
          userAgent: 'Google-Extended',
          disallow: '/',
        },
        {
          userAgent: 'Omgilibot',
          disallow: '/',
        },
        {
          userAgent: 'FacebookBot',
          disallow: '/',
        },
      ]
    })
  ],

  markdown: {
    remarkPlugins: [remarkModifiedTime, resetRemark, remarkDirective, remarkAsides({}),remarkCollapse({})],
    rehypePlugins: [customRehypeLazyLoadImage],
  },
  vite: {
    ssr: {
      noExternal: ['nanoid']
    }
  },
  output: 'server',
  adapter: netlify(),
  redirects: {
    "/favicon.png": "/favicon.ico",
    "/rss": "/rss.xml",
    "/podcast/rss": "https://api.substack.com/feed/podcast/470204/s/59110.rss",
    "/software-world-with-candost/": "/podcast/",
    "/newsletter/rss": "/newsletter/rss.xml",
    "/books/rss": "/books/rss.xml",
    "/notes/rss": "/notes/rss.xml",
    "/essays/rss.xml": "/posts/rss.xml",
    "/articles/rss/": "/posts/rss.xml",
    "/articles/": "/posts/",
    "/essays/": "/posts/",
    "/mektup": "/newsletter/",
    "/microblog-2022-12/": "/",
    "/short/": "/posts/",
    "/medium/": "/posts/",
    "/long/": "/posts/",
    "/author/candost/": "/about/",
    "/team/": "/journal/explain-how-to-manage-your-team/",
    "/book-review-and-notes/": "/books/",
    "/best-practices/": "/posts/",
    "/work/": "/posts/",
    "/lessons/": "/posts/",
    "/work-life/": "/posts/",
    "/meetings/": "/effective-1-on-1-meetings-own-your-one-on-one-meeting/",
    "/worth-doing-wrong-book-summary-review-and-notes": "/books/worth-doing-wrong-book-summary-review-and-notes/",
    "/reliability-maintainability-and-scalability-in-applications": "/books/reliability-maintainability-and-scalability-in-applications/",
    "/data-models-and-query-languages": "/books/data-models-and-query-languages/",
    "/high-productivity-and-clear-communication-in-different-cultures/": "/books/high-productivity-and-clear-communication-in-different-cultures/",
    "/microservices-and-their-benefits": "/books/microservices-and-their-benefits",
    "/understanding-how-database-transactions-work/": "/books/understanding-how-database-transactions-work/",
    "/how-to-reset-first-commit-in-git/)": "/how-to-reset-first-commit-in-git/",
    "/podcast/sw-19-the-software-architect-role-systems-and-architectural-thinking-1/": "https://candost.substack.com/p/19-software-architect-role-and-archicture",
    "/sw-19-the-software-architect-role-systems-and-architectural-thinking-1/": "https://candost.substack.com/p/19-software-architect-role-and-archicture",
    "/sw-19-the-software-architect-role-systems-and-architectural-thinking-1": "https://candost.substack.com/p/19-software-architect-role-and-archicture",
    "/sw-25-live-pair-programming-open-source-and-building-communities-with-nick-taylor/": "https://candost.substack.com/p/25-live-pair-programming-open-source",
    "/podcast/sw-25-live-pair-programming-open-source-and-building-communities-with-nick-taylor/": "https://candost.substack.com/p/25-live-pair-programming-open-source",
    "/podcast/26-machine-learning-and-data-science-with-jesper-dramsch/": "https://candost.substack.com/p/26-machine-learning-and-data-science",
    "/26-machine-learning-and-data-science-with-jesper-dramsch/": "https://candost.substack.com/p/26-machine-learning-and-data-science",
    "/turn-the-ship-around-book-summary-review-and-notes/": "/books/turn-the-ship-around-summary-book-chapter-notes/",
    "/notes/faucets-and-bad-ideas/": "/faucets-and-bad-ideas/",
    "/data-replication-in-distributed-systems/": "/books/data-replication-in-distributed-systems/",
    "/database-partitioning/": "/books/database-partitioning/",
    "/team-topologies-book-review-summary-and-notes/": "/books/team-topologies-book-review-summary-and-notes/",
    "/the-trouble-with-distributed-systems/": "/books/the-trouble-with-distributed-systems/",
    "/sw-27-problem-solving-skills-for-software-engineers": "https://candost.substack.com/p/27-problem-solving-skills-and-a-strategy-065",
    "/measure-what-matters-by-john-doerr-summary-review-and-book-notes/": "/books/measure-what-matters-by-john-doerr-summary-review-and-book-notes/",
    "/the-evolutionary-architect/": "/books/the-evolutionary-architect/",
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
    "/mektup/mektup-52": "/newsletter/mektup-52/"
  }
});