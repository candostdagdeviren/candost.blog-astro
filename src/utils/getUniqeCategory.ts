import _ from "lodash";
import { dealLabel } from "./dealLabel";

interface CategorizedEntry {
  data: { draft?: boolean | null; category?: string[] | string | null };
}

const getUniqueCategory = <T extends CategorizedEntry>(posts: T[]) => {
  let category: string[] = [];
  const filteredPosts = posts.filter(({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  filteredPosts.forEach((post) => {
    category = [
      ...category,
      ..._.flattenDeep(dealLabel(post.data.category)),
    ].filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index,
    );
  });
  return _.compact(category);
};

export default getUniqueCategory;
