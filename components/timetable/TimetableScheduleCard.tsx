import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TimetableSchedule } from '@/types/timetable';

type TimetableScheduleCardProps = {
  onPress: () => void;
  schedule: TimetableSchedule;
  style: { height: number; top: number };
};

export function TimetableScheduleCard({ onPress, schedule, style }: TimetableScheduleCardProps) {
  const isActivity = schedule.kind === 'activity';
  const isRestaurant = schedule.kind === 'restaurant';
  const isPlace = isActivity || isRestaurant;
  const isSyncedReservation =
    isActivity &&
    schedule.source === 'reservation';
  const operatingTimeLabel = isPlace
    ? schedule.operatingType === 'always'
      ? '상시 운영'
      : `운영 ${schedule.operatingStartTime}~${schedule.operatingEndTime}`
    : null;
  const accessibilityDetails = isActivity
    ? isSyncedReservation
      ? `예약 완료 체험 일정, ${operatingTimeLabel}`
      : `체험 일정, ${operatingTimeLabel}${schedule.requiresReservation ? ', 예약 필요' : ', 예약 불필요'}`
    : isRestaurant
      ? `음식점 일정, ${operatingTimeLabel}`
    : '자유 일정';
  const timeLabel = `${schedule.startTime}~${schedule.endTime}`;
  const metadata = isSyncedReservation
    ? `${timeLabel} · 예약 완료`
    : isActivity
      ? `${timeLabel} · 체험`
      : isRestaurant
        ? `${timeLabel} · 음식점`
        : timeLabel;
  const icon = isActivity
    ? schedule.activityIcon
    : isRestaurant
      ? schedule.restaurantIcon
      : '🚩';

  return (
    <View
      style={[
        styles.card,
        isPlace ? styles.activityCard : styles.freeCard,
        style,
      ]}>
      <View
        pointerEvents="none"
        style={[styles.accent, isPlace ? styles.activityAccent : styles.freeAccent]}
      />
      <Pressable
        accessibilityHint={isSyncedReservation
          ? '예약 완료 일정의 내용을 확인합니다.'
          : '일정을 수정하거나 삭제합니다.'}
        accessibilityLabel={`${schedule.title}, ${schedule.startTime}부터 ${schedule.endTime}까지, ${accessibilityDetails}`}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.cardContent}>
        <View
          style={[
            styles.icon,
            isPlace ? styles.activityIcon : styles.freeIcon,
          ]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.textContent}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              isPlace && styles.activityTitle,
            ]}>
            {schedule.title}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.metadata,
              isPlace && styles.activityMetadata,
            ]}>
            {metadata}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: { backgroundColor: '#F1FAEE', borderColor: '#8BC783' },
  activityAccent: { backgroundColor: '#5D9A55' },
  activityIcon: { backgroundColor: '#DDF1D8' },
  activityMetadata: { color: '#527348' },
  activityTitle: { color: '#244C2A' },
  accent: { bottom: 8, borderRadius: 2, left: 5, position: 'absolute', top: 8, width: 4 },
  card: { borderRadius: 13, borderWidth: 1, flexDirection: 'row', left: 62, minHeight: 56, overflow: 'hidden', paddingLeft: 12, paddingRight: 9, position: 'absolute', right: 12, zIndex: 1 },
  cardContent: { alignItems: 'flex-start', alignSelf: 'stretch', flex: 1, flexDirection: 'row', gap: 10, minWidth: 0, paddingVertical: 10 },
  freeCard: { backgroundColor: '#FFFAF0', borderColor: '#D8C39B' },
  freeAccent: { backgroundColor: '#C7A66A' },
  freeIcon: { backgroundColor: '#F3E8D2' },
  icon: { alignItems: 'center', borderRadius: 10, height: 32, justifyContent: 'center', width: 32 },
  iconText: { fontSize: 17 },
  metadata: { color: '#7B6D57', fontSize: 12, lineHeight: 17, marginTop: 3 },
  textContent: { flex: 1, minWidth: 0 },
  title: { color: '#3F3526', fontSize: 15, fontWeight: '800', lineHeight: 20 },
});
