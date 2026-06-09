import { StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';


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

            {
              posts?.map(d => {
                return <ThemedView key={d.id}>
                  <ThemedText type="title" style={styles.title2}>
                    {d.title}
                  </ThemedText>
                  <ThemedText type="small" style={styles.description}>
                    {d.body}
                  </ThemedText>
                </ThemedView>
              })
            }
          
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
  title2: {
    fontSize: 16,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    lineHeight: 14,
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
