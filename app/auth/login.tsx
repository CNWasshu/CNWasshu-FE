import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CourseColors } from '@/constants/course-colors';
import { useKakaoLogin } from '@/hooks/auth/use-kakao-login';

const KAKAO_YELLOW = '#FEE500';
const KAKAO_TEXT = '#191919';

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function buildKakaoAuthUrl(clientId: string, redirectUri: string) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string; error?: string }>();
  const { errorMessage: loginErrorMessage, isSubmitting, login, reset } = useKakaoLogin();
  const [configErrorMessage, setConfigErrorMessage] = useState<string | null>(null);
  const handledCodeRef = useRef<string | null>(null);

  const clientId = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI;

  useEffect(() => {
    const code = firstParam(params.code);
    if (!code || handledCodeRef.current === code) {
      return;
    }

    if (!redirectUri) {
      setConfigErrorMessage('카카오 로그인 설정이 올바르지 않습니다. 환경변수를 확인해 주세요.');
      return;
    }

    handledCodeRef.current = code;
    void (async () => {
      const response = await login(code, redirectUri);
      if (response) {
        router.replace('/');
      }
    })();
  }, [login, params.code, redirectUri, router]);

  const handlePressKakaoLogin = () => {
    setConfigErrorMessage(null);
    reset();

    if (!clientId || !redirectUri) {
      setConfigErrorMessage('카카오 로그인 설정이 올바르지 않습니다. 환경변수를 확인해 주세요.');
      return;
    }

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.location.href = buildKakaoAuthUrl(clientId, redirectUri);
      }
      return;
    }

    // TODO: 네이티브(iOS/Android)는 WebView 또는 딥링크 기반 카카오 로그인 연동 필요
    setConfigErrorMessage('네이티브 카카오 로그인은 아직 지원되지 않습니다.');
  };

  const kakaoParamErrorMessage = firstParam(params.error)
    ? '카카오 로그인이 취소되었습니다.'
    : null;
  const errorMessage = configErrorMessage ?? loginErrorMessage ?? kakaoParamErrorMessage;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroBadge}>CNWASSHU</Text>
          <Text style={styles.heroTitle}>로그인</Text>
          <Text style={styles.heroDescription}>
            카카오 계정으로 간편하게{`\n`}시작해 보세요.
          </Text>
        </View>

        <View style={styles.body}>
          {isSubmitting ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={CourseColors.primary} />
              <Text style={styles.loadingText}>로그인 처리 중이에요.</Text>
            </View>
          ) : (
            <Pressable style={styles.kakaoButton} onPress={handlePressKakaoLogin}>
              <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
            </Pressable>
          )}

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.primary },
  container: { flex: 1, backgroundColor: CourseColors.background },
  hero: {
    backgroundColor: CourseColors.primary,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: 12,
  },
  heroBadge: {
    color: '#E6F3E3',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  heroTitle: { color: CourseColors.white, fontSize: 30, fontWeight: '900' },
  heroDescription: { color: '#E4EFE1', fontSize: 14, lineHeight: 22, marginTop: 3 },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 22,
    marginTop: 40,
    gap: 16,
  },
  loadingCard: {
    minHeight: 56,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  loadingText: { color: CourseColors.muted, fontWeight: '600' },
  kakaoButton: {
    minHeight: 56,
    backgroundColor: KAKAO_YELLOW,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoButtonText: { color: KAKAO_TEXT, fontWeight: '900', fontSize: 16 },
  error: { color: CourseColors.error, textAlign: 'center' },
});
