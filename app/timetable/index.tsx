import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableHeader } from '@/components/timetable/TimetableHeader';
import { TimetableScheduleModal } from '@/components/timetable/TimetableScheduleModal';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { useSavedActivities } from '@/hooks/timetable/use-saved-activities';
import { useTimetable } from '@/hooks/timetable/use-timetable';
import type { TimetableSchedule } from '@/types/timetable';

function createScheduleId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TimetableScreen() {
  const router = useRouter();
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TimetableSchedule | null>(null);
  const {
    activities,
    clearSelectedActivity,
    selectedActivity,
    selectedActivityId,
    selectActivity,
  } = useSavedActivities();
  const {
    addSchedule,
    dateErrorMessage,
    days,
    endDate,
    handleChangeEndDate,
    handleChangeStartDate,
    maximumEndDate,
    minimumStartDate,
    removeSchedule,
    selectedDayId,
    selectedSchedules,
    setSelectedDayId,
    startDate,
    updateSchedule,
  } = useTimetable();
  const selectedDay = days.find((day) => day.id === selectedDayId);
  const selectedDayLabel = `${selectedDay?.dayLabel ?? ''} (${selectedDay?.date ?? ''})`;

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
    } else if (selectedActivity) {
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
        requiresReservation: selectedActivity.requiresReservation,
      });
    } else {
      addSchedule(selectedDayId, { ...value, id: createScheduleId(), kind: 'free' });
    }

    closeScheduleModal();
  };

  const confirmDeleteSchedule = () => {
    if (!editingSchedule) {
      return;
    }

    removeSchedule(selectedDayId, editingSchedule.id);
    closeScheduleModal();
  };

  const browseMoreActivities = () => {
    closeScheduleModal();
    router.push('/');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isScheduleModalVisible}
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
          <TimetableCourseSection
            days={days}
            onAddSchedule={openAddScheduleModal}
            onSelectDay={setSelectedDayId}
            onSelectSchedule={openEditScheduleModal}
            selectedDayId={selectedDayId}
            selectedSchedules={selectedSchedules}
          />
        </View>
      </ScrollView>
      <TimetableScheduleModal
        activities={activities}
        dayLabel={selectedDayLabel}
        onBrowseActivities={browseMoreActivities}
        onClearActivity={clearSelectedActivity}
        onClose={closeScheduleModal}
        onDelete={confirmDeleteSchedule}
        onRequestReservation={browseMoreActivities}
        onSelectActivity={selectActivity}
        onSubmit={handleSubmitSchedule}
        schedule={editingSchedule}
        selectedActivity={selectedActivity}
        selectedActivityId={selectedActivityId}
        visible={isScheduleModalVisible}
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
