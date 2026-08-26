import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { CourseColors } from '@/constants/course-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getAccessToken } from '@/utils/auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 로그인 없이 접근 가능한 유일한 화면. 나머지는 전부 토큰이 없으면 여기로 리다이렉트된다.
const PUBLIC_PATH = 'auth/login';

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const token = await getAccessToken();
      if (isMounted) {
        setHasToken(!!token);
        setIsCheckingAuth(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }
    const currentPath = segments.join('/');
    if (!hasToken && currentPath !== PUBLIC_PATH) {
      router.replace('/auth/login');
    }
  }, [isCheckingAuth, hasToken, segments, router]);

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: CourseColors.background }}>
        <ActivityIndicator size="large" color={CourseColors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGate>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="course/index" options={{ title: '나의 코스' }} />
          <Stack.Screen name="course/[id]" options={{ title: '코스 상세' }} />
          <Stack.Screen name="course/ai" options={{ title: 'AI 코스 추천' }} />
          <Stack.Screen name="timetable/index" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/mypage" options={{ headerShown: false }} />
          <Stack.Screen name="bookmark/index" options={{ headerShown: false }} />
          <Stack.Screen name="activity/[id]" options={{ headerShown: false }}/>
          <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }}/>
          <Stack.Screen name="reservation/[id]" options={{headerShown: false,}}/>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthGate>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
