import _ from "lodash";
import { dealLabel } from "./dealLabel";
import { filterDrafts } from "./filterDrafts";

const getUniqueTags = (posts) => {
  let tags: string[] = [];
  filterDrafts(posts).forEach((post) => {
    tags = [...tags, ...dealLabel(post.data.tags)].filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index,
    );
  });
  return _.compact(tags);
};

export default getUniqueTags;
