export interface FeedUser {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface FeedPost {
  id: string;
  imageUrl: string;
  caption: string | null;
  likesCount: number;
  commentsCount: number;
  location: string | null;
  createdAt: string;
  user: FeedUser;
}

export interface FeedPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface FeedPage {
  feed: {
    totalCount: number;
    pageInfo: FeedPageInfo;
    edges: Array<{ cursor: string; node: FeedPost }>;
  };
}
