import _ from "lodash";
import { dealLabel } from "./dealLabel";

interface TaggedEntry {
  data: { draft?: boolean | null; tags?: string[] | string | null };
}

const getCountByTagName = <T extends TaggedEntry>(posts: T[]) => {
  let tags: string[] = [];
  const filteredPosts = posts.filter(({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  filteredPosts.forEach((post) => {
    tags = _.compact([...tags, ..._.flattenDeep(dealLabel(post.data.tags))]);
  });
  return _.countBy(tags);
};

export default getCountByTagName;
