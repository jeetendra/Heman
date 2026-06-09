import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';

const IMAGE_SIZE = Math.min(Dimensions.get('window').width, 500);
const SKELETON_CARDS = 4;

function SkeletonCard() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const bg = colors.backgroundElement;

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* header row */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: bg }]} />
        <View style={styles.headerText}>
          <View style={[styles.line, { width: 130, backgroundColor: bg }]} />
          <View style={[styles.line, { width: 90, marginTop: 6, backgroundColor: bg }]} />
        </View>
      </View>
      {/* image placeholder */}
      <View style={[styles.image, { backgroundColor: bg }]} />
      {/* divider */}
      <View style={[styles.divider, { backgroundColor: bg }]} />
    </View>
  );
}

export function FeedSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_CARDS }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.two },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  headerText: { flex: 1, gap: 4 },
  line: { height: 12, borderRadius: 6 },
  image: { width: IMAGE_SIZE, height: IMAGE_SIZE, alignSelf: 'center' },
  divider: { height: 1, marginTop: Spacing.two },
});
