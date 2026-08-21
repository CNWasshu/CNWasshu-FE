import { useCallback, useRef, useState } from 'react';

import { authApi } from '@/api/authApi';
import { clearTokens, getRefreshToken } from '@/utils/auth';

export function useLogout() {
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = useCallback(async (accessToken: string) => {
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        // 서버 로그아웃이 실패해도(네트워크 오류 등) 로컬 세션은 항상 종료한다.
        await authApi.logout(refreshToken, accessToken).catch(() => undefined);
      }
    } finally {
      await clearTokens();
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, logout };
}
