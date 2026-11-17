import type { Post } from '~/types/post';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const posts: Post[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  content: `This is the content for post ${i + 1}`,
  author: `Author ${i + 1}`
}));

export async function getPosts(): Promise<Post[]> {
  await delay(2000); // Simulate network delay
  return posts;
}