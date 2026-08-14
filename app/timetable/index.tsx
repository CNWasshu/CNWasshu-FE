import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableHeader } from '@/components/timetable/TimetableHeader';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import type { TimetableDay } from '@/types/timetable';

const TRIP_DAY_COUNT = 4;
const WEEK_DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatFullDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function createTimetableDays(startDate: Date): TimetableDay[] {
  return Array.from({ length: TRIP_DAY_COUNT }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dayLabel: `Day ${index + 1}`,
      id: formatFullDate(date),
      weekDay: WEEK_DAY_LABELS[date.getDay()],
    };
  });
}

export default function TimetableScreen() {
  const days = useMemo(() => createTimetableDays(new Date()), []);
  const [selectedDayId, setSelectedDayId] = useState(days[0].id);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TimetableHeader />
        <TimetableDateRange endDate={days.at(-1)?.id ?? ''} startDate={days[0].id} />
        <TimetableCourseSection
          days={days}
          onSelectDay={setSelectedDayId}
          selectedDayId={selectedDayId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: TIMETABLE_COLORS.primary,
    flex: 1,
  },
  scrollContent: {
    backgroundColor: TIMETABLE_COLORS.background,
    flexGrow: 1,
    paddingBottom: 32,
  },
});
