import rss from '@astrojs/rss';
import {site} from "../consts";
import {getAllContent} from "../utils/getAllContent";
import {sortPostsByDate} from "../utils/sortPostsByDate";

export async function GET(context) {
  const blog = await getAllContent();
  const sortedBlog = sortPostsByDate(blog);
  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    stylesheet: '/rss/pretty-feed.xsl',
    items: sortedBlog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description? post.data.description : "",
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/posts/[slug]` routes
      link: post.collection == 'posts' ? `/${post.slug}/` : `/${post.collection}/${post.slug}/`,
    })),
  });
}
