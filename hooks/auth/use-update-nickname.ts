import { useCallback, useRef, useState } from 'react';

import { authApi, normalizeAuthApiError, type AuthApiError } from '@/api/authApi';
import type { UserSummary } from '@/types/auth';

type UpdateStatus = 'error' | 'idle' | 'submitting' | 'success';

export function useUpdateNickname(accessToken: string | null) {
  const submittingRef = useRef(false);
  const [error, setError] = useState<AuthApiError | null>(null);
  const [status, setStatus] = useState<UpdateStatus>('idle');

  const updateNickname = useCallback(
    async (nickname: string): Promise<UserSummary | null> => {
      if (submittingRef.current || !accessToken) {
        return null;
      }

      submittingRef.current = true;
      setError(null);
      setStatus('submitting');

      try {
        const response = await authApi.updateMe({ nickname }, accessToken);
        setStatus('success');
        return response;
      } catch (requestError) {
        setError(normalizeAuthApiError(requestError));
        setStatus('error');
        return null;
      } finally {
        submittingRef.current = false;
      }
    },
    [accessToken]
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
    status,
    updateNickname,
  };
}
