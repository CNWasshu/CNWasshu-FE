import { CourseMap } from '@/components/course/CourseMap';
import { CourseSchedule } from '@/components/course/CourseSchedule';
import { CourseColors } from '@/constants/course-colors';
import { useCourse } from '@/hooks/useCourse';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const parsedId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : null;
  const { course, loading, error, refetch } = useCourse(parsedId);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: '코스 상세',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityLabel="코스 목록으로 이동"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => router.replace('/(tabs)/course')}>
              <Ionicons color={CourseColors.white} name="arrow-back" size={24} />
            </Pressable>
          ),
          headerStyle: { backgroundColor: CourseColors.primary },
          headerTintColor: CourseColors.white,
          headerShadowVisible: false,
        }}
      />
      {loading ? <View style={styles.loading}><ActivityIndicator size="large" color={CourseColors.primary} /><Text style={styles.loadingText}>코스를 불러오고 있어요.</Text></View> : null}
      {!loading && error ? <View style={styles.state}><Text style={styles.error}>{error}</Text><Pressable style={styles.retryButton} onPress={() => void refetch()}><Text style={styles.retry}>다시 시도</Text></Pressable></View> : null}
      {!loading && course ? (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.typeBadge}>{course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text>
            <Text style={styles.title}>{course.courseName}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="calendar-outline" size={16} /><Text style={styles.summaryText}>{course.startDate} ~ {course.endDate}</Text></View>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="people-outline" size={16} /><Text style={styles.summaryText}>{course.peopleCount}명</Text></View>
              <View style={styles.summaryItem}><Ionicons color="#E2EFE0" name="list-outline" size={16} /><Text style={styles.summaryText}>일정 {course.items.length}개</Text></View>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.mapSection}><View style={styles.sectionHeading}><Ionicons color={CourseColors.primary} name="map-outline" size={20} /><Text style={styles.sectionTitle}>코스 지도</Text></View><CourseMap items={course.items} /></View>
            <View style={styles.scheduleSection}><View style={styles.sectionHeading}><Ionicons color={CourseColors.primary} name="list-outline" size={20} /><Text style={styles.sectionTitle}>여행 일정</Text></View><CourseSchedule items={course.items} /></View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.background }, container: { paddingBottom: 46 },
  hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 7, paddingBottom: 26, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, gap: 10 }, typeBadge: { alignSelf: 'flex-start', color: CourseColors.primaryDark, backgroundColor: '#E9F4E6', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 4, fontWeight: '800', fontSize: 12, overflow: 'hidden' }, title: { fontSize: 25, lineHeight: 32, fontWeight: '900', color: CourseColors.white }, summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, summaryItem: { alignItems: 'center', flexDirection: 'row', gap: 5 }, summaryText: { color: '#F4FAF2', fontSize: 12, fontWeight: '700' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 16, marginTop: 16, gap: 22 }, mapSection: { backgroundColor: CourseColors.white, borderRadius: 18, borderWidth: 1, borderColor: CourseColors.border, padding: 15, gap: 13 }, scheduleSection: { gap: 13 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 }, sectionTitle: { color: CourseColors.text, fontSize: 19, fontWeight: '900' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, loadingText: { color: CourseColors.muted }, state: { alignItems: 'center', padding: 30, gap: 16 }, error: { color: CourseColors.error, textAlign: 'center' }, retryButton: { borderWidth: 1, borderColor: CourseColors.primary, borderRadius: 13, paddingHorizontal: 20, paddingVertical: 11 }, retry: { color: CourseColors.primary, fontWeight: '900' },
});
