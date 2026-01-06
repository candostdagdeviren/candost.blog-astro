import dayjs from "dayjs";
export const sortPostsByDate = (posts) =>
  posts.sort((a, b) => dayjs(b.data.date).unix() - dayjs(a.data.date).unix());
