import _ from "lodash";
import { dealLabel } from "./dealLabel";

interface CategorizedEntry {
  data: { category?: string[] | string | null };
}

const getPostsByCategory = <T extends CategorizedEntry>(
  posts: T[],
  category: string,
): T[] =>
  posts.filter((post) =>
    _.flattenDeep(dealLabel(post.data.category)).includes(category),
  );

export default getPostsByCategory;
