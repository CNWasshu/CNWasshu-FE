import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BackHeader } from '@/components/common/BackHeader';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableReservationSyncStatus } from '@/components/timetable/TimetableReservationSyncStatus';
import { TimetableSaveModal } from '@/components/timetable/TimetableSaveModal';
import { TimetableScheduleModal } from '@/components/timetable/TimetableScheduleModal';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { CourseColors } from '@/constants/course-colors';
import { PAGE_LAYOUT } from '@/constants/layout';
import { useCourse } from '@/hooks/useCourse';
import { useReservationSync } from '@/hooks/timetable/use-reservation-sync';
import { useSavedActivities } from '@/hooks/timetable/use-saved-activities';
import { useSaveTimetable } from '@/hooks/timetable/use-save-timetable';
import { useTimetable } from '@/hooks/timetable/use-timetable';
import type { TimetableSchedule } from '@/types/timetable';
import { getAccessToken } from '@/utils/auth';
import { formatDate } from '@/utils/timetable/date';
import {
  hydrateTimetableFromCourse,
  type HydratedTimetableInitialState,
} from '@/utils/timetable/hydrate-from-course';

function createScheduleId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CourseEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const courseId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;

  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const { course, error: courseError, loading: courseLoading } = useCourse(courseId);
  const [initialState, setInitialState] = useState<HydratedTimetableInitialState | null>(null);
  const [hydrateError, setHydrateError] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const token = await getAccessToken();
      if (!cancelled) {
        setAccessToken(token);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!course || !accessToken) {
      return;
    }

    let cancelled = false;
    setIsHydrating(true);
    setHydrateError(null);

    void hydrateTimetableFromCourse(course, accessToken)
      .then((state) => {
        if (!cancelled) {
          setInitialState(state);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHydrateError('코스 일정을 불러오지 못했습니다. 다시 시도해 주세요.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydrating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [course, accessToken]);

  if (courseLoading || isHydrating || accessToken === undefined) {
    return (
      <SafeAreaView style={styles.stateSafe}>
        <ActivityIndicator color={CourseColors.primary} size="large" />
        <Text style={styles.stateText}>코스 일정을 불러오고 있어요.</Text>
      </SafeAreaView>
    );
  }

  if (courseError || hydrateError || !initialState) {
    return (
      <SafeAreaView style={styles.stateSafe}>
        <BackHeader />
        <Text style={styles.stateText}>{courseError ?? hydrateError ?? '코스를 찾을 수 없습니다.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <CourseEditEditor accessToken={accessToken} courseId={courseId!} initialState={initialState} />
  );
}

function CourseEditEditor({
  accessToken,
  courseId,
  initialState,
}: {
  accessToken: string | null;
  courseId: number;
  initialState: HydratedTimetableInitialState;
}) {
  const router = useRouter();
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TimetableSchedule | null>(null);
  const {
    errorMessage: saveApiErrorMessage,
    isSubmitting: isSaving,
    isSuccess: isSaveSuccess,
    reset: resetSave,
    save: saveTimetable,
  } = useSaveTimetable(accessToken ?? undefined, courseId);
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
  } = useTimetable(initialState);
  const selectedDay = days.find((day) => day.id === selectedDayId);
  const selectedDayLabel = `${selectedDay?.dayLabel ?? ''}(${selectedDay?.date ?? ''})`;
  const selectableSavedPlaces = useMemo(() => {
    const reservedActivityIds = new Set(
      selectedSchedules.flatMap((schedule) =>
        schedule.kind === 'activity' && schedule.source === 'reservation'
          ? [schedule.activityId]
          : []
      )
    );

    return activities.filter(
      (place) => place.placeType !== 'activity' || !reservedActivityIds.has(place.id)
    );
  }, [activities, selectedSchedules]);

  const synchronizePeriodReservations = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const reservations = await refetchReservations(formatDate(startDate), formatDate(endDate));
    if (reservations) {
      synchronizeReservations(reservations);
    }
  }, [accessToken, endDate, refetchReservations, startDate, synchronizeReservations]);

  useFocusEffect(
    useCallback(() => {
      void synchronizePeriodReservations();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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

  const handleSubmitSchedule = (
    value: Pick<TimetableSchedule, 'endTime' | 'startTime' | 'title'>
  ) => {
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
      (editingSchedule.kind === 'activity' && editingSchedule.source === 'reservation')
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

  const openReservation = (activityId: string) => {
    closeScheduleModal();
    router.push(`/reservation/${activityId}`);
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
    router.replace(`/course/${courseId}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isScheduleModalVisible && !isSaveModalVisible}
        showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>
          <View style={styles.header}>
            <BackHeader />
            <Text style={styles.headerTitle}>코스 수정</Text>
            <Text style={styles.headerDescription}>
              날짜와 일정을 수정하고 다시 저장할 수 있어요.
            </Text>
          </View>
          <View style={styles.body}>
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
          editingSchedule?.kind === 'activity' && editingSchedule.source === 'reservation'
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
  stateSafe: {
    flex: 1,
    backgroundColor: TIMETABLE_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  stateText: { color: CourseColors.muted, textAlign: 'center' },
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
    paddingBottom: 32,
    width: '100%',
  },
  body: {
    alignSelf: 'center',
    maxWidth: PAGE_LAYOUT.desktopMaxWidth,
    width: '100%',
  },
  header: {
    backgroundColor: '#68A653',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 6,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: -0.7 },
  headerDescription: { color: '#F2F8EF', fontSize: 14, lineHeight: 21 },
});
