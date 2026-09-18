/// <reference types="vite/client" />
declare module "virtual:portfolio-content" {
  const value: {
    projects: Array<{
      id: string;
      icon: string;
      title: string;
      org: string;
      body: string;
      tags: string[];
      status: string;
      featured: boolean;
      details: string;
      cover?: string;
      coverAlt?: string;
      gallery?: Array<{
        image: string;
        alt: string;
        caption: string;
        fit?: "cover" | "contain";
        position?: "center" | "top" | "bottom" | "left" | "right";
      }>;
      role?: string;
      period?: string;
      outcome?: string;
    }>;
    posts: Array<{
      title: string;
      slug: string;
      excerpt: string;
      category: string;
      publishedAt: string;
      status: "draft" | "published";
      body: string;
    }>;
  };
  export default value;
}
