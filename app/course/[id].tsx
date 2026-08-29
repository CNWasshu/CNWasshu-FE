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
            <Text style={styles.heroEyebrow}>{course.courseType === 'AI' ? 'AI RECOMMENDED COURSE' : 'MY SAVED COURSE'}</Text>
            <Text style={styles.title}>{course.courseName}</Text>
            <View style={styles.metaRow}><Text style={styles.typeBadge}>{course.courseType === 'AI' ? 'AI 추천 코스' : '내가 만든 코스'}</Text><Text style={styles.people}>{course.peopleCount}명</Text></View>
            <Text style={styles.date}>◷  {course.startDate} ~ {course.endDate}</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.section}><View style={styles.sectionHeading}><Text style={styles.sectionIcon}>⌖</Text><Text style={styles.sectionTitle}>코스 지도</Text></View><CourseMap items={course.items} /></View>
            <View style={styles.section}><View style={styles.sectionHeading}><Text style={styles.sectionIcon}>☷</Text><Text style={styles.sectionTitle}>여행 일정</Text></View><CourseSchedule items={course.items} /></View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CourseColors.background }, container: { paddingBottom: 46 },
  hero: { backgroundColor: CourseColors.primary, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 34, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, gap: 9 }, heroEyebrow: { color: '#CFE3CC', fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }, title: { fontSize: 27, lineHeight: 35, fontWeight: '900', color: CourseColors.white }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, typeBadge: { color: CourseColors.primaryDark, backgroundColor: '#E9F4E6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, fontWeight: '800', fontSize: 12, overflow: 'hidden' }, people: { color: '#E2EFE0', fontSize: 13 }, date: { color: CourseColors.white, marginTop: 3, fontSize: 14, fontWeight: '700' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 18, marginTop: -12, gap: 24 }, section: { backgroundColor: CourseColors.white, borderRadius: 24, borderWidth: 1, borderColor: CourseColors.border, padding: 17, gap: 15, shadowColor: '#5A4932', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 }, sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 }, sectionIcon: { color: CourseColors.primary, fontSize: 18, fontWeight: '900' }, sectionTitle: { color: CourseColors.text, fontSize: 19, fontWeight: '900' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }, loadingText: { color: CourseColors.muted }, state: { alignItems: 'center', padding: 30, gap: 16 }, error: { color: CourseColors.error, textAlign: 'center' }, retryButton: { borderWidth: 1, borderColor: CourseColors.primary, borderRadius: 13, paddingHorizontal: 20, paddingVertical: 11 }, retry: { color: CourseColors.primary, fontWeight: '900' },
});
