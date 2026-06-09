import { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { CreatePostScreen } from '@/features/create-post';
import {
  FeedCard,
  FeedFooter,
  FeedHeader,
  FeedSkeleton,
  useFeed,
  type FeedPost,
} from '@/features/feed';

export default function FeedScreen() {
  const insets  = useSafeAreaInsets();
  const scheme  = useColorScheme() ?? 'light';
  const colors  = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [showCreate, setShowCreate] = useState(false);

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
          paddingTop:    insets.top,
          paddingBottom: insets.bottom + 80, // room for FAB
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />

      {/* ── FAB — open create post ── */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + Spacing.four }]}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.85}
      >
        <ThemedText style={styles.fabIcon}>＋</ThemedText>
      </TouchableOpacity>

      {/* ── Create Post modal ── */}
      <Modal
        visible={showCreate}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowCreate(false)}
      >
        <CreatePostScreen onDismiss={() => setShowCreate(false)} />
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing.two,
    padding:        Spacing.four,
  },
  errorEmoji:  { fontSize: 40 },
  errorTitle:  { marginTop: Spacing.two, fontSize: 16 },
  retryLink: {
    marginTop:          Spacing.three,
    fontSize:           14,
    textDecorationLine: 'underline',
  },
  fab: {
    position:       'absolute',
    right:          Spacing.four,
    width:          56,
    height:         56,
    borderRadius:   28,
    backgroundColor:'#3897f0',
    alignItems:     'center',
    justifyContent: 'center',
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.25,
    shadowRadius:   4,
    elevation:      6,
  },
  fabIcon: { fontSize: 28, color: '#fff', lineHeight: 32 },
});
