import {
    useCallback,
    useState,
} from 'react';

import { reservationApi } from '@/api/reservationApi';
import type { ReservationResponse } from '@/types/reservation';
import { getAccessToken } from '@/utils/auth';

function getTodayString() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, '0');

  const day =
    String(
      today.getDate()
    ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function filterUpcomingReservations(
  reservations: ReservationResponse[]
) {
  const today =
    getTodayString();

  return reservations.filter(
    (reservation) =>
      reservation.reservationDate >=
      today
  );
}

export function useReservationHistory() {
  const [
    reservations,
    setReservations,
  ] = useState<ReservationResponse[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    cancelErrorMessage,
    setCancelErrorMessage,
  ] = useState<string | null>(null);

  const fetchReservations =
    useCallback(async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const accessToken =
          await getAccessToken();

        if (!accessToken) {
          throw new Error(
            '로그인이 필요합니다.'
          );
        }

        const result =
          await reservationApi.getReservations(
            accessToken
          );

        const upcomingReservations =
          filterUpcomingReservations(
            result
          );

        setReservations(
          upcomingReservations
        );

        return upcomingReservations;
      } catch (error) {
        setReservations([]);

        const message =
          error instanceof Error
            ? error.message
            : '예약 내역을 불러오지 못했습니다.';

        setErrorMessage(message);

        return [];
      } finally {
        setLoading(false);
      }
    }, []);

  const cancelReservation =
    useCallback(
      async (
        reservationId: number
      ): Promise<boolean> => {
        setCancelling(true);
        setCancelErrorMessage(null);

        try {
          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          await reservationApi.cancelReservation(
            reservationId,
            accessToken
          );

          setReservations((current) =>
            current.filter(
              (reservation) =>
                reservation.reservationId !==
                reservationId
            )
          );

          return true;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : '예약을 취소하지 못했습니다.';

          setCancelErrorMessage(
            message
          );

          return false;
        } finally {
          setCancelling(false);
        }
      },
      []
    );

  const clearError =
    useCallback(() => {
      setErrorMessage(null);
    }, []);

  const clearCancelError =
    useCallback(() => {
      setCancelErrorMessage(null);
    }, []);

  return {
    reservations,
    loading,
    cancelling,
    errorMessage,
    cancelErrorMessage,

    fetchReservations,
    cancelReservation,
    clearError,
    clearCancelError,
  };
}