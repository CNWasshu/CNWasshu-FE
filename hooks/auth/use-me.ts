import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { authApi, getAuthErrorMessage } from '@/api/authApi';
import type { UserSummary } from '@/types/auth';
import { clearTokens, isSessionExpiredError } from '@/utils/auth';

export function useMe(accessToken: string | null) {
  const router = useRouter();
  const [user, setUser] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setUser(await authApi.getMe(accessToken));
    } catch (requestError) {
      // 저장된 토큰이 만료/무효한 경우: 에러 카드 대신 로그인 화면으로 보낸다.
      if (isSessionExpiredError(requestError)) {
        await clearTokens();
        router.replace('/auth/login');
        return;
      }
      setError(getAuthErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [accessToken, router]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { error, loading, refetch, setUser, user };
}
