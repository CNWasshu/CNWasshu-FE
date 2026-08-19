import type { CourseSummary } from '@/types/course';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CourseListItem({ course, onPress }: { course: CourseSummary; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.name}>{course.courseName}</Text>
        <Text style={[styles.badge, course.courseType === 'AI' && styles.aiBadge]}>{course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text>
      </View>
      <Text style={styles.date}>{course.startDate} ~ {course.endDate}</Text>
      <Text style={styles.count}>일정 {course.itemCount}개</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 16, backgroundColor: '#FFFFFF', gap: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  pressed: { opacity: 0.7 }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' },
  name: { flex: 1, color: '#111827', fontWeight: '800', fontSize: 18 }, badge: { color: '#23735B', backgroundColor: '#E5F6F0', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10, fontSize: 12, fontWeight: '700' },
  aiBadge: { color: '#245FB3', backgroundColor: '#E8F1FF' }, date: { color: '#4B5563' }, count: { color: '#6B7280', fontSize: 13 },
});
