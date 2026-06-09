import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface FeedFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  postCount: number;
}

export function FeedFooter({ isFetchingNextPage, hasNextPage, postCount }: FeedFooterProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  if (isFetchingNextPage) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={colors.textSecondary} />
        <ThemedText type="small" style={{ color: colors.textSecondary }}>
          Loading more...
        </ThemedText>
      </View>
    );
  }

  if (!hasNextPage && postCount > 0) {
    return (
      <View style={styles.container}>
        <ThemedText type="small" style={{ color: colors.textSecondary }}>
          You're all caught up ✅
        </ThemedText>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
});
