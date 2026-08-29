import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { reservationApi } from '@/api/reservationApi';
import type { ReservationResponse } from '@/types/reservation';

export function useReservationSync(
  accessToken?: string
) {
  const requestIdRef = useRef(0);
  const [error, setError] =
    useState<string | null>(null);
  const [isLoading, setIsLoading] =
    useState(false);

  const refetch = useCallback(
    async (
      startDate: string,
      endDate: string
    ): Promise<ReservationResponse[] | null> => {
      if (!accessToken) {
        setError('로그인이 필요합니다.');
        return null;
      }

      const requestId =
        ++requestIdRef.current;
      setIsLoading(true);
      setError(null);

      try {
        const reservations =
          await reservationApi.getReservationsByPeriod(
            { endDate, startDate },
            accessToken
          );

        return requestId ===
          requestIdRef.current
          ? reservations
          : null;
      } catch (requestError) {
        if (
          requestId ===
          requestIdRef.current
        ) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : '예약 내역을 불러오지 못했습니다.'
          );
        }
        return null;
      } finally {
        if (
          requestId ===
          requestIdRef.current
        ) {
          setIsLoading(false);
        }
      }
    },
    [accessToken]
  );

  return {
    error,
    isLoading,
    refetch,
  };
}
