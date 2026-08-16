import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TimetableDateRange } from '@/components/timetable/TimetableDateRange';
import { TimetableCourseSection } from '@/components/timetable/TimetableCourseSection';
import { TimetableHeader } from '@/components/timetable/TimetableHeader';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import {
  addDays,
  createTimetableDays,
  MAX_TRIP_DAY_COUNT,
  startOfDay,
  validateTravelPeriod,
} from '@/utils/timetable/date';

export default function TimetableScreen() {
  const minimumStartDate = useMemo(() => startOfDay(new Date()), []);
  const [startDate, setStartDate] = useState(minimumStartDate);
  const [endDate, setEndDate] = useState(() => addDays(minimumStartDate, 3));
  const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);
  const days = useMemo(() => createTimetableDays(startDate, endDate), [endDate, startDate]);
  const [selectedDayId, setSelectedDayId] = useState(days[0].id);
  const maximumEndDate = useMemo(
    () => addDays(startDate, MAX_TRIP_DAY_COUNT - 1),
    [startDate]
  );

  const handleChangeStartDate = (date: Date) => {
    const nextStartDate = startOfDay(date);

    setStartDate(nextStartDate);
    setEndDate(nextStartDate);
    setDateErrorMessage(null);
    setSelectedDayId(formatSelectedDayId(nextStartDate));
  };

  const handleChangeEndDate = (date: Date) => {
    const errorMessage = validateTravelPeriod(startDate, date);
    setDateErrorMessage(errorMessage);

    if (!errorMessage) {
      setEndDate(startOfDay(date));
    }
  };

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
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatSelectedDayId(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
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
