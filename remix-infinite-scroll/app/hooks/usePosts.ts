import { useInfiniteQuery, type UseInfiniteQueryOptions } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { Post } from '~/types/post';

export type PostsResponse = {
  posts: Post[];
  nextPage: number | null;
};

export const fetchPosts = async ({ pageParam = 1 }: { pageParam?: unknown } = {}): Promise<PostsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = await fetch(`/api/posts?page=${Number(pageParam)}&limit=10`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

type UsePostsOptions = Partial<UseInfiniteQueryOptions<PostsResponse, Error, InfiniteData<PostsResponse>>>;

export function usePosts(options?: UsePostsOptions) {
  return useInfiniteQuery<PostsResponse, Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    ...options,
  });
}