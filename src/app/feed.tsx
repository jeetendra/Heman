import { useCallback } from 'react';
import { FlatList, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import {
  FeedCard,
  FeedFooter,
  FeedHeader,
  FeedSkeleton,
  useFeed,
  type FeedPost,
} from '@/features/feed';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const {
    posts,
    totalCount,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useFeed();

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => <FeedCard post={item} />,
    [],
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <FeedHeader totalCount={0} />
        <FeedSkeleton />
      </ThemedView>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ThemedText style={styles.errorEmoji}>⚠️</ThemedText>
        <ThemedText type="smallBold" style={styles.errorTitle}>
          Could not load feed
        </ThemedText>
        <ThemedText type="small" style={{ color: colors.textSecondary, textAlign: 'center' }}>
          {(error as Error).message}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.retryLink, { color: colors.text }]}
          onPress={() => refetch()}
        >
          Tap to retry
        </ThemedText>
      </ThemedView>
    );
  }

  // ── Feed ──────────────────────────────────────────────────────────────────
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={<FeedHeader totalCount={totalCount} />}
        stickyHeaderIndices={[0]}
        ListFooterComponent={
          <FeedFooter
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            postCount={posts.length}
          />
        }
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + Spacing.five,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  errorEmoji: {
    fontSize: 40,
  },
  errorTitle: {
    marginTop: Spacing.two,
    fontSize: 16,
  },
  retryLink: {
    marginTop: Spacing.three,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
