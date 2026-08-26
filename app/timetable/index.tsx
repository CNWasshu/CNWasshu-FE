import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableHeader } from '@/components/timetable/TimetableHeader';
import { TimetableReservationSyncStatus } from '@/components/timetable/TimetableReservationSyncStatus';
import { TimetableScheduleModal } from '@/components/timetable/TimetableScheduleModal';
import { TimetableSaveModal } from '@/components/timetable/TimetableSaveModal';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { useSavedActivities } from '@/hooks/timetable/use-saved-activities';
import { useReservationSync } from '@/hooks/timetable/use-reservation-sync';
import { useSaveTimetable } from '@/hooks/timetable/use-save-timetable';
import { useTimetableAccessToken } from '@/hooks/timetable/use-timetable-access-token';
import { useTimetable } from '@/hooks/timetable/use-timetable';
import type { TimetableSchedule } from '@/types/timetable';
import { formatDate } from '@/utils/timetable/date';

function createScheduleId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TimetableScreen() {
  const router = useRouter();
  const { accessToken } = useTimetableAccessToken();
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TimetableSchedule | null>(null);
  const {
    errorMessage: saveApiErrorMessage,
    isSubmitting: isSaving,
    isSuccess: isSaveSuccess,
    reset: resetSave,
    save: saveTimetable,
  } = useSaveTimetable(accessToken ?? undefined);
  const {
    activities,
    clearSelectedActivity,
    error: activitiesError,
    isLoading: activitiesLoading,
    refetch: refetchActivities,
    selectedActivity,
    selectedActivityId,
    selectActivity,
  } = useSavedActivities(accessToken ?? undefined);
  const {
    error: reservationSyncError,
    isLoading: isReservationSyncing,
    refetch: refetchReservations,
  } = useReservationSync(accessToken ?? undefined);
  const {
    addSchedule,
    clearSaveError,
    timetableName,
    dateErrorMessage,
    days,
    endDate,
    handleChangeEndDate,
    handleChangeStartDate,
    handleChangeTimetableName,
    maximumEndDate,
    minimumStartDate,
    removeSchedule,
    prepareSaveRequest,
    saveErrorMessage,
    scheduleCount,
    selectedDayId,
    selectedSchedules,
    setSelectedDayId,
    startDate,
    synchronizeReservations,
    updateSchedule,
    validateSchedulesForSave,
  } = useTimetable();
  const selectedDay = days.find((day) => day.id === selectedDayId);
  const selectedDayLabel = `${selectedDay?.dayLabel ?? ''}(${selectedDay?.date ?? ''})`;
  const selectableSavedPlaces = useMemo(() => {
    const reservedActivityIds = new Set(
      selectedSchedules.flatMap((schedule) =>
        schedule.kind === 'activity' &&
        schedule.source === 'reservation'
          ? [schedule.activityId]
          : []
      )
    );

    return activities.filter(
      (place) =>
        place.placeType !== 'activity' ||
        !reservedActivityIds.has(place.id)
    );
  }, [activities, selectedSchedules]);
  const synchronizePeriodReservations = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const reservations = await refetchReservations(
      formatDate(startDate),
      formatDate(endDate)
    );

    if (reservations) {
      synchronizeReservations(reservations);
    }
  }, [
    accessToken,
    endDate,
    refetchReservations,
    startDate,
    synchronizeReservations,
  ]);

  useFocusEffect(
    useCallback(() => {
      void synchronizePeriodReservations();
    }, [synchronizePeriodReservations])
  );

  const closeScheduleModal = () => {
    setIsScheduleModalVisible(false);
    setEditingSchedule(null);
    clearSelectedActivity();
  };

  const openAddScheduleModal = () => {
    clearSelectedActivity();
    setEditingSchedule(null);
    setIsScheduleModalVisible(true);
  };

  const openEditScheduleModal = (schedule: TimetableSchedule) => {
    setEditingSchedule(schedule);
    setIsScheduleModalVisible(true);
  };

  const handleSubmitSchedule = (value: Pick<TimetableSchedule, 'endTime' | 'startTime' | 'title'>) => {
    if (editingSchedule) {
      updateSchedule(selectedDayId, { ...editingSchedule, ...value });
    } else if (selectedActivity?.placeType === 'activity') {
      addSchedule(selectedDayId, {
        activityId: selectedActivity.id,
        activityIcon: selectedActivity.icon,
        ...value,
        id: createScheduleId(),
        kind: 'activity',
        location: selectedActivity.location,
        operatingEndTime: selectedActivity.endTime,
        operatingStartTime: selectedActivity.startTime,
        operatingType: selectedActivity.operatingType,
        reservationId: null,
        requiresReservation: selectedActivity.requiresReservation,
        source: 'local',
      });
    } else if (selectedActivity?.placeType === 'restaurant') {
      addSchedule(selectedDayId, {
        ...value,
        id: createScheduleId(),
        kind: 'restaurant',
        location: selectedActivity.location,
        operatingEndTime: selectedActivity.endTime,
        operatingStartTime: selectedActivity.startTime,
        operatingType: selectedActivity.operatingType,
        restaurantIcon: selectedActivity.icon,
        restaurantId: selectedActivity.id,
      });
    } else {
      addSchedule(selectedDayId, { ...value, id: createScheduleId(), kind: 'free' });
    }

    closeScheduleModal();
  };

  const confirmDeleteSchedule = () => {
    if (
      !editingSchedule ||
      (
        editingSchedule.kind === 'activity' &&
        editingSchedule.source === 'reservation'
      )
    ) {
      return;
    }

    removeSchedule(selectedDayId, editingSchedule.id);
    closeScheduleModal();
  };

  const browseMoreActivities = () => {
    closeScheduleModal();
    router.dismissTo('/');
  };

  const openReservation = (
    activityId: string
  ) => {
    closeScheduleModal();
    router.push(
      `/reservation/${activityId}`
    );
  };

  const openSaveModal = () => {
    if (validateSchedulesForSave()) {
      setIsSaveModalVisible(true);
    }
  };

  const closeSaveModal = () => {
    setIsSaveModalVisible(false);
    clearSaveError();
    resetSave();
  };

  const handleChangeCourseNameForSave = (name: string) => {
    handleChangeTimetableName(name);
    resetSave();
  };

  const handleSaveTimetable = async () => {
    const request = prepareSaveRequest();
    if (!request) {
      return;
    }

    const savedTimetable = await saveTimetable(request);
    if (!savedTimetable) {
      return;
    }

    setIsSaveModalVisible(false);
    router.replace(`/course/${savedTimetable.timetableId}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isScheduleModalVisible && !isSaveModalVisible}
        showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>
          <TimetableHeader />
          <TimetableDateRange
            endDate={endDate}
            errorMessage={dateErrorMessage}
            maximumEndDate={maximumEndDate}
            minimumStartDate={minimumStartDate}
            onChangeEndDate={handleChangeEndDate}
            onChangeStartDate={handleChangeStartDate}
            startDate={startDate}
          />
          <TimetableReservationSyncStatus
            error={reservationSyncError}
            isLoading={isReservationSyncing}
            onRetry={() => void synchronizePeriodReservations()}
          />
          <TimetableCourseSection
            days={days}
            onAddSchedule={openAddScheduleModal}
            onSave={openSaveModal}
            onSelectDay={setSelectedDayId}
            onSelectSchedule={openEditScheduleModal}
            selectedDayId={selectedDayId}
            selectedSchedules={selectedSchedules}
            saveErrorMessage={saveErrorMessage}
          />
        </View>
      </ScrollView>
      <TimetableScheduleModal
        activities={selectableSavedPlaces}
        activitiesError={activitiesError}
        activitiesLoading={activitiesLoading}
        dayLabel={selectedDayLabel}
        onBrowseActivities={browseMoreActivities}
        onClearActivity={clearSelectedActivity}
        onClose={closeScheduleModal}
        onDelete={
          editingSchedule?.kind === 'activity' &&
          editingSchedule.source === 'reservation'
            ? undefined
            : confirmDeleteSchedule
        }
        onOpenActivities={() => void refetchActivities()}
        onRequestReservation={openReservation}
        onRetryActivities={() => void refetchActivities()}
        onSelectActivity={selectActivity}
        onSubmit={handleSubmitSchedule}
        schedule={editingSchedule}
        schedules={selectedSchedules}
        selectedActivity={selectedActivity}
        selectedActivityId={selectedActivityId}
        visible={isScheduleModalVisible}
      />
      <TimetableSaveModal
        courseName={timetableName}
        endDate={endDate}
        errorMessage={saveErrorMessage ?? saveApiErrorMessage}
        isSaving={isSaving}
        isSuccess={isSaveSuccess}
        onChangeCourseName={handleChangeCourseNameForSave}
        onClose={closeSaveModal}
        onSave={() => void handleSaveTimetable()}
        scheduleCount={scheduleCount}
        startDate={startDate}
        visible={isSaveModalVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F3EFE6',
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    backgroundColor: '#F3EFE6',
    flexGrow: 1,
  },
  screen: {
    backgroundColor: TIMETABLE_COLORS.background,
    flex: 1,
    maxWidth: 430,
    paddingBottom: 32,
    width: '100%',
  },
});
