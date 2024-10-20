// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

/**
* title {string} website title
* favicon {string} website favicon url
* description {string} website description
* author {string} author
* avatar {string} Avatar used in the profile
* motto {string} used in the profile
* url {string} Website link
* recentBlogSize {number} Number of recent articles displayed in the sidebar
* archivePageSize {number} Number of articles on archive pages
* postPageSize {number} Number of articles on blog pages
* feedPageSize {number} Number of articles on feed pages
* beian {string} Chinese policy
*/
export const site = {
  title: 'Candost\'s Blog', // required
  favicon: '/favicon.png', // required
  description: 'The personal website of Candost Dagdeviren', // required
  author: "Candost", // required
  avatar: '/avatar.jpg', // required
  url: 'https://candost.blog', // required
  motto: 'Hunting timeless insights into humans and software and helping others on the way.',
  recentPostsSize: 5,
  archivePageSize: 25,
  postPageSize: 10,
  feedPageSize: 20,
  homePageShowcaseSize: 3,
  beian: '',
}

/**
* busuanzi {boolean} link: https://busuanzi.ibruce.info/
* lang {string} Default website language
* codeFoldingStartLines {number}
* ga {string|false}
*/
export const config = {
  busuanzi: false,
  lang: 'en', // en | zh-cn | cs
  codeFoldingStartLines: 16, // Need to re-run the project to take effect
  ga: false // If you want to integrate with Google Analytics, just enter your GA-ID here.
}

/**
* Navigator
* name {string}
* iconClass {string} icon style
* href {string}  link url
* target {string} optional "_self|_blank" open in current window / open in new window
*/
export const categories = [
  {
    name: "Home",
    iconClass: "ri-draft-line",
    href: "/",
  },
  {
    name: "Posts",
    iconClass: "ri-booklet-line",
    href: "/posts/",
  },
  {
    name: "Newsletter",
    iconClass: "ri-newspaper-line",
    href: "/newsletter/",
  },
  {
    name: "Books",
    iconClass: "ri-book-line",
    href: "/books/",
  },
  {
    name: "Notes",
    iconClass: "ri-sticky-note-line",
    href: "/notes/",
  },
  {
    name: "Journal",
    iconClass: "ri-pen-nib-fill",
    href: "/journal/",
  },
  {
    name: "More",
    iconClass: "ri-more-fill",
    href: "javascript:void(0);",
    children: [
      {
        name: "Search",
        iconClass: "ri-search-line",
        href: "/search",
      },
      {
        name: 'About',
        iconClass: 'ri-user-smile-line',
        href: '/about',
      },
      {
        name: "Now",
        iconClass: "ri-timer-flash-line",
        href: "/now/",
      },
      {
        name: 'Follows',
        iconClass: 'ri-user-5-line',
        href: '/friends',
        target: '_self',
      },
    ]
  }
]

/**
* Personal link address
*/
export const infoLinks = [
  {
    icon: 'ri-linkedin-fill',
    name: 'linkedin',
    outlink: 'https://linkedin.com/in/candost',
  },
  {
    icon: 'ri-github-fill',
    name: 'github',
    outlink: 'https://github.com/candostdagdeviren',
  },
  {
    icon: 'ri-rss-fill',
    name: 'rss',
    outlink: '/feeds',
  },
  {
    icon: 'ri-mail-fill',
    name: 'email',
    outlink: 'mailto:contact@candostdagdeviren.com',
  }
]

/**
* donate
* enable {boolean}
* tip {string}
* wechatQRCode: Image addresses should be placed in the public directory.
* alipayQRCode: Image addresses should be placed in the public directory.
* paypalUrl {string}
*/
export const donate = {
  enable: false,
  tip: "Thanks for the coffee !!!☕",
  wechatQRCode: "/WeChatQR.png",
  alipayQRCode: "/AliPayQR.png",
  paypalUrl: "https://paypal.me/candostdagdeviren",
}

/**
* Friendship Links Page
* name {string}
* url {string}
* avatar {string}
* description {string}
*/
export const friendshipLinks =
[
  {
    name: "Tim Ferriss's Blog",
    url: 'https://tim.blog',
    avatar: "https://149346886.v2.pressablecdn.com/wp-content/uploads/2018/07/mos_blog_post.jpg",
    description: 'A cross between Jack Welch and a Buddhist monk.'
  },
  {
    name: "Farnam Street Blog",
    url: 'https://fs.blog',
    avatar: "https://149664534.v2.pressablecdn.com/wp-content/uploads/2021/06/fsblog-logo@2x.png",
    description: 'Noise cancelling headphones for the internet.'
  },
  {
    name: "Tren's Blog",
    url: 'https://25iq.com/',
    avatar: "https://i0.wp.com/25iq.com/wp-content/uploads/2012/10/tren_griffin_crop.jpg?resize=244%2C244&ssl=1",
    description: 'Business, investing, technology, and other aspects of life'
  },
]

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
  enable: false,
  type: 'giscus', // waline | giscus,
  walineConfig:{
    serverUrl: "",
    lang: 'en',
    pageSize: 20,
    wordLimit: '',
    count: 5,
    pageview: true,
    reaction: true,
    requiredMeta: ["nick", "mail"],
    whiteList: ['/now/', '/friends/', '/about/'],
  },

  // giscus config
  giscusConfig: {
    'data-repo': "",
    'data-repo-id': "",
    'data-category': "",
    'data-category-id': "",
    'data-mapping': "",
    'data-strict': "",
    'data-reactions-enabled': "",
    'data-emit-metadata': "",
    'data-input-position': "",
    'data-theme': "",
    'data-lang': "",
    'crossorigin': "",
  }
}
