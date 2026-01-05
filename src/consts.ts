// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
 * title {string} website title
 * favicon {string} website favicon url
 * description {string} website description
 * author {string} author
 * avatar {string} Avatar used in the profile
 * url {string} Website link
 * favoritePostsSize {number} Number of favorite articles displayed in the home page
 * homePageShowcaseSize {number} Number of articles displayed in the home page
 */
export const site = {
  title: "Candost's Blog", // required
  favicon: "/favicon.ico", // required
  description:
    "Hunting timeless insights into humans and software and helping others on the way.", // required
  author: "candost", // required
  avatar: "/avatar.jpg", // required
  url: "https://candost.blog", // required
  favoritePostsSize: 10,
  homePageShowcaseSize: 10,
};

/**
 * lang {string} Default website language
 * codeFoldingStartLines {number}
 * ga {string|false}
 */
export const config = {
  lang: "en", // en | zh-cn | cs
  codeFoldingStartLines: 16, // Need to re-run the project to take effect
  ga: false, // If you want to integrate with Google Analytics, just enter your GA-ID here.
};

/**
 * Navigator
 * name {string}
 * iconClass {string} icon style
 * href {string}  link url
 * target {string} optional "_self|_blank" open in current window / open in new window
 */
export const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Blog",
    href: "/blog/",
  },
  {
    name: "Newsletter",
    href: "/newsletter/",
  },
  {
    name: "About",
    href: "/about/",
  },
  {
    name: "Search",
    href: "/search",
  },
  {
    name: "Guestbook",
    href: "/guestbook/",
    target: "_self",
  },
  {
    name: "Blogroll",
    href: "/blogroll",
    target: "_self",
  },
];

/**
 * Footer Navigator
 * name {string}
 * iconClass {string} icon style
 * href {string}  link url
 * target {string} optional "_self|_blank" open in current window / open in new window
 */
export const footerLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Posts",
    href: "/posts/",
  },
  {
    name: "Newsletter",
    href: "/newsletter/",
  },
  {
    name: "Book Notes",
    href: "/books/",
  },
  {
    name: "Notes",
    href: "/notes/",
  },
  {
    name: "Journal",
    href: "/journal/",
  },
  {
    name: "More",
    href: "javascript:void(0);",
    children: [
      {
        name: "Search",
        href: "/search",
      },
      {
        name: "About",
        href: "/about",
      },
      {
        name: "Now",
        href: "/now/",
      },
      {
        name: "Podcast",
        href: "/podcast/",
        target: "_self",
      },
      {
        name: "Guestbook",
        href: "/guestbook/",
        target: "_self",
      },
      {
        name: "Blogroll",
        href: "/blogroll",
        target: "_self",
      },
    ],
  },
];

/**
 * Personal link address
 */
export const infoLinks = [
  {
    icon: "ri-linkedin-fill",
    name: "linkedin",
    outlink: "https://linkedin.com/in/candost",
  },
  {
    icon: "ri-github-fill",
    name: "github",
    outlink: "https://github.com/candostdagdeviren",
  },
  {
    icon: "ri-rss-fill",
    name: "rss",
    outlink: "/feeds",
  },
  {
    icon: "ri-mail-fill",
    name: "email",
    outlink: "mailto:contact@candostdagdeviren.com",
  },
];

/**
 * Comment Feature
 * enable {boolean}
 * type {string} required waline | giscus
 * walineConfig.serverUrl {string} server link
 * walineConfig.lang {string} link: https://waline.js.org/guide/features/i18n.html
 * walineConfig.pageSize {number} number of comments per page. default 10
 * walineConfig.wordLimit {number} Comment word s limit. When a single number is filled in, it 's the maximum number of comment words. No limit when set to 0
 * walineConfig.count {number} recent comment numbers
 * walineConfig.pageview {boolean} display the number of page views and comments of the article
 * walineConfig.reaction {string | string[]} Add emoji interaction function to the article
 * walineConfig.requiredMeta {string[]}  Set required fields, default anonymous
 * walineConfig.whiteList {string[]} set some pages not to display reaction
 */
export const comment = {
  enable: true,
  type: "waline", // waline | giscus,
  walineConfig: {
    serverUrl: "https://comments.candost.blog",
    lang: "en",
    pageSize: 20,
    wordLimit: "",
    count: 10,
    pageview: true,
    reaction: false,
    requiredMeta: ["nick"],
    whiteList: [
      "/now/",
      "/blogroll/",
      "/about/",
      "/posts/",
      "/books/",
      "/newsletter/",
      "/notes/",
      "/journal/",
    ],
  },
};

/**
 * Blogroll Links Page
 * name {string}
 * url {string}
 * avatar {string}
 * description {string}
 */
export const blogrollList = [
  {
    name: "Tim Ferriss's Blog",
    url: "https://tim.blog",
    description: "A cross between Jack Welch and a Buddhist monk.",
  },
  {
    name: "Farnam Street Blog",
    url: "https://fs.blog",
    description: "Noise cancelling headphones for the internet.",
  },
  {
    name: "Erik Kissane's small internet website",
    url: "https://erinkissane.com/",
    description:
      "Working on governance, risk, and social patterns across federated & decentralized systems. Previously: COVID Tracking Project + Knight Mozilla OpenNews + editorial and community in tech and culture orgs.",
  },
  {
    name: "Tren's Blog",
    url: "https://25iq.com/",
    description: "Business, investing, technology, and other aspects of life",
  },
  {
    name: "A Turn of the Page",
    url: "https://turnofthepage.blog/",
    description: "Books, music, and assorted thoughts from Ian Moore.",
  },
  {
    name: "Working Library",
    url: "https://aworkinglibrary.com/",
    description: "Reading and writing from Mandy Brown",
  },
  {
    name: "Accidentally in Code",
    url: "https://cate.blog/",
    description: "Engineering an Interesting Life by Cate Huston.",
  },
  {
    name: "apenwarr",
    url: "https://apenwarr.ca/log",
    description:
      "wvdial, bup, sshuttle, netselect, popularity-contest, redo, gfblip, GFiber, and now @Tailscale doing WireGuard mesh.",
  },
  {
    name: "Ashley Janssen Consulting",
    url: "https://ashleyjanssen.com/blog/",
    description:
      "Productivity is about being intentional about how you spend your time, energy, and attention in all parts of your life.",
  },
  {
    name: "Brave New Geek",
    url: "https://bravenewgeek.com/",
    description: "Introspections of a software engineer.",
  },
  {
    name: "Carcinisation",
    url: "https://carcinisation.com/",
    description: "One of nature's many attempts to evolve a crab.",
  },
  {
    name: "Charity.wtf",
    url: "https://charity.wtf/",
    description:
      "charity wtf is about technology, databases, startups, engineering management, and whiskey.",
  },
  {
    name: "Craig Mod",
    url: "https://craigmod.com/",
    description: "Essays and updates from craigmod.com",
  },
  {
    name: "Derek Sivers",
    url: "https://sive.rs/",
    description:
      "Derek is a musician, circus performer, entrepreneur, and speaker. Derek is a slow thinker, explorer, xenophile, and loves a different point of view.",
  },
  {
    name: "Cat Hicks, PhD",
    url: "https://www.drcathicks.com/",
    description:
      "Cat is a psychologist studying software teams, a research leader, an empirical interventionist, and a creative entrepreneur.",
  },
  {
    name: "everything changes",
    url: "https://everythingchanges.us/",
    description:
      "Regular posts about what it takes to do your best work—even as everything changes.",
  },
  {
    name: "Fatih Arslan",
    url: "https://arslan.io/",
    description:
      "Software Engineer. Fatih's reflection on his life and hobbies, such as Photography, Design, Programming, and Traveling.",
  },
  {
    name: "Fred Hebert",
    url: "https://ferd.ca/",
    description:
      "Fred Hebert is a staff SRE at Honeycomb.io, caring for SLOs and error budgets, on-call health, alert hygiene, incident response, and operational readiness.",
  },
  {
    name: "Uwe Friedrichsen",
    url: "https://ufried.com/blog/",
    description:
      "Uwe Friedrischen is a CTO, software architect, and consultant with a focus on software architecture, technical leadership, and organizational transformation.",
  },
  {
    name: "Hazel Weakly",
    url: "https://hazelweakly.me/",
    description:
      "Hazel currently spends the days working on building out teams of humans as well as the infrastructure, systems, automation, and tooling to make life better for others.",
  },
  {
    name: "High Scalability",
    url: "https://highscalability.com/",
    description: "Building bigger, faster, more reliable websites.",
  },
  {
    name: "Dan Luu",
    url: "https://danluu.com/",
    description: "Dan Luu is creating programming blog posts.",
  },
  {
    name: "Will Larson",
    url: "https://lethain.com/",
    description:
      "Will is a software engineering leader and writer, currently serving as Carta’s CTO",
  },
  {
    name: "Jessica Kerr",
    url: "https://jessitron.com/blog/",
    description: "Jessica Kerr: software developer, speaker, symmathecist.",
  },
  {
    name: "Kellan Elliott-McCrea",
    url: "https://kellanem.com/",
    description: "Notes on Engineering Leadership.",
  },
  {
    name: "M. Serdar Kuzuloğlu",
    url: "https://www.mserdark.com/",
    description: "Internet Ekipler Amiri",
  },
  {
    name: "Lara Hogan",
    url: "http://larahogan.me/",
    description: "Lara is a Management Coach and Trainer",
  },
  {
    name: "Marc Brooker's Blog",
    url: "https://brooker.co.za/blog",
    description: "Marc is currently an engineer at Amazon Web Services (AWS).",
  },
  {
    name: "Martin Fowler",
    url: "http://martinfowler.com/",
    description:
      "Martin is an author, speaker… essentially a loud-mouthed pundit on the topic of software development, primarily for Enterprise Applications",
  },
  {
    name: "Martin Kleppmann's Blog",
    url: "https://martin.kleppmann.com/",
    description:
      "Martin is an Associate Professor working on local-first software and security protocols at the University of Cambridge.",
  },
  {
    name: "Murat Demirbas",
    url: "https://muratbuffalo.blogspot.com/",
    description:
      "Murat is a principal research scientist at MongoDB Research. The blog is on distributed systems broadly defined and other curiosities.",
  },
  {
    name: "Microservices Architecture",
    url: "https://microservices.io/",
    description: "A pattern language for microservices.",
  },
  {
    name: "Miguel Carranza",
    url: "https://miguelcarranza.es/",
    description: "Reflections on computers & humans by Miguel.",
  },
  {
    name: "Moderne Führung und Agilität",
    url: "https://www.agil-gefuehrt.de/",
    description: "Moderne Führung und Agilität by Jan Hegewald.",
  },
  {
    name: "Musings on Markets by Ashwath Damodaran",
    url: "https://aswathdamodaran.blogspot.com/",
    description:
      "My not-so-profound thoughts about valuation, corporate finance and the news of the day!",
  },
  {
    name: "Neil Gaiman's Journal",
    url: "http://journal.neilgaiman.com/",
    description:
      "Neil started February 2001 when nobody knew what the word Blog meant. Talking about writing, comics, books, films, bees, demonic tomatoes, cats, travel and a dog ever since.",
  },
  {
    name: "Paul Graham",
    url: "https://paulgraham.com/",
    description: "Paul Graham is a programmer, writer, and investor.",
  },
  {
    name: "Rach Smith",
    url: "https://rachsmith.com/",
    description:
      "A developer building software for CodePen, wife, mother of two, productivity nerd and recovering screen addict. This is Rach's digital garden.",
  },
  {
    name: "Rands in Repose",
    url: "https://randsinrepose.com/",
    description: "I love rands writings.",
  },
  {
    name: "Rands Writing Promps",
    url: "https://randsprompts.substack.com/",
    description:
      "Every so often, a new set of three writing prompts will magically appear, along with a smidge of writing advice.",
  },
  {
    name: "Cassidy Williams",
    url: "https://cassidoo.co/",
    description: "Software Engineer in Chicago",
  },
  {
    name: "Slow Travel Berlin",
    url: "https://www.slowtravelberlin.com/",
    description: "A collection of guides on Berlin and Germany.",
  },
  {
    name: "Software Lead Weekly",
    url: "https://softwareleadweekly.com/",
    description:
      "A weekly email for busy people who care about people, culture and leadership.",
  },
  {
    name: "Riccardo Mori",
    url: "https://morrick.me/",
    description: "Writer & Translator",
  },
  {
    name: "The Pragmatic Engineer",
    url: "http://blog.pragmaticengineer.com/",
    description: "Observations across the software engineering industry.",
  },
  {
    name: "Sketchplanations",
    url: "https://sketchplanations.com/",
    description: "Explaining the world one sketch at a time.",
  },
  {
    name: "Jaana Dogan",
    url: "https://medium.com/@rakyll",
    description:
      "Principal Engineer at Google. Gemini API, AI Studio and other AI developer tools. Optimism and simplicity.",
  },
  {
    name: "Surfing Complexity",
    url: "https://surfingcomplexity.blog/",
    description: "Lorin Hochstein's ramblings about software and systems.",
  },
  {
    name: "The Beautiful Mess",
    url: "https://cutlefish.substack.com/",
    description: "The beautiful mess of cross-functional product development.",
  },
  {
    name: "The Hagakure",
    url: "https://hagakure.substack.com/",
    description:
      "A weekly dose of curated practical wisdom for technical leaders.",
  },
  {
    name: "The Kool-Aid Factory",
    url: "https://koolaidfactory.com/",
    description:
      "The Kool-Aid Factory is a series of zines about the ways organizations coordinate.",
  },
  {
    name: "The Prism",
    url: "https://gurwinder.substack.com/",
    description: "A guide to navigating the digital age by Gurwinder.",
  },
  {
    name: "Christian Uhl",
    url: "https://uhl-steine-scherben.org/blog/",
    description: "Thoughts about Engineering Management.",
  },
  {
    name: "Wes Kao's Newsletter",
    url: "https://newsletter.weskao.com/",
    description:
      "A weekly newsletter on how to be a sharper marketer, founder, and builder",
  },
  {
    name: "Steven Pressfield",
    url: "https://stevenpressfield.com/home/",
    description: "Website of author and historian, Steven Pressfield.",
  },
  {
    name: "Financial Preparedness",
    url: "https://financialpreparedness.substack.com/",
    description:
      "Prepare for the unexpected so you can protect your life, health and wealth.",
  },
  {
    name: "Compounding Quality",
    url: "https://www.compoundingquality.net/",
    description: "Ex-professional investor helping other investors.",
  },
  {
    name: "Joshua Burgin",
    url: "https://joshuaburgin.substack.com/",
    description:
      "Diving into tech, business, management, and career tips, sprinkled with occasional detours into philosophy and economics",
  },
  {
    name: "Byte Byte Go",
    url: "https://blog.bytebytego.com/",
    description:
      "Explain complex systems with simple terms, from the authors of the best-selling system design book series.",
  },
];
