import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { FeedPost } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const IMAGE_SIZE = Math.min(Dimensions.get('window').width, 500);

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(elapsed / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface FeedCardProps {
  post: FeedPost;
}

export function FeedCard({ post }: FeedCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);

  function toggleLike() {
    setLiked((wasLiked) => {
      setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
      return !wasLiked;
    });
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Image
          source={{ uri: post.user.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.headerMeta}>
          <ThemedText type="smallBold">{post.user.username}</ThemedText>
          {post.location ? (
            <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 11 }}>
              📍 {post.location}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" style={{ color: colors.textSecondary, fontSize: 11 }}>
          {timeAgo(post.createdAt)}
        </ThemedText>
      </View>

      {/* ── Post image ─────────────────────────────────────────────────── */}
      <Image
        source={{ uri: post.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{ blurhash: 'LGF5?xYk^6#M@-5c,1J5@[or[Q6.' }}
      />

      {/* ── Action bar ─────────────────────────────────────────────────── */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={toggleLike} activeOpacity={0.7}>
          <ThemedText style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {formatCount(likeCount)}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <ThemedText style={styles.actionIcon}>💬</ThemedText>
          <ThemedText type="small" style={{ color: colors.textSecondary }}>
            {formatCount(post.commentsCount)}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <ThemedText style={styles.actionIcon}>🔗</ThemedText>
        </TouchableOpacity>
      </View>

      {/* ── Caption ────────────────────────────────────────────────────── */}
      {post.caption ? (
        <View style={styles.caption}>
          <ThemedText type="smallBold">{post.user.username} </ThemedText>
          <ThemedText type="small" style={styles.captionText}>
            {post.caption}
          </ThemedText>
        </View>
      ) : null}

      {/* ── Divider ────────────────────────────────────────────────────── */}
      <View style={[styles.divider, { backgroundColor: colors.backgroundElement }]} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerMeta: {
    flex: 1,
    gap: 2,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    fontSize: 22,
  },
  caption: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  captionText: {
    flexShrink: 1,
    lineHeight: 18,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: Spacing.two,
  },
});
