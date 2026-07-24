import { filterDrafts } from "./filterDrafts";

export const sortPostsByIssueNumberDec = (posts) =>
  filterDrafts(posts).sort((a, b) => b.data.issueNumber - a.data.issueNumber);
