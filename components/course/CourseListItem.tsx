import type { CourseSummary } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function getTripDuration(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T00:00:00`).getTime();
  const dayCount = Math.round((end - start) / (24 * 60 * 60 * 1000)) + 1;

  if (!Number.isFinite(dayCount) || dayCount < 1) return '여행 일정';
  return dayCount === 1 ? '당일 여행' : `${dayCount - 1}박 ${dayCount}일`;
}

function getCompactDateRange(startDate: string, endDate: string) {
  const [, startMonth, startDay] = startDate.split('-');
  const [, endMonth, endDay] = endDate.split('-');
  if (!startMonth || !startDay || !endMonth || !endDay) return `${startDate} - ${endDate}`;
  return startMonth === endMonth
    ? `${startMonth}.${startDay}–${endDay}`
    : `${startMonth}.${startDay}–${endMonth}.${endDay}`;
}

export function CourseListItem({ course, onPress }: { course: CourseSummary; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.badgeRow}>
        <Text style={[styles.typeBadge, course.courseType === 'AI' ? styles.aiBadge : styles.userBadge]}>{course.courseType === 'AI' ? '✦ AI' : 'MY'}</Text>
        <View style={styles.durationBadge}><Text style={styles.durationText}>{getTripDuration(course.startDate, course.endDate)}</Text></View>
      </View>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>{course.courseName}</Text>
      <View style={styles.footer}>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} style={styles.metaText}>{getCompactDateRange(course.startDate, course.endDate)} · 일정 {course.itemCount}개</Text>
        <View style={styles.action}><Text style={styles.loadButtonText}>코스 보기</Text><Text style={styles.arrow}>›</Text></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 18, borderWidth: 1, flexBasis: '48%', minHeight: 156, padding: 13 },
  pressed: { backgroundColor: '#FCF7ED', opacity: 0.82 }, badgeRow: { alignItems: 'center', flexDirection: 'row', gap: 5, justifyContent: 'space-between' },
  typeBadge: { borderRadius: 8, fontSize: 9, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 4 }, aiBadge: { backgroundColor: '#F8EBCB', color: '#765C27' }, userBadge: { backgroundColor: '#F1E9DA', color: '#746755' },
  durationBadge: { backgroundColor: CourseColors.primarySoft, borderRadius: 8, flexShrink: 0, paddingHorizontal: 7, paddingVertical: 4 }, durationText: { color: CourseColors.primaryDark, fontSize: 9, fontWeight: '900' },
  name: { color: CourseColors.text, fontSize: 16, fontWeight: '900', lineHeight: 21, marginTop: 10, minHeight: 42 },
  footer: { alignItems: 'center', borderTopColor: '#F2E8D7', borderTopWidth: 1, flexDirection: 'row', gap: 5, justifyContent: 'space-between', marginTop: 10, paddingTop: 9 }, metaText: { color: CourseColors.muted, flex: 1, fontSize: 10, fontWeight: '700', minWidth: 0 }, action: { alignItems: 'center', flexDirection: 'row', flexShrink: 0 }, loadButtonText: { color: CourseColors.primaryDark, fontSize: 10, fontWeight: '900' }, arrow: { color: CourseColors.primary, fontSize: 15, fontWeight: '900', lineHeight: 13, marginLeft: 2 },
});
