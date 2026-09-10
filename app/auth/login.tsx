import * as Linking from 'expo-linking';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { useKakaoLogin } from '@/hooks/auth/use-kakao-login';
import { useLogin } from '@/hooks/auth/use-login';

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
  const params = useLocalSearchParams<{ code?: string; error?: string }>();
  const { errorMessage: loginErrorMessage, isSubmitting, login, reset } = useKakaoLogin();
  const {
    errorMessage: basicLoginErrorMessage,
    isSubmitting: isBasicLoginSubmitting,
    login: basicLogin,
    reset: resetBasicLogin,
  } = useLogin();
  const [configErrorMessage, setConfigErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handledCodeRef = useRef<string | null>(null);

  const clientId = process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI;
  // 네이티브(Expo Go/디바이스)용. 카카오 콘솔은 http(s) redirect_uri만 받아준다.
  // 단, Expo Go는 Universal Links를 설정할 수 없어서 ASWebAuthenticationSession이
  // http(s) 리다이렉트를 안정적으로 가로채지 못하는 근본적인 제약이 있다 — dev client 필요.
  const nativeRedirectUri = process.env.EXPO_PUBLIC_KAKAO_NATIVE_REDIRECT_URI;

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
    // 성공 시 홈/온보딩 이동은 useKakaoLogin 내부에서 처리한다 (isNewUser 분기 포함).
    void login(code, redirectUri);
  }, [login, params.code, redirectUri]);

  const handlePressBasicLogin = async () => {
    setConfigErrorMessage(null);
    resetBasicLogin();
    await basicLogin(email.trim(), password);
  };

  const handlePressKakaoLogin = async () => {
    setConfigErrorMessage(null);
    reset();

    if (!clientId) {
      setConfigErrorMessage('카카오 로그인 설정이 올바르지 않습니다. 환경변수를 확인해 주세요.');
      return;
    }

    if (Platform.OS === 'web') {
      if (!redirectUri) {
        setConfigErrorMessage('카카오 로그인 설정이 올바르지 않습니다. 환경변수를 확인해 주세요.');
        return;
      }
      if (typeof window !== 'undefined') {
        window.location.href = buildKakaoAuthUrl(clientId, redirectUri);
      }
      return;
    }

    if (!nativeRedirectUri) {
      setConfigErrorMessage('네이티브 카카오 로그인 설정이 올바르지 않습니다. EXPO_PUBLIC_KAKAO_NATIVE_REDIRECT_URI를 확인해 주세요.');
      return;
    }

    // 네이티브: 인앱 브라우저로 카카오 인가 화면을 열고, nativeRedirectUri로 이동을 시도하면
    // (실제로 그 페이지가 로드되지 않아도) 그 URL을 가로채서 인가코드를 꺼내
    // 웹과 동일한 login()으로 넘긴다.
    try {
      const authUrl = buildKakaoAuthUrl(clientId, nativeRedirectUri);
      const result = await WebBrowser.openAuthSessionAsync(authUrl, nativeRedirectUri);

      if (result.type !== 'success' || !result.url) {
        // 사용자가 브라우저를 직접 닫은 경우 등 — 에러로 취급하지 않는다.
        return;
      }

      const { queryParams } = Linking.parse(result.url);
      const code = queryParams?.code;

      if (typeof code !== 'string') {
        setConfigErrorMessage('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
        return;
      }

      await login(code, nativeRedirectUri);
    } catch {
      setConfigErrorMessage('카카오 로그인 중 오류가 발생했습니다.');
    }
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
          <View style={styles.basicLoginForm}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isBasicLoginSubmitting}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="이메일"
              placeholderTextColor={CourseColors.muted}
              style={styles.input}
              value={email}
            />
            <TextInput
              editable={!isBasicLoginSubmitting}
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor={CourseColors.muted}
              secureTextEntry
              style={styles.input}
              value={password}
            />

            {basicLoginErrorMessage ? (
              <Text style={styles.error}>{basicLoginErrorMessage}</Text>
            ) : null}

            <Pressable
              disabled={isBasicLoginSubmitting || !email.trim() || !password}
              onPress={() => void handlePressBasicLogin()}
              style={[
                styles.loginButton,
                (isBasicLoginSubmitting || !email.trim() || !password) && styles.disabled,
              ]}>
              {isBasicLoginSubmitting ? (
                <ActivityIndicator color={CourseColors.white} />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </Pressable>

            <Link asChild href="/auth/signup">
              <Pressable style={styles.signupLink}>
                <Text style={styles.signupLinkText}>계정이 없으신가요? 회원가입</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

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

          {Platform.OS !== 'web' ? (
            <Text selectable style={styles.debugRedirectUri}>
              카카오 콘솔 Redirect URI 등록용: {nativeRedirectUri ?? '(EXPO_PUBLIC_KAKAO_NATIVE_REDIRECT_URI 미설정)'}
              {'\n'}
              지금 앱이 쓰는 API 주소: {process.env.EXPO_PUBLIC_API_BASE_URL ?? '(EXPO_PUBLIC_API_BASE_URL 미설정)'}
            </Text>
          ) : null}
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
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
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
  basicLoginForm: { gap: 10 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: CourseColors.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 15,
    color: CourseColors.text,
    backgroundColor: CourseColors.white,
  },
  loginButton: {
    minHeight: 52,
    backgroundColor: CourseColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  loginButtonText: { color: CourseColors.white, fontWeight: '900', fontSize: 15 },
  signupLink: { alignItems: 'center', paddingVertical: 6 },
  signupLinkText: { color: CourseColors.primary, fontSize: 13, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: CourseColors.border },
  dividerText: { color: CourseColors.muted, fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.55 },
  kakaoButton: {
    minHeight: 56,
    backgroundColor: KAKAO_YELLOW,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoButtonText: { color: KAKAO_TEXT, fontWeight: '900', fontSize: 16 },
  error: { color: CourseColors.error, textAlign: 'center' },
  debugRedirectUri: {
    color: CourseColors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
