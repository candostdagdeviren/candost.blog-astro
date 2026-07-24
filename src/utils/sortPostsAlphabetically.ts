interface TitledEntry {
  data: { title?: string | null };
}

export const sortPostsAlphabetically = <T extends TitledEntry>(posts: T[]): T[] =>
  [...posts].sort((a, b) => {
    const titleA = a.data?.title || "";
    const titleB = b.data?.title || "";
    return titleA.localeCompare(titleB, "en-US", { numeric: true });
  });
