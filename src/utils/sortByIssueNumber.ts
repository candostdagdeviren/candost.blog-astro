// `issueNumber` is a string in the schema, so compare it numerically.
export const sortPostsByIssueNumberDec = <T extends { data: { issueNumber?: string | null } }>(
  posts: T[],
): T[] => [...posts].sort((a, b) => Number(b.data.issueNumber) - Number(a.data.issueNumber));
