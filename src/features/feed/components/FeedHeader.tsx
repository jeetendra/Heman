import { StyleSheet, useColorScheme, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

interface FeedHeaderProps {
  totalCount: number;
}

export function FeedHeader({ totalCount }: FeedHeaderProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.bar, { backgroundColor: colors.background, borderBottomColor: colors.backgroundElement }]}>
      <ThemedText style={styles.title}>📸 Feed</ThemedText>
      {totalCount > 0 && (
        <ThemedText type="small" style={{ color: colors.textSecondary }}>
          {totalCount} posts
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
});
