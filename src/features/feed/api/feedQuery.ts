import { gqlFetch } from '@/shared/lib/graphqlClient';
import type { FeedPage } from '../types';

export const FEED_PAGE_SIZE = 5;

const FEED_QUERY = `
  query GetFeed($first: Int!, $after: String) {
    feed(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          imageUrl
          caption
          likesCount
          commentsCount
          location
          createdAt
          user {
            id
            username
            avatarUrl
          }
        }
      }
    }
  }
`;

export async function fetchFeedPage({
  pageParam,
}: {
  pageParam: string | null;
}): Promise<FeedPage> {
  return gqlFetch<FeedPage>(FEED_QUERY, {
    first: FEED_PAGE_SIZE,
    after: pageParam ?? null,
  });
}
