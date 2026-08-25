import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import {
  useEffect,
  useState,
} from 'react';

import { ReservationConfirmModal } from '@/components/reservation/ReservationConfirmModal';
import { ReservationContent } from '@/components/reservation/ReservationContent';
import { ReservationDuplicateModal } from '@/components/reservation/ReservationDuplicateModal';
import { ReservationSuccessModal } from '@/components/reservation/ReservationSuccessModal';
import { useActivityDetail } from '@/hooks/activity/use-activity-detail';
import { useReservation } from '@/hooks/reservation/use-reservation';
import type { ReservationResponse } from '@/types/reservation';

export default function ReservationScreen() {
  const router = useRouter();

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const activityId = Number(id);

  const {
    activity,
    loading: activityLoading,
    errorMessage: activityErrorMessage,
    fetchActivityDetail,
  } = useActivityDetail(activityId);

  const {
    availableTimes,
    loadingTimes,
    creatingReservation,
    errorMessage: reservationErrorMessage,
    fetchAvailableTimes,
    fetchReservationsByDate,
    createReservation,
    clearAvailableTimes,
  } = useReservation();

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string | null>(null);

  const [
    selectedTime,
    setSelectedTime,
  ] = useState<string | null>(null);

  const [
    peopleCount,
    setPeopleCount,
  ] = useState(1);

  const [
    withChild,
    setWithChild,
  ] = useState(false);

  const [
    confirmVisible,
    setConfirmVisible,
  ] = useState(false);

  const [
    duplicateVisible,
    setDuplicateVisible,
  ] = useState(false);

  const [
    duplicateReservation,
    setDuplicateReservation,
  ] =
    useState<ReservationResponse | null>(
      null
    );

  const [
    completedReservation,
    setCompletedReservation,
  ] =
    useState<ReservationResponse | null>(
      null
    );

  useEffect(() => {
    if (!selectedDate) {
      setSelectedTime(null);
      clearAvailableTimes();
      return;
    }

    setSelectedTime(null);

    fetchAvailableTimes(
      activityId,
      selectedDate
    );
  }, [
    activityId,
    selectedDate,
    fetchAvailableTimes,
    clearAvailableTimes,
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleDateSelect =
    async (date: string) => {
      const reservations =
        await fetchReservationsByDate(
          date
        );

      if (!reservations) {
        return;
      }

      const duplicate =
        reservations.find(
          reservation =>
            reservation.activityId ===
            activityId
        );

      if (duplicate) {
        setDuplicateReservation(
          duplicate
        );
        setDuplicateVisible(true);
        return;
      }

      setDuplicateReservation(null);
      setSelectedDate(date);
    };

  const handleTimeSelect = (
    time: string
  ) => {
    setSelectedTime(time);
  };

  const handlePeopleCountChange = (
    count: number
  ) => {
    setPeopleCount(count);
  };

  const handleWithChildChange = (
    value: boolean
  ) => {
    setWithChild(value);
  };

  const handleSubmit = () => {
    if (
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    setConfirmVisible(true);
  };

  const handleConfirmReservation =
    async () => {
      if (
        !selectedDate ||
        !selectedTime
      ) {
        return;
      }

      const reservation =
        await createReservation({
          activityId,
          reservationDate:
            selectedDate,
          reservationTime:
            selectedTime,
          peopleCount,
          withChild,
        });

      if (!reservation) {
        return;
      }

      setConfirmVisible(false);

      setCompletedReservation(
        reservation
      );
    };

  const handleDuplicateConfirm =
    () => {
      setDuplicateVisible(false);
      setDuplicateReservation(null);
    };

  const handleSuccessConfirm = () => {
    setCompletedReservation(null);
    router.back();
  };

  return (
    <>
      <ReservationContent
        activity={activity}
        activityLoading={
          activityLoading
        }
        activityErrorMessage={
          activityErrorMessage
        }
        reservationErrorMessage={
          reservationErrorMessage
        }
        availableTimes={
          availableTimes
        }
        loadingTimes={
          loadingTimes
        }
        creatingReservation={
          creatingReservation
        }
        selectedDate={
          selectedDate
        }
        selectedTime={
          selectedTime
        }
        peopleCount={
          peopleCount
        }
        withChild={
          withChild
        }
        onBack={handleBack}
        onRetry={
          fetchActivityDetail
        }
        onDateSelect={
          handleDateSelect
        }
        onTimeSelect={
          handleTimeSelect
        }
        onPeopleCountChange={
          handlePeopleCountChange
        }
        onWithChildChange={
          handleWithChildChange
        }
        onSubmit={handleSubmit}
      />

      {activity &&
        selectedDate &&
        selectedTime && (
          <ReservationConfirmModal
            visible={
              confirmVisible
            }
            activityTitle={
              activity.title
            }
            reservationDate={
              selectedDate
            }
            reservationTime={
              selectedTime
            }
            duration={
              activity.duration
            }
            peopleCount={
              peopleCount
            }
            withChild={
              withChild
            }
            submitting={
              creatingReservation
            }
            onCancel={() =>
              setConfirmVisible(false)
            }
            onConfirm={
              handleConfirmReservation
            }
          />
        )}

      <ReservationDuplicateModal
        visible={duplicateVisible}
        reservation={
          duplicateReservation
        }
        onConfirm={
          handleDuplicateConfirm
        }
      />

      <ReservationSuccessModal
        visible={
          completedReservation !== null
        }
        reservation={
          completedReservation
        }
        onConfirm={
          handleSuccessConfirm
        }
      />
    </>
  );
}