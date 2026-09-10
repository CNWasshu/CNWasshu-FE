import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import type { TokenResponse } from '@/types/auth';
import { setTokens } from '@/utils/auth';

type SignupStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useSignup() {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [error, setError] = useState<AuthApiError | null>(null);
  const [status, setStatus] = useState<SignupStatus>('idle');

  const signup = useCallback(
    async (email: string, password: string, nickname: string) => {
      if (submittingRef.current) {
        return null;
      }

      submittingRef.current = true;
      setError(null);
      setStatus('submitting');

      try {
        const response: TokenResponse = await authApi.signup({ email, password, nickname });
        await setTokens(response.accessToken, response.refreshToken);
        setStatus('success');

        // 가입 시 닉네임을 이미 받았으니 온보딩 없이 바로 홈으로 보낸다.
        router.replace('/');

        return response;
      } catch (requestError) {
        setError(normalizeAuthApiError(requestError));
        setStatus('error');
        return null;
      } finally {
        submittingRef.current = false;
      }
    },
    [router]
  );

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setError(null);
    setStatus('idle');
  }, []);

  return {
    errorMessage: error?.message ?? null,
    isSubmitting: status === 'submitting',
    reset,
    signup,
    status,
  };
}
