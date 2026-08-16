import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableHeader } from '@/components/timetable/TimetableHeader';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import { useTimetable } from '@/hooks/timetable/use-timetable';

export default function TimetableScreen() {
  const {
    dateErrorMessage,
    days,
    endDate,
    handleChangeEndDate,
    handleChangeStartDate,
    maximumEndDate,
    minimumStartDate,
    selectedDayId,
    selectedSchedules,
    setSelectedDayId,
    startDate,
  } = useTimetable();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
            onSelectDay={setSelectedDayId}
            selectedDayId={selectedDayId}
            selectedSchedules={selectedSchedules}
          />
        </View>
      </ScrollView>
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
