import { useCallback, useEffect, useState } from 'react';

import { stampApi } from '@/api/stampApi';

export function useMyStampCount(accessToken: string | null) {
  const [stampCount, setStampCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await stampApi.getMyStamps(accessToken);
      setStampCount(response.stamps.length);
    } catch {
      // 마이페이지 통계는 부가 정보이므로 실패해도 화면 전체를 막지 않고 조용히 무시한다.
      // (인증 자체가 문제라면 useMe가 이미 로그인 화면으로 보낸다.)
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { loading, refetch, stampCount };
}
