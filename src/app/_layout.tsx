import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppTabs from '@/components/app-tabs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep data fresh for 2 min before refetching in background
      staleTime: 2 * 60 * 1000,
      // Retry failed requests once before surfacing the error
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AppTabs />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
