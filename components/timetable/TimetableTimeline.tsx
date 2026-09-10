import { StyleSheet, Text, View } from 'react-native';

import { TimetableScheduleCard } from '@/components/timetable/TimetableScheduleCard';
import { TIMETABLE_COLORS } from '@/components/timetable/timetable-colors';
import type { TimetableSchedule } from '@/types/timetable';
import { getTimelineHourRange, timeToMinutes } from '@/utils/timetable/time';

const HOUR_ROW_HEIGHT = 63;

type TimetableTimelineProps = {
  onSelectSchedule: (schedule: TimetableSchedule) => void;
  schedules: TimetableSchedule[];
};

export function TimetableTimeline({ onSelectSchedule, schedules }: TimetableTimelineProps) {
  const { endHour, startHour } = getTimelineHourRange(schedules);
  const timelineHours = Array.from(
    { length: endHour - startHour + 1 },
    (_, index) => startHour + index
  );

  return (
    <View style={styles.container}>
      {schedules.length === 0 ? (
        <Text style={styles.emptyText}>아직 등록된 일정이 없습니다.</Text>
      ) : null}
      {timelineHours.map((hour) => (
        <View key={hour} style={[styles.timeRow, hour === endHour && styles.lastTimeRow]}>
          <Text style={styles.hour}>{String(hour).padStart(2, '0')}:00</Text>
          <View style={styles.line} />
        </View>
      ))}
      {schedules.map((schedule) => {
        const startMinutes = timeToMinutes(schedule.startTime) ?? startHour * 60;
        const endMinutes = timeToMinutes(schedule.endTime) ?? startMinutes + 60;
        const top = 16 + ((startMinutes - startHour * 60) / 60) * HOUR_ROW_HEIGHT;
        const minimumCardHeight = 60;
        const height = Math.max(
          minimumCardHeight,
          ((endMinutes - startMinutes) / 60) * HOUR_ROW_HEIGHT - 4
        );

        return (
          <TimetableScheduleCard
            key={schedule.id}
            onPress={() => onSelectSchedule(schedule)}
            schedule={schedule}
            style={{ height, top }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: TIMETABLE_COLORS.card,
    borderColor: TIMETABLE_COLORS.border,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    paddingTop: 16,
  },
  emptyText: {
    color: TIMETABLE_COLORS.secondaryText,
    fontSize: 14,
    paddingBottom: 12,
    textAlign: 'center',
  },
  hour: {
    color: '#568438',
    fontSize: 13,
    fontWeight: '700',
    width: 44,
  },
  line: {
    backgroundColor: '#EFE2CB',
    flex: 1,
    height: 1,
  },
  lastTimeRow: {
    height: 0,
  },
  timeRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    height: 63,
    paddingHorizontal: 12,
  },
});
