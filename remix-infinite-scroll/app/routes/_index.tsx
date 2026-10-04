import { defer } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense, useCallback, useRef } from 'react';
import { LoadingState, LoadingState2 } from '~/components/LoadingState';
import { PostsList } from '~/components/PostsList';
import { getPosts } from '~/utils/api';
import type { Post } from '~/types/post';
import { usePosts, type PostsResponse } from '~/hooks/usePosts';
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver';

export async function loader({ request }: LoaderFunctionArgs) {
  const postsPromise = getPosts();
  
  return defer({
    posts: postsPromise
  });
}

export default function Index() {
  const { posts: initialPostsPromise } = useLoaderData<typeof loader>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <Suspense fallback={<LoadingState />}>
        <Await resolve={initialPostsPromise}>
          {(initialPosts: Post[]) => {
            const {
              data,
              fetchNextPage,
              hasNextPage,
              isFetchingNextPage
            } = usePosts({
              initialData: {
                pages: [{ posts: initialPosts, nextPage: 2 }],
                pageParams: [1]
              }
            });

            useIntersectionObserver({
              target: loadMoreRef,
              onIntersect: () => {
                if (!isFetchingNextPage) {
                  fetchNextPage();
                }
              },
              enabled: !!hasNextPage
            });

            const posts = data?.pages?.flatMap((page) => page.posts) ?? [];

            return (
              <>
                <PostsList posts={posts} />
                {hasNextPage && (
                  <div 
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center"
                  >
                    {isFetchingNextPage ? (
                      <LoadingState2 />
                    ) : (
                      <span>Load more posts...</span>
                    )}
                  </div>
                )}
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}