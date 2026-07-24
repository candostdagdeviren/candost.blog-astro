import _ from "lodash";
import dayjs from "dayjs";

interface StickyEntry {
  data: { sticky?: number | null; date: Date };
}

export const orderBySticky = <T extends StickyEntry>(posts: T[]) => {
  let handlePosts = posts.map((post) => ({
    ...post,
    sticky: post.data.sticky ? post.data.sticky : 0,
    dateTimestamp: dayjs(post.data.date).valueOf(),
  }));
  return _.orderBy(handlePosts, ["sticky", "dateTimestamp"], ["desc", "desc"]);
};
