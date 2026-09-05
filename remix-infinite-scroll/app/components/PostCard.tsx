import type { Post } from '~/types/post';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="p-4 border rounded-lg mb-4 shadow-sm">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-2">{post.content}</p>
      <p className="text-sm text-gray-500">By {post.author}</p>
    </div>
  );
}