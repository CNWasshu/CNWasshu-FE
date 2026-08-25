import {
  useCallback,
  useState,
} from 'react';

import { reservationApi } from '@/api/reservationApi';
import type {
  ReservationCreateRequest,
  ReservationResponse,
  ReservationTimeSlot,
} from '@/types/reservation';
import { getAccessToken } from '@/utils/auth';

export function useReservation() {
  const [
    availableTimes,
    setAvailableTimes,
  ] = useState<ReservationTimeSlot[]>([]);

  const [
    loadingTimes,
    setLoadingTimes,
  ] = useState(false);

  const [
    checkingDuplicate,
    setCheckingDuplicate,
  ] = useState(false);

  const [
    creatingReservation,
    setCreatingReservation,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const fetchAvailableTimes =
    useCallback(
      async (
        activityId: number,
        date: string
      ) => {
        setLoadingTimes(true);
        setErrorMessage(null);

        try {
          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          const times =
            await reservationApi.getAvailableTimes(
              activityId,
              date,
              accessToken
            );

          setAvailableTimes(times);

          return times;
        } catch (error) {
          setAvailableTimes([]);

          const message =
            error instanceof Error
              ? error.message
              : '예약 가능 시간을 불러오지 못했습니다.';

          setErrorMessage(message);

          return [];
        } finally {
          setLoadingTimes(false);
        }
      },
      []
    );

  const fetchReservationsByDate =
    useCallback(
      async (
        date: string
      ): Promise<
        ReservationResponse[] | null
      > => {
        setCheckingDuplicate(true);
        setErrorMessage(null);

        try {
          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          return await reservationApi.getReservationsByDate(
            date,
            accessToken
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : '예약 내역을 확인하지 못했습니다.';

          setErrorMessage(message);

          return null;
        } finally {
          setCheckingDuplicate(false);
        }
      },
      []
    );

  const createReservation =
    useCallback(
      async (
        payload: ReservationCreateRequest
      ): Promise<ReservationResponse | null> => {
        setCreatingReservation(true);
        setErrorMessage(null);

        try {
          const accessToken =
            await getAccessToken();

          if (!accessToken) {
            throw new Error(
              '로그인이 필요합니다.'
            );
          }

          return await reservationApi.createReservation(
            payload,
            accessToken
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : '예약을 처리하지 못했습니다.';

          setErrorMessage(message);

          return null;
        } finally {
          setCreatingReservation(false);
        }
      },
      []
    );

  const clearAvailableTimes =
    useCallback(() => {
      setAvailableTimes([]);
      setErrorMessage(null);
    }, []);

  return {
    availableTimes,
    loadingTimes,
    checkingDuplicate,
    creatingReservation,
    errorMessage,

    fetchAvailableTimes,
    fetchReservationsByDate,
    createReservation,
    clearAvailableTimes,
  };
}