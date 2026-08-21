import { useCallback, useEffect, useState } from 'react';

import { authApi, getAuthErrorMessage } from '@/api/authApi';
import type { UserSummary } from '@/types/auth';

export function useMe(accessToken: string | null) {
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
      setError(getAuthErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { error, loading, refetch, setUser, user };
}
