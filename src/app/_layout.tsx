import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"


const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
