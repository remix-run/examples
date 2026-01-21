export interface Posts {
  id: number;
  slug: string;
  title: string;
  status: "draft" | "published";
  content: string;
  image: string;
  date_published: string;
  excerpt: string;
}
