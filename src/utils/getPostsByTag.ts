import _ from "lodash";
import { dealLabel } from "./dealLabel";

interface TaggedEntry {
  data: { tags?: string[] | string | null };
}

const getPostsByTag = <T extends TaggedEntry>(posts: T[], tag: string): T[] =>
  posts.filter((post) =>
    _.flattenDeep(dealLabel(post.data.tags)).includes(tag),
  );
export default getPostsByTag;
