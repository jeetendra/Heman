import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchFeedPage, FEED_PAGE_SIZE } from '../api/feedQuery';
import type { FeedPost } from '../types';

export { FEED_PAGE_SIZE };

export function useFeed() {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchFeedPage,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.feed.pageInfo.hasNextPage
        ? lastPage.feed.pageInfo.endCursor
        : undefined,
  });

  const posts: FeedPost[] =
    query.data?.pages.flatMap((page) =>
      page.feed.edges.map((edge) => edge.node),
    ) ?? [];

  const totalCount = query.data?.pages[0]?.feed.totalCount ?? 0;

  return { ...query, posts, totalCount };
}
