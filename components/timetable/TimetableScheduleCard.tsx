import { Pressable, StyleSheet, Text } from 'react-native';

import type { TimetableSchedule } from '@/types/timetable';

type TimetableScheduleCardProps = {
  onPress: () => void;
  schedule: TimetableSchedule;
  style: { height: number; top: number };
};

export function TimetableScheduleCard({ onPress, schedule, style }: TimetableScheduleCardProps) {
  return (
    <Pressable
      accessibilityHint="일정을 수정하거나 삭제합니다."
      accessibilityLabel={`${schedule.title}, ${schedule.startTime}부터 ${schedule.endTime}까지`}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, style]}>
      <Text numberOfLines={1} style={styles.title}>{schedule.title}</Text>
      <Text style={styles.time}>{schedule.startTime}~{schedule.endTime}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#E5F2DD', borderColor: '#8AB276', borderLeftWidth: 4, borderRadius: 10, left: 62, minHeight: 36, paddingHorizontal: 10, paddingVertical: 6, position: 'absolute', right: 12, zIndex: 1 },
  time: { color: '#527041', fontSize: 11, fontWeight: '700', marginTop: 2 },
  title: { color: '#294B2C', fontSize: 13, fontWeight: '800' },
});
