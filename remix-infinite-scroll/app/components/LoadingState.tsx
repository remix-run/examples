import { PostSkeleton } from './PostSkeleton';

export function LoadingState() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading posts">
      <div className="flex items-center justify-center">首次加载中...</div>
      {Array.from({ length: 3 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}


export function LoadingState2() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading posts">
      <div className="flex items-center justify-center">之后的加载...</div>
      {Array.from({ length: 3 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}