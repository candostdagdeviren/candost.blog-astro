import dayjs from "dayjs";

interface DatedEntry {
  data: { date: Date };
}

export const sortPostsByDate = <T extends DatedEntry>(posts: T[]): T[] =>
  posts.sort((a, b) => dayjs(b.data.date).unix() - dayjs(a.data.date).unix());
