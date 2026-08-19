import type { CourseSummary } from '@/types/course';
import { CourseColors } from '@/constants/course-colors';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CourseListItem({ course, onPress }: { course: CourseSummary; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.name}>{course.courseName}</Text>
        <Text style={[styles.badge, course.courseType === 'AI' && styles.aiBadge]}>{course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text>
      </View>
      <Text style={styles.date}>{course.startDate} ~ {course.endDate}</Text>
      <View style={styles.footer}>
        <Text style={styles.count}>총 일정 {course.itemCount}개</Text>
        <View style={styles.loadButton}><Text style={styles.loadButtonText}>불러오기</Text><Text style={styles.arrow}>›</Text></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 20, backgroundColor: CourseColors.white, gap: 10, borderWidth: 1, borderColor: CourseColors.border, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' },
  name: { flex: 1, color: CourseColors.text, fontWeight: '800', fontSize: 18, lineHeight: 25 }, badge: { color: CourseColors.primaryDark, backgroundColor: CourseColors.primarySoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, fontSize: 11, fontWeight: '800', overflow: 'hidden' },
  aiBadge: { color: '#765C27', backgroundColor: '#F8EBCB' }, date: { color: CourseColors.muted, fontSize: 14 }, count: { color: CourseColors.muted, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }, loadButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: CourseColors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 }, loadButtonText: { color: CourseColors.white, fontWeight: '800', fontSize: 13 }, arrow: { color: CourseColors.white, fontWeight: '900', fontSize: 18, lineHeight: 16 },
});
