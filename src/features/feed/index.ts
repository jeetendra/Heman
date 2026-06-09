/**
 * Public API for the feed feature.
 *
 * The app layer (src/app/) should only ever import from here —
 * never reach into subfolders directly. This keeps the feature's
 * internals free to change without affecting outside consumers.
 */

// Hook
export { useFeed } from './hooks/useFeed';

// UI components needed by the screen
export { FeedCard } from './components/FeedCard';
export { FeedFooter } from './components/FeedFooter';
export { FeedHeader } from './components/FeedHeader';
export { FeedSkeleton } from './components/FeedSkeleton';

// Types the screen needs to annotate (e.g. renderItem)
export type { FeedPost } from './types';
