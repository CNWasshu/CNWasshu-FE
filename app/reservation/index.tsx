import { useRouter } from 'expo-router';
import {
    useEffect,
    useState,
} from 'react';

import { ReservationCancelErrorModal } from '@/components/reservation-history/ReservationCancelErrorModal';
import { ReservationCancelModal } from '@/components/reservation-history/ReservationCancelModal';
import { ReservationContent } from '@/components/reservation-history/ReservationContent';
import { useReservationHistory } from '@/hooks/reservation/use-reservation-history';
import type { ReservationResponse } from '@/types/reservation';

export default function ReservationHistoryScreen() {
  const router = useRouter();

  const {
    reservations,
    loading,
    cancelling,
    errorMessage,
    cancelErrorMessage,
    fetchReservations,
    cancelReservation,
    clearError,
    clearCancelError,
  } = useReservationHistory();

  const [
    selectedReservation,
    setSelectedReservation,
  ] = useState<ReservationResponse | null>(
    null
  );

  const [
    cancelModalVisible,
    setCancelModalVisible,
  ] = useState(false);

  const [
    cancelErrorModalVisible,
    setCancelErrorModalVisible,
  ] = useState(false);

  useEffect(() => {
    void fetchReservations();
  }, [fetchReservations]);

  const handleReservationPress = (
    reservation: ReservationResponse
  ) => {
    router.push(
      `/activity/${reservation.activityId}`
    );
  };

  const handleCancelPress = (
    reservation: ReservationResponse
  ) => {
    clearError();
    clearCancelError();

    setSelectedReservation(
      reservation
    );

    setCancelModalVisible(true);
  };

  const handleConfirmCancel =
    async () => {
      if (!selectedReservation) {
        return;
      }

      const success =
        await cancelReservation(
          selectedReservation.reservationId
        );

      if (success) {
        setCancelModalVisible(false);
        setSelectedReservation(null);

        return;
      }

      setCancelModalVisible(false);
      setCancelErrorModalVisible(true);
    };

  const handleCloseCancelModal =
    () => {
      if (cancelling) {
        return;
      }

      setCancelModalVisible(false);
      setSelectedReservation(null);
      clearCancelError();
    };

  const handleCloseErrorModal =
    () => {
      setCancelErrorModalVisible(false);
      setSelectedReservation(null);
      clearCancelError();
    };

  const handleRetry = () => {
    void fetchReservations();
  };

  return (
    <>
      <ReservationContent
        reservations={reservations}
        loading={loading}
        errorMessage={errorMessage}
        onPress={handleReservationPress}
        onCancel={handleCancelPress}
        onRetry={handleRetry}
      />

      <ReservationCancelModal
        visible={cancelModalVisible}
        reservation={
          selectedReservation
        }
        submitting={cancelling}
        onClose={
          handleCloseCancelModal
        }
        onConfirm={() =>
          void handleConfirmCancel()
        }
      />

      <ReservationCancelErrorModal
        visible={
          cancelErrorModalVisible
        }
        message={cancelErrorMessage}
        onConfirm={
          handleCloseErrorModal
        }
      />
    </>
  );
}