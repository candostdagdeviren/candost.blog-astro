// Single source of truth for the draft rule: drafts are hidden in
// production builds and visible during local development.
export const filterDrafts = <T extends { data: { draft?: boolean | null } }>(
  entries: T[],
): T[] =>
  entries.filter(({ data }) => (import.meta.env.PROD ? !data.draft : true));
