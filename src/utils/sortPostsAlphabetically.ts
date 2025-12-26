export const sortPostsAlphabetically = (posts) =>
  posts.sort(
    (a, b) => {
      return a.data.title.localeCompare(b.data.title, 'en-US', { numeric: true });
    }
  );