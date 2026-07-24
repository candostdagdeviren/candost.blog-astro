// Builds the canonical path for an entry: posts live at the site root,
// every other collection is prefixed with its collection name.
export const getPostUrl = (
  post: { collection: string; id: string },
  baseUrl = "",
): string =>
  post.collection === "posts"
    ? `${baseUrl}/${post.id}/`
    : `${baseUrl}/${post.collection}/${post.id}/`;
