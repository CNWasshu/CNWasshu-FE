import type { CourseSummary } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { getTripStatus } from '@/utils/course-list';
import Ionicons from '@expo/vector-icons/Ionicons';
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

export function CourseListItem({ course, onPress, singleColumn }: { course: CourseSummary; onPress: () => void; singleColumn: boolean }) {
  const tripStatus = getTripStatus(course);

  return (
    <Pressable accessibilityLabel={`${course.courseName} 코스 상세 보기`} accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, singleColumn && styles.singleColumnCard, pressed && styles.pressed]}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>{course.courseName}</Text>
          <Text style={[styles.statusBadge, tripStatus.type === 'ONGOING' && styles.ongoingBadge, tripStatus.type === 'UPCOMING' && styles.upcomingBadge, tripStatus.type === 'PAST' && styles.pastBadge]}>{tripStatus.label}</Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons color={CourseColors.primary} name="calendar-outline" size={16} />
          <Text style={styles.dateText}>{getCompactDateRange(course.startDate, course.endDate)}</Text>
          <Text style={styles.durationText}>{getTripDuration(course.startDate, course.endDate)}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.metaGroup}>
            <Text style={styles.itemCount}>일정 {course.itemCount}개</Text>
            <Text style={[styles.typeBadge, course.courseType === 'AI' ? styles.aiBadge : styles.userBadge]}>{course.courseType === 'AI' ? 'AI 추천' : '내가 만든 코스'}</Text>
          </View>
          <Ionicons accessibilityElementsHidden color={CourseColors.primary} name="chevron-forward" size={20} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CourseColors.white, borderColor: CourseColors.border, borderRadius: 16, borderWidth: 1, flexBasis: '48%', minWidth: 0, padding: 15 },
  singleColumnCard: { flexBasis: '100%' }, pressed: { backgroundColor: '#FCF7ED', borderColor: '#CFDEC9' }, content: { gap: 10 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 8 }, name: { color: CourseColors.text, flex: 1, fontSize: 17, fontWeight: '900', lineHeight: 23 },
  statusBadge: { borderRadius: 999, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4 }, ongoingBadge: { backgroundColor: CourseColors.primarySoft, color: CourseColors.primaryDark }, upcomingBadge: { backgroundColor: '#F6F1DF', color: '#6D623D' }, pastBadge: { backgroundColor: '#F1EEE8', color: '#746F67' },
  dateRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, dateText: { color: CourseColors.text, fontSize: 13, fontWeight: '700' }, durationText: { color: CourseColors.primaryDark, fontSize: 12, fontWeight: '800' },
  footer: { alignItems: 'center', borderTopColor: '#F2E8D7', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }, metaGroup: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, itemCount: { color: CourseColors.muted, fontSize: 12, fontWeight: '700' },
  typeBadge: { borderRadius: 8, fontSize: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4 }, aiBadge: { backgroundColor: '#F8EBCB', color: '#765C27' }, userBadge: { backgroundColor: '#F1E9DA', color: '#746755' },
});
