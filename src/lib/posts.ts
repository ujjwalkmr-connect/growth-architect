export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  status: "draft" | "published";
  body: string;
};
import content from "virtual:portfolio-content";
export const posts: Post[] = content.posts.sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

