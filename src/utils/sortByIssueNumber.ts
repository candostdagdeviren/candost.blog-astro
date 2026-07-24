interface IssueNumberedEntry {
  data: { draft?: boolean | null; issueNumber?: string | null };
}

export const sortPostsByIssueNumberDec = <T extends IssueNumberedEntry>(
  posts: T[],
): T[] =>
  posts
    .filter(({ data }) => {
      return import.meta.env.PROD ? !data.draft : true;
    })
    .sort((a, b) => Number(b.data.issueNumber) - Number(a.data.issueNumber));
