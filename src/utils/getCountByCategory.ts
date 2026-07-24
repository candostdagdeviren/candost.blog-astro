import _ from "lodash";
import { dealLabel } from "./dealLabel";

interface CategorizedEntry {
  data: { draft?: boolean | null; category?: string[] | string | null };
}

const getCountByCategory = <T extends CategorizedEntry>(posts: T[]) => {
  let category: string[] = [];
  const filteredPosts = posts.filter(({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });
  filteredPosts.forEach((post) => {
    category = _.compact([
      ...category,
      ..._.flattenDeep(dealLabel(post.data.category)),
    ]);
  });
  let result = _.countBy(category);
  if (result["uncategorized"]) {
    let num = result["uncategorized"];
    delete result["uncategorized"];
    result["uncategorized"] = num;
  }
  return result;
};

export default getCountByCategory;
