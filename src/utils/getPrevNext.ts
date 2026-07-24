// Finds the previous/next entries around `entry` in an already-sorted list.
// Matches by id (unique per collection), not title.
export const getPrevNext = <T extends { id: string }>(
  sortedPosts: T[],
  entry: { id: string },
): { prevPost?: T; nextPost?: T } => {
  const index = sortedPosts.findIndex((post) => post.id === entry.id);
  if (index === -1) {
    return {};
  }
  return {
    prevPost: sortedPosts[index - 1],
    nextPost: sortedPosts[index + 1],
  };
};
