// Newest first. Returns a copy so callers' collections are never reordered.
export const sortPostsByDate = <T extends { data: { date: Date } }>(posts: T[]): T[] =>
  [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
