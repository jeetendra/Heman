import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';


function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

const fetchPosts = async () => {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts");
  return posts.json();
}


export default function HomeScreen() {

  const insets = useSafeAreaInsets();

  const { data: posts, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  })

  return (
    <ThemedView style={styles.container}>
      <SafeAreaProvider>
        <ScrollView style={styles.scrollView} contentContainerStyle={{
          // Smoothly injects dynamic padding to the top and bottom of the list
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 16,
        }}>
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Welcome to&nbsp;Expo
            </ThemedText>
          </ThemedView>

          <ThemedText type="code" style={styles.code}>
            get started
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.stepContainer}>
            <HintRow
              title="Try editing"
              hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
            />
            <HintRow title="Dev tools" hint={getDevMenuHint()} />
            <HintRow
              title="Fresh start"
              hint={<ThemedText type="code">npm run reset-project</ThemedText>}
            />
          </ThemedView>


          <ThemedView>
            {
              posts?.map(d => {
                return <>
                  <ThemedText type="title" style={styles.title}>
                    {d.title}
                  </ThemedText>
                  <ThemedText type="code" style={styles.code}>
                    {d.body}
                  </ThemedText>
                </>
              })
            }
          </ThemedView>
        </ScrollView>
      </SafeAreaProvider>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5', // This background color will fill the whole screen beautifully
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
