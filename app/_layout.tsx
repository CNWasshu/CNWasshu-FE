import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="course/index" options={{ title: '나의 코스' }} />
        <Stack.Screen name="course/[id]" options={{ title: '코스 상세' }} />
        <Stack.Screen name="course/ai" options={{ title: 'AI 코스 추천' }} />
        <Stack.Screen name="timetable/index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/mypage" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
