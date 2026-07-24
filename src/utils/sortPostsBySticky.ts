interface StickyEntry {
  data: { sticky?: number | null };
}

export const sortPostsBySticky = <T extends StickyEntry>(posts: T[]): T[] =>
  posts
    .filter(({ data }) => data.sticky)
    .sort((a, b) => (b.data.sticky ?? 0) - (a.data.sticky ?? 0));
