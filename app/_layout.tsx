import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { type Href, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { OnboardingApiError, onboardingApi } from '@/api/onboardingApi';
import { CourseColors } from '@/constants/course-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { clearTokens, getAccessToken } from '@/utils/auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

// 로그인 없이 접근 가능한 화면들. 나머지는 전부 토큰이 없으면 로그인 화면으로 리다이렉트된다.
const PUBLIC_PATHS = ['auth/login', 'auth/signup'];

function isOnboardingExemptPath(path: string) {
  return path === 'auth/onboarding' || path === 'onboarding' || path.startsWith('onboarding/');
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const onboardingCheckedTokenRef = useRef<string | null>(null);

  // segments(=현재 라우트)가 바뀔 때마다 토큰을 매번 새로 읽는다.
  // 로그인 직후처럼 토큰이 방금 저장된 상태에서도 정확히 판단하기 위함
  // (마운트 시 1회만 체크하고 캐시해두면, 로그인 성공 후 새 라우트로 이동해도
  // 캐시된 값이 없다고 나와서 곧바로 /auth/login으로 튕겨버리는 버그가 있었음).
  useEffect(() => {
    let isMounted = true;
    const currentPath = segments.join('/');
    if (
      onboardingCheckedTokenRef.current === null &&
      !PUBLIC_PATHS.includes(currentPath) &&
      !isOnboardingExemptPath(currentPath)
    ) {
      setIsCheckingAuth(true);
    }

    (async () => {
      const token = await getAccessToken();
      if (!isMounted) {
        return;
      }
      if (!token && !PUBLIC_PATHS.includes(currentPath)) {
        // 리다이렉트만 걸어두고 isCheckingAuth는 false로 바꾸지 않는다.
        // 그래야 실제로 /auth/login으로 라우트가 바뀌기 전까지 children(홈 등)이
        // 먼저 렌더링돼서 미인증 상태로 API를 호출해버리는 걸 막을 수 있다.
        // 라우트가 바뀌면 segments가 바뀌어 이 effect가 다시 실행되고,
        // 그때 currentPath가 PUBLIC_PATHS에 포함되어 정상적으로 로딩이 풀린다.
        router.replace('/auth/login');
        return;
      }
      if (!token) onboardingCheckedTokenRef.current = null;

      if (
        token &&
        !PUBLIC_PATHS.includes(currentPath) &&
        !isOnboardingExemptPath(currentPath) &&
        onboardingCheckedTokenRef.current !== token
      ) {
        try {
          const onboarding = await onboardingApi.getStatus(token);
          if (!isMounted) return;

          onboardingCheckedTokenRef.current = token;
          if (onboarding.onboardingStatus === 'NOT_STARTED') {
            router.replace('/onboarding' as Href);
            return;
          }
        } catch (error) {
          if (!isMounted) return;

          if (error instanceof OnboardingApiError && error.status === 401) {
            await clearTokens();
            if (!isMounted) return;
            onboardingCheckedTokenRef.current = null;
            router.replace('/auth/login');
            return;
          }

          // 일시적인 상태 조회 실패가 앱 전체 진입을 막지 않도록 기존 화면을 유지한다.
        }
      }
      setIsCheckingAuth(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [segments, router]);

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
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/mypage" options={{ headerShown: false }} />
          <Stack.Screen name="auth/onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
          <Stack.Screen name="notification/index" options={{ headerShown: false }} />
          <Stack.Screen name="notification/settings" options={{ headerShown: false }} />
          <Stack.Screen name="survey/index" options={{ headerShown: false }} />
          <Stack.Screen name="survey/result" options={{ headerShown: false }} />
          <Stack.Screen name="stamp/index" options={{ headerShown: false }} />
          <Stack.Screen name="stamp/scan" options={{ headerShown: false }} />
          <Stack.Screen name="bookmark/index" options={{ headerShown: false }} />
          <Stack.Screen name="activity/[id]" options={{ headerShown: false }}/>
          <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }}/>
          <Stack.Screen name="reservation/[id]" options={{headerShown: false,}}/>
          <Stack.Screen name="reservation/index" options={{headerShown: false,}}/>
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthGate>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
