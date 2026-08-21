import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import { clearTokens } from '@/utils/auth';

type DeleteStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useDeleteAccount() {
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
      setError(normalizeAuthApiError(requestError));
      setStatus('error');
      return false;
    } finally {
      submittingRef.current = false;
    }
  }, []);

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
