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
  const metadata = isActivity
    ? `${schedule.startTime}~${schedule.endTime} · ${schedule.location} · ${operatingTimeLabel}${schedule.requiresReservation ? ' · 예약 필요' : ''}`
    : `${schedule.startTime}~${schedule.endTime} · 직접 입력 · 자유 일정`;

  return (
    <View style={[styles.card, isActivity ? styles.activityCard : styles.freeCard, style]}>
      <Pressable
        accessibilityHint="일정을 수정하거나 삭제합니다."
        accessibilityLabel={`${schedule.title}, ${schedule.startTime}부터 ${schedule.endTime}까지, ${accessibilityDetails}`}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.cardContent}>
        <View style={[styles.icon, isActivity ? styles.activityIcon : styles.freeIcon]}>
          <Text style={styles.iconText}>{isActivity ? schedule.activityIcon : '🚩'}</Text>
        </View>
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={[styles.title, isActivity && styles.activityTitle]}>
            {schedule.title}
          </Text>
          <Text numberOfLines={1} style={[styles.metadata, isActivity && styles.activityMetadata]}>
            {metadata}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityHint="수정 또는 삭제 화면을 엽니다."
        accessibilityLabel={`${schedule.title} 일정 관리`}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.manageButton}>
        <Text style={styles.manageButtonText}>−</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: { backgroundColor: '#F1FAEE', borderColor: '#8BC783' },
  activityIcon: { backgroundColor: '#DDF1D8' },
  activityMetadata: { color: '#527348' },
  activityTitle: { color: '#244C2A' },
  card: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flexDirection: 'row', left: 62, minHeight: 56, overflow: 'hidden', paddingHorizontal: 8, position: 'absolute', right: 12, zIndex: 1 },
  cardContent: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 9, minWidth: 0, paddingVertical: 6 },
  freeCard: { backgroundColor: '#FFFAF0', borderColor: '#D8C39B' },
  freeIcon: { backgroundColor: '#F3E8D2' },
  icon: { alignItems: 'center', borderRadius: 11, height: 34, justifyContent: 'center', width: 34 },
  iconText: { fontSize: 17 },
  manageButton: { alignItems: 'center', backgroundColor: '#F3E8D2', borderRadius: 10, height: 36, justifyContent: 'center', marginLeft: 7, width: 30 },
  manageButtonText: { color: '#806E4F', fontSize: 17, lineHeight: 19 },
  metadata: { color: '#7B6D57', fontSize: 10, lineHeight: 15, marginTop: 2 },
  textContent: { flex: 1, minWidth: 0 },
  title: { color: '#3F3526', fontSize: 13, fontWeight: '800', lineHeight: 18 },
});
