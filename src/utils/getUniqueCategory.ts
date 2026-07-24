import _ from "lodash";
import { dealLabel } from "./dealLabel";
import { filterDrafts } from "./filterDrafts";

const getUniqueCategory = (posts) => {
  let category: string[] = [];
  filterDrafts(posts).forEach((post) => {
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
