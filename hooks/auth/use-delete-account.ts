import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import { clearTokens, isSessionExpiredError } from '@/utils/auth';

type DeleteStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useDeleteAccount() {
  const router = useRouter();
  const submittingRef = useRef(false);
  const [error, setError] = useState<AuthApiError | null>(null);
  const [status, setStatus] = useState<DeleteStatus>('idle');

  const deleteAccount = useCallback(async (accessToken: string) => {
    if (submittingRef.current) {
      return false;
    }

    submittingRef.current = true;
    setError(null);
    setStatus('submitting');

    try {
      await authApi.deleteMe(accessToken);
      await clearTokens();
      setStatus('success');
      return true;
    } catch (requestError) {
      // 이미 만료/무효한 토큰이면 탈퇴 실패 안내 대신 그냥 로그인 화면으로 보낸다.
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return false;
      }
      setError(normalizeAuthApiError(requestError));
      setStatus('error');
      return false;
    } finally {
      submittingRef.current = false;
    }
  }, [router]);

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setError(null);
    setStatus('idle');
  }, []);

  return {
    errorMessage: error?.message ?? null,
    deleteAccount,
    isSubmitting: status === 'submitting',
    reset,
  };
}
