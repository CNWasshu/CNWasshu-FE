import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { type Href, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { OnboardingApiError, onboardingApi } from '@/api/onboardingApi';
import { CourseColors } from '@/constants/course-colors';
import { APP_FONT_ASSETS, applyGlobalTypography } from '@/constants/typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { clearTokens, getAccessToken } from '@/utils/auth';

export const unstable_settings = {
  anchor: '(tabs)',
};

const PUBLIC_PATHS = ['auth/login', 'auth/signup'];

function isOnboardingExemptPath(path: string) {
  return (
    path === 'auth/onboarding' ||
    path === 'onboarding' ||
    path.startsWith('onboarding/')
  );
}

const AuthCheckingContext = createContext(true);

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const currentPath = segments.join('/');

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const onboardingCheckedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const isPublicPath = PUBLIC_PATHS.includes(currentPath);
      const isOnboardingPath = isOnboardingExemptPath(currentPath);

      if (
        !isPublicPath &&
        !isOnboardingPath &&
        onboardingCheckedTokenRef.current === null
      ) {
        setIsCheckingAuth(true);
      }

      const token = await getAccessToken();

      if (!isMounted) {
        return;
      }

      if (!token) {
        onboardingCheckedTokenRef.current = null;

        if (!isPublicPath) {
          setIsCheckingAuth(true);
          router.replace('/auth/login');
          return;
        }

        setIsCheckingAuth(false);
        return;
      }

      if (isPublicPath) {
        setIsCheckingAuth(false);
        return;
      }

      if (isOnboardingPath) {
        setIsCheckingAuth(false);
        return;
      }

      if (onboardingCheckedTokenRef.current === token) {
        setIsCheckingAuth(false);
        return;
      }

      setIsCheckingAuth(true);

      try {
        const onboarding = await onboardingApi.getStatus(token);

        if (!isMounted) {
          return;
        }

        if (onboarding.onboardingStatus === 'NOT_STARTED') {
          router.replace('/onboarding' as Href);
          return;
        }

        onboardingCheckedTokenRef.current = token;
        setIsCheckingAuth(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof OnboardingApiError && error.status === 401) {
          await clearTokens();

          if (!isMounted) {
            return;
          }

          onboardingCheckedTokenRef.current = null;
          setIsCheckingAuth(true);
          router.replace('/auth/login');
          return;
        }

        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [currentPath, router]);

  return (
    <AuthCheckingContext.Provider value={isCheckingAuth}>
      {children}
    </AuthCheckingContext.Provider>
  );
}

function ScreenAuthGate({ children }: { children: React.ReactNode }) {
  const isCheckingAuth = useContext(AuthCheckingContext);

  if (isCheckingAuth) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: CourseColors.background,
        }}
      >
        <ActivityIndicator size="large" color={CourseColors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts(APP_FONT_ASSETS);

  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: CourseColors.background,
        }}
      >
        <ActivityIndicator size="large" color={CourseColors.primary} />
      </View>
    );
  }

  if (fontsLoaded) {
    applyGlobalTypography();
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthGate>
        <Stack
          screenLayout={({ children }) => (
            <ScreenAuthGate>{children}</ScreenAuthGate>
          )}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="course/index" options={{ title: '나의 코스' }} />
          <Stack.Screen name="course/[id]" options={{ title: '코스 상세' }} />
          <Stack.Screen
            name="course/edit/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="course/ai" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/mypage" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/onboarding"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notification/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="notification/settings"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="survey/index" options={{ headerShown: false }} />
          <Stack.Screen name="survey/result" options={{ headerShown: false }} />
          <Stack.Screen name="stamp/index" options={{ headerShown: false }} />
          <Stack.Screen name="stamp/scan" options={{ headerShown: false }} />
          <Stack.Screen
            name="bookmark/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="activity/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="restaurant/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reservation/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reservation/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
      </AuthGate>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}