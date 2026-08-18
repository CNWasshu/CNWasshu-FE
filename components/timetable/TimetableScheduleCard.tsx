import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TimetableSchedule } from '@/types/timetable';

type TimetableScheduleCardProps = {
  onPress: () => void;
  schedule: TimetableSchedule;
  style: { height: number; top: number };
};

export function TimetableScheduleCard({ onPress, schedule, style }: TimetableScheduleCardProps) {
  const isActivity = schedule.kind === 'activity';
  const operatingTimeLabel = isActivity
    ? schedule.operatingType === 'always'
      ? '상시 운영'
      : `운영 ${schedule.operatingStartTime}~${schedule.operatingEndTime}`
    : null;
  const accessibilityDetails = isActivity
    ? `체험 일정, ${operatingTimeLabel}${schedule.requiresReservation ? ', 예약 필요' : ', 예약 불필요'}`
    : '자유 일정';

  return (
    <Pressable
      accessibilityHint="일정을 수정하거나 삭제합니다."
      accessibilityLabel={`${schedule.title}, ${schedule.startTime}부터 ${schedule.endTime}까지, ${accessibilityDetails}`}
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, isActivity ? styles.activityCard : styles.freeCard, style]}>
      <View style={styles.headingRow}>
        <Text numberOfLines={1} style={[styles.title, isActivity && styles.activityTitle]}>
          {schedule.title}
        </Text>
        <View style={[styles.kindBadge, isActivity ? styles.activityBadge : styles.freeBadge]}>
          <Text style={[styles.kindBadgeText, isActivity ? styles.activityBadgeText : styles.freeBadgeText]}>
            {isActivity ? '체험' : '자유 일정'}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={[styles.time, isActivity && styles.activityTime]}>
        {schedule.startTime}~{schedule.endTime}
        {operatingTimeLabel ? ` · ${operatingTimeLabel}` : ''}
      </Text>
      {isActivity && schedule.requiresReservation ? (
        <Text numberOfLines={1} style={styles.reservation}>예약 필요</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activityBadge: { backgroundColor: '#DCEBFA' },
  activityBadgeText: { color: '#315F88' },
  activityCard: { backgroundColor: '#EDF6FF', borderColor: '#78A7CF' },
  activityTime: { color: '#496D8C' },
  activityTitle: { color: '#234E70' },
  card: { borderLeftWidth: 4, borderRadius: 10, left: 62, minHeight: 48, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5, position: 'absolute', right: 12, zIndex: 1 },
  freeBadge: { backgroundColor: '#D8EBCF' },
  freeBadgeText: { color: '#3F6832' },
  freeCard: { backgroundColor: '#E5F2DD', borderColor: '#8AB276' },
  headingRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  kindBadge: { borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  kindBadgeText: { fontSize: 9, fontWeight: '800' },
  reservation: { color: '#9A5A20', fontSize: 9, fontWeight: '800', marginTop: 1 },
  time: { color: '#527041', fontSize: 11, fontWeight: '700', marginTop: 2 },
  title: { color: '#294B2C', flex: 1, fontSize: 13, fontWeight: '800' },
});
