import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import type { TokenResponse } from '@/types/auth';
import { setTokens } from '@/utils/auth';

type LoginStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useKakaoLogin() {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [error, setError] = useState<AuthApiError | null>(null);
  const [result, setResult] = useState<TokenResponse | null>(null);
  const [status, setStatus] = useState<LoginStatus>('idle');

  const login = useCallback(async (authorizationCode: string, redirectUri: string) => {
    if (submittingRef.current) {
      return null;
    }

    submittingRef.current = true;
    setError(null);
    setStatus('submitting');

    try {
      const response = await authApi.kakaoLogin({ authorizationCode, redirectUri });
      await setTokens(response.accessToken, response.refreshToken);
      setResult(response);
      setStatus('success');

      // 신규 가입자는 닉네임 온보딩을 거친 뒤에만 홈으로 보낸다.
      if (response.isNewUser) {
        router.replace('/auth/onboarding');
      } else {
        router.replace('/');
      }

      return response;
    } catch (requestError) {
      const apiError = normalizeAuthApiError(requestError);
      setError(apiError);
      setStatus('error');
      return null;
    } finally {
      submittingRef.current = false;
    }
  }, [router]);

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setError(null);
    setResult(null);
    setStatus('idle');
  }, []);

  return {
    error,
    errorMessage: error?.message ?? null,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    login,
    reset,
    result,
    status,
  };
}
