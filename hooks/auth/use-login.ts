import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import type { TokenResponse } from '@/types/auth';
import { setTokens } from '@/utils/auth';

type LoginStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useLogin() {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [error, setError] = useState<AuthApiError | null>(null);
  const [status, setStatus] = useState<LoginStatus>('idle');

  const login = useCallback(
    async (email: string, password: string) => {
      if (submittingRef.current) {
        return null;
      }

      submittingRef.current = true;
      setError(null);
      setStatus('submitting');

      try {
        const response: TokenResponse = await authApi.login({ email, password });
        await setTokens(response.accessToken, response.refreshToken);
        setStatus('success');
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
    login,
    reset,
    status,
  };
}
