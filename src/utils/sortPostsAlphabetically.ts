export const sortPostsAlphabetically = (posts) =>
  [...posts].sort(
    (a, b) => {
      const titleA = a.data?.title || '';
      const titleB = b.data?.title || '';
      return titleA.localeCompare(titleB, 'en-US', { numeric: true });
    }
  );