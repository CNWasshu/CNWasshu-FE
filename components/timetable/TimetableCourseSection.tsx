import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { TimetableDayTabs } from '@/components/timetable/TimetableDayTabs';
import { TimetableTimeline } from '@/components/timetable/TimetableTimeline';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import type { TimetableDay, TimetableSchedule } from '@/types/timetable';

type TimetableCourseSectionProps = {
  days: TimetableDay[];
  onAddSchedule: () => void;
  onSelectDay: (dayId: string) => void;
  onSelectSchedule: (schedule: TimetableSchedule) => void;
  selectedDayId: string;
  selectedSchedules: TimetableSchedule[];
};

export function TimetableCourseSection({
  days,
  onAddSchedule,
  onSelectDay,
  onSelectSchedule,
  selectedDayId,
  selectedSchedules,
}: TimetableCourseSectionProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  return (
    <View style={styles.container}>
      <View style={[styles.headingRow, isCompact && styles.compactHeadingRow]}>
        <View style={[styles.headingText, isCompact && styles.compactHeadingText]}>
          <Text style={styles.title}>시간대별 코스 설계</Text>
          <Text style={styles.description}>일정 시간에 맞춰 자유 일정이나 체험을 추가해 보세요.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onAddSchedule}
          style={[styles.addButton, isCompact && styles.compactAddButton]}>
          <Ionicons color="#FFFFFF" name="add" size={17} />
          <Text style={styles.addButtonText}>일정 추가</Text>
        </Pressable>
      </View>

      <View style={styles.dayTabs}>
        <TimetableDayTabs
          days={days}
          onSelectDay={onSelectDay}
          selectedDayId={selectedDayId}
        />
      </View>

      <TimetableTimeline onSelectSchedule={onSelectSchedule} schedules={selectedSchedules} />

      <Pressable accessibilityRole="button" style={styles.saveButton}>
        <Text style={styles.saveButtonText}>코스 저장하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: TIMETABLE_COLORS.primary,
    borderRadius: 999,
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  container: {
    backgroundColor: TIMETABLE_COLORS.card,
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
  },
  compactAddButton: {
    alignSelf: 'flex-end',
  },
  compactHeadingRow: {
    alignItems: 'stretch',
  },
  compactHeadingText: {
    flexBasis: '100%',
  },
  dayTabs: {
    marginHorizontal: -14,
    marginVertical: 12,
  },
  description: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  headingText: {
    flex: 1,
    minWidth: 180,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: TIMETABLE_COLORS.primary,
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    color: TIMETABLE_COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
